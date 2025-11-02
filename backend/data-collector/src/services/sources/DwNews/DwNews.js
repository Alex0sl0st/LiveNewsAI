import RSSParser from "rss-parser";
import * as cheerio from "cheerio";
import BaseNewsSource from "../BaseNewsSource.js";
import { getSourceConfig } from "../../../config/external.js";
import { normalizeUrl } from "../../../utils/normalizeUrl.js";

import { parseRSSFeed } from "./sources/rss/getArticleUrls.js";
import { extractArticleText } from "./extractors/articleText.js";
import { extractPublishDate } from "./extractors/date.js";
import { extractArticleImages } from "./extractors/images/index.js";

class DwNews extends BaseNewsSource {
  constructor() {
    super(getSourceConfig("dw"));
    this.parser = new RSSParser();
  }

  async fetchNews() {
    try {
      const feedItems = await parseRSSFeed(this.parser, this.config.urls.rss);

      const articles = await Promise.allSettled(
        feedItems.map((item) =>
          this.rssPLimit(() => this.fetchFullArticle(item))
        )
      );

      return articles
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);
    } catch (err) {
      console.error(`[DW] Error fetching RSS:`, err.message);
      return [];
    }
  }

  async fetchFullArticle(item) {
    try {
      const url = normalizeUrl(item.link);
      const { data: html } = await this.baseHttpClient.get(url);
      const $ = cheerio.load(html);

      const title = this.getTitleFromArticle($);
      const images = extractArticleImages($, this.articleImageLimit);
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
      console.error(`[DW] Error fetching article:`, err.message);
      return null;
    }
  }
}

const dwNews = new DwNews();
export { dwNews };
