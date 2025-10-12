import axios from "axios";
import pLimit from "p-limit";
class BaseNewsSource {
  constructor(config, sourceName) {
    if (!config) {
      throw new Error("Config is required for news source");
    }

    this.config = config;
    this.sourceName = sourceName || config.name;

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
