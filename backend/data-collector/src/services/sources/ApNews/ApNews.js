import BaseNewsSource from "../BaseNewsSource.js";
import { getSourceConfig } from "../../../config/external.js";
import * as cheerio from "cheerio";
import Bottleneck from "bottleneck";

import { getArticleUrls } from "./sources/sitemap/getArticleUrls.js";
import { extractPublishDate } from "./extractors/date.js";
import { extractArticleText } from "./extractors/articleText.js";
import { extractArticleImages } from "./extractors/images/index.js";
import { handleRateLimit } from "./handleRateLimit.js";
import { tempUrlsArray } from "./tempUrlsArray.js";

import { filterFulfilledPromises } from "../../../utils/promises.js";
class ApNews extends BaseNewsSource {
  constructor() {
    super(getSourceConfig("ap"));

    this.sitemapIndex = this.config.urls.sitemapIndex;

    this.articlesPerMonth = 10;
    this.articlesYear = "2024";

    this.configParams = {
      baseHttpClient: this.baseHttpClient,
      sitemapIndexUrl: this.sitemapIndex,
      articlesPerMonth: this.articlesPerMonth,
      articleImageLimit: this.articleImageLimit,
      articlesYear: this.articlesYear,
    };

    this.batchSize = 3000;
    this.minDelayBetweenFetchArticles = 0.1;
    this.maxConcurrentFetches = 300;

    this.pause429Duration = 120_000;
    this.fetchExpirationTime = 60_000;

    this.scheduleParams = { expiration: this.fetchExpirationTime };

    this.limiter = new Bottleneck({
      maxConcurrent: this.maxConcurrentFetches,
      minTime: this.minDelayBetweenFetchArticles,
    });

    this.fetchedArticlesCounter = 0;
    this.rescheduledFetchedArticlesCounter = 0;

    this.isRequestsPaused = false;
  }

  async fetchNews(saveDuringFetch = true) {
    try {
      console.log("[AP] Starting news fetch...");
      const startFetchingNewsTime = Date.now();

      this.fetchedArticlesCounter = 0;
      this.rescheduledFetchedArticlesCounter = 0;

      // const urlsToParse = await getArticleUrls(this.configParams);
      const urlsToParse = tempUrlsArray.slice(0, 900);

      const successfulArticles = [];
      for (let i = 0; i < urlsToParse.length; i += this.batchSize) {
        const batch = urlsToParse.slice(i, i + this.batchSize);

        const batchNews = filterFulfilledPromises(
          await Promise.allSettled(
            batch.map((url) =>
              this.scheduleTask(this.limiter, this.scheduleParams, () =>
                this.fetchFullArticle(url)
              )
            )
          )
        );

        if (saveDuringFetch) {
          const startSavingBatchTime = Date.now();
          console.log(`Start saving batch - ${i}`);
          await this.saveToDB(batchNews);
          console.log(
            `Batch - ${i} Saving time - ${
              (Date.now() - startSavingBatchTime) / 1000
            }`
          );
        } else {
          successfulArticles.push(...batchNews);
        }

        console.log(`----------------- Last Batch - ${i / this.batchSize}`);
      }

      console.log(
        `[AP] Total articles fetched: ${
          successfulArticles.length
        }. Duration - ${(Date.now() - startFetchingNewsTime) / 1000}`
      );
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
      if (err.response?.status === 429) {
        console.warn(`⚠️ 429 Too Many Requests at: ${url}`);
        const ctx = {
          limiter: this.limiter,
          scheduleParams: this.scheduleParams,
          scheduleTask: this.scheduleTask,
          isPaused: () => this.isRequestsPaused,
          setIsPaused: (v) => (this.isRequestsPaused = v),
          pause429Duration: this.pause429Duration,
        };
        await handleRateLimit(ctx, () => this.fetchFullArticle(url));
        was429error = true;
      } else {
        console.error(`[AP] Error fetching article:`, err.message);
      }
      return null;
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
}

const apNews = new ApNews();
export { apNews };

// import fs from "fs";
// const jsonData = JSON.stringify(urlsToParse, null, 2);
// const jsContent = `export const tempUrlsArray = ${jsonData};\n`;
// fs.writeFileSync("./tempUrlsArray.js", jsContent, "utf-8");
// return [];
