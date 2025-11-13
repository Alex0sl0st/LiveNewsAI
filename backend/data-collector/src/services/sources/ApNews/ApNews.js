import BaseNewsSource from "../BaseNewsSource.js";
import { getSourceConfig } from "../../../config/external.js";
import * as cheerio from "cheerio";
import Bottleneck from "bottleneck";

import { getArticleUrls } from "./sources/sitemap/getArticleUrls.js";
import { extractPublishDate } from "./extractors/date.js";
import { extractArticleText } from "./extractors/articleText.js";
import { extractArticleImages } from "./extractors/images/index.js";
import { tempUrlsArray } from "./tempUrlsArray.js";

const limiter = new Bottleneck({
  maxConcurrent: 300, // максимум 3 запити одночасно
  minTime: 0.1, // 0.8 секунди між новими запитами
});

const scheduleParams = { expiration: 60_000 };
let isPaused = false;
const pause429Duration = 120_000;

// 520 requests are limit fro AP
class ApNews extends BaseNewsSource {
  constructor() {
    super(getSourceConfig("ap"));

    this.sitemapIndex = this.config.urls.sitemapIndex;

    this.articlesPerMonth = 10;
    this.delayBetweenArticles = 500;
    this.articlesYear = "2024";

    this.configParams = {
      baseHttpClient: this.baseHttpClient,
      sitemapIndexUrl: this.sitemapIndex,
      articlesPerMonth: this.articlesPerMonth,
      delayBetweenArticles: this.delayBetweenArticles,
      articleImageLimit: this.articleImageLimit,
      articlesYear: this.articlesYear,
    };

    this.fetchedArticlesCounter = 0;
    this.rescheduledFetchedArticlesCounter = 0;
  }

  async fetchNews() {
    try {
      console.log("[AP] Starting news fetch...");

      // const urlsToParse = await getArticleUrls(this.configParams);
      const urlsToParse = tempUrlsArray;

      this.fetchedArticlesCounter = 0;
      this.rescheduledFetchedArticlesCounter = 0;
      // const articles = await Promise.allSettled(
      //   urlsToParse.map((url) =>
      //     this.rssPLimit(() => this.fetchFullArticle(url))
      //   )
      // );
      const articles = await Promise.allSettled(
        urlsToParse.map((url) =>
          limiter.schedule(scheduleParams, () => this.fetchFullArticle(url))
        )
      );

      const successfulArticles = articles
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);

      console.log(`[AP] Total articles fetched: ${successfulArticles.length}`);
      return successfulArticles;
    } catch (err) {
      console.error(`[AP] Error fetching news:`, err.message);
      return [];
    }
  }

  async fetchFullArticle(url) {
    const startTime = Date.now();
    let was429error = false;
    try {
      const { data: html } = await this.baseHttpClient.get(url);
      const $ = cheerio.load(html);

      const title = this.getTitleFromArticle($);
      const images = extractArticleImages({ $, ...this.configParams }) || [];
      const publishedAt = extractPublishDate($);
      const content = extractArticleText($);

      if (!content || content.length < this.minContentLength) return null;

      return this.toStandardFormat({
        title,
        content,
        sourceUrl: url,
        publishedAt,
        images,
      });
    } catch (err) {
      // якщо помилка 429
      if (err.response?.status === 429) {
        console.warn(`⚠️ 429 Too Many Requests at: ${url}`);
        await this.handleRateLimit(url);
        was429error = true;
      } else {
        console.error(`[AP] Error fetching article:`, err.message);
      }
      return null;
      // console.error(`[AP] Error fetching article:`, err.message);
      // return null;
    } finally {
      if (!was429error) {
        this.fetchedArticlesCounter += 1;
      } else {
        this.rescheduledFetchedArticlesCounter += 1;
      }

      console.log((Date.now() - startTime) / 1000);

      if (this.fetchedArticlesCounter % 10 === 0) {
        console.log(
          "---------------------------------------",
          this.fetchedArticlesCounter,
          "|",
          this.rescheduledFetchedArticlesCounter,
          "|",
          this.fetchedArticlesCounter + this.rescheduledFetchedArticlesCounter
        );
      }
    }
  }

  // ==========================
  async handleRateLimit(url) {
    // якщо вже стоїть пауза — просто чекаємо
    if (isPaused) {
      console.log("⏳ Bottleneck already paused, waiting...");
      // додаємо цю URL пізніше, коли черга відновиться
      limiter.schedule(scheduleParams, () => this.fetchFullArticle(url));
      return;
    }

    console.log("🛑 Received 429 — pausing requests for 2 minutes...");
    limiter.updateSettings({ reservoir: 0 });

    // ставимо прапорець
    isPaused = true;

    // чекаємо 2 хвилини (120000 мс)
    await new Promise((res) => setTimeout(res, pause429Duration));

    // відновлюємо
    limiter.updateSettings({ reservoir: null });
    isPaused = false;

    console.log("▶️ Resuming after 2-minute cooldown...");

    // додаємо “проблемне” посилання назад у чергу
    limiter.schedule(scheduleParams, () => this.fetchFullArticle(url));
  }
}

const apNews = new ApNews();
export { apNews };

// import fs from "fs";
// const jsonData = JSON.stringify(urlsToParse, null, 2);
// const jsContent = `export const tempUrlsArray = ${jsonData};\n`;
// fs.writeFileSync("./tempUrlsArray.js", jsContent, "utf-8");
// return [];
