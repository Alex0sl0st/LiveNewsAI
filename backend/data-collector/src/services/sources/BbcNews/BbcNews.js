import RSSParser from "rss-parser";
import * as cheerio from "cheerio";
import BaseNewsSource from "../BaseNewsSource.js";
import { getSourceConfig } from "../../../config/external.js";
import { normalizeUrl } from "../../../utils/normalizeUrl.js";

import { isTextArticle } from "./sources/rss/getArticleUrls.js";
import { extractArticleText } from "./extractors/articleText.js";
import { extractArticleMedia } from "./extractors/images/index.js";
import { extractPublishDate } from "./extractors/date.js";

class BbcNews extends BaseNewsSource {
  constructor() {
    super(getSourceConfig("bbc"));
    this.parser = new RSSParser();
  }

  async fetchNews() {
    try {
      const feed = await this.parser.parseURL(this.config.urls.rss);

      const textItems = feed.items.filter((item) => isTextArticle(item.link));

      const articles = await Promise.all(
        textItems.map((item) =>
          this.rssPLimit(() => this.fetchFullArticle(item))
        )
      );

      return articles;
    } catch (err) {
      console.error(`[BBC] Error fetching RSS:`, err.message);
      return [];
    }
  }

  async fetchFullArticle(item) {
    try {
      const cleanLink = normalizeUrl(item.link);

      const { data: html } = await this.baseHttpClient.get(cleanLink);
      const $ = cheerio.load(html);

      const title = this.getTitleFromArticle($);
      const images = extractArticleMedia($, this.articleImageLimit);
      const publishDate = extractPublishDate($);
      const content = extractArticleText($);

      if (!content || content.length < this.minContentLength) {
        return null; // skip non-text
      }

      return this.toStandardFormat({
        title,
        content,
        sourceUrl: cleanLink,
        publishedAt: publishDate,
        images: images || [],
      });
    } catch (err) {
      console.error(`[BBC] Error fetching full article:`, err.message);
      return null;
    }
  }
}

const bbcNews = new BbcNews();
export { bbcNews };
