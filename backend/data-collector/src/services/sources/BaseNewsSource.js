import axios from "axios";
import pLimit from "p-limit";

import { newsService } from "../../shared.js";
class BaseNewsSource {
  constructor(config, sourceName) {
    if (!config) {
      throw new Error("Config is required for news source");
    }

    this.newsService = newsService;

    this.config = config;
    this.sourceName = sourceName || config.name;

    this.defaultTitle = "No title";

    this.articleImageLimit = 20;
    this.minContentLength = 80;

    this.baseHttpClientConfig = {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    };

    this.baseHttpClient = axios.create(this.baseHttpClientConfig);

    const concurrency = config?.concurrencyRssPLimit || 20;
    this.rssPLimit = pLimit(concurrency);
  }

  async fetchNews() {
    throw new Error("fetchNews() must be implemented in subclass");
  }

  getTitleFromArticle($) {
    const title =
      $("h1").first().text().trim() || $("h2").first().text().trim();

    return title || this.defaultTitle;
  }

  async saveToDB(news) {
    const newsPromises = news
      .filter((item) => item)
      .map((singleNews) => {
        try {
          return this.newsService.create(singleNews);
        } catch (err) {
          console.log("Error in saveToDB", err);
        }
      });

    await Promise.allSettled(newsPromises);
  }

  toStandardFormat({
    title,
    content,
    sourceUrl,
    publishedAt,
    summary,
    images,
    sourceName = this.sourceName,
  }) {
    return {
      title: title?.trim() || "Untitled",
      content: content?.trim(),
      sourceName,
      sourceUrl,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      summary: summary?.trim() || null,
      images: images || [],
    };
  }
}

export default BaseNewsSource;
