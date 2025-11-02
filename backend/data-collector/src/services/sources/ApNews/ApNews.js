import BaseNewsSource from "../BaseNewsSource.js";
import { getSourceConfig } from "../../../config/external.js";
import * as cheerio from "cheerio";

import { getArticleUrls } from "./sources/sitemap/getArticleUrls.js";
import { extractPublishDate } from "./extractors/date.js";
import { extractArticleText } from "./extractors/articleText.js";
import { extractArticleImages } from "./extractors/images/index.js";

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
  }

  async fetchNews() {
    try {
      console.log("[AP] Starting news fetch...");

      const urlsToParse = await getArticleUrls(this.configParams);

      const articles = await Promise.allSettled(
        urlsToParse.map((url) =>
          this.rssPLimit(() => this.fetchFullArticle(url))
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
    try {
      const { data: html } = await this.baseHttpClient.get(url);
      const $ = cheerio.load(html);

      const title =
        $("h1").first().text().trim() ||
        $("h2").first().text().trim() ||
        this.defaultTitle;

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
      console.error(`[AP] Error fetching article:`, err.message);
      return null;
    }
  }

  toStandardFormat(article) {
    return {
      title: article.title,
      content: article.content,
      sourceUrl: article.sourceUrl,
      publishedAt: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : null,
      images: article.images || [],
    };
  }
}

const apNews = new ApNews();
export { apNews };
