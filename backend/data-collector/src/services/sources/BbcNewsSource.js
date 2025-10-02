import RSSParser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import BaseNewsSource from "./BaseNewsSource.js";
import { getSourceConfig } from "../../config/external.js";
import { normalizeUrl } from "../../utils/normalizeUrl.js";

class BbcNewsSource extends BaseNewsSource {
  constructor() {
    super(getSourceConfig("bbc"));
    this.parser = new RSSParser();
  }

  async fetchNews() {
    try {
      const feed = await this.parser.parseURL(this.config.urls.rss);

      const textItems = feed.items.filter((item) =>
        this.isTextArticle(item.link)
      );

      const articles = await Promise.all(
        textItems.map((item) => this.enrichWithFullText(item))
      );

      return articles;
    } catch (err) {
      console.error(`[BBC] Error fetching RSS:`, err.message);
      return [];
    }
  }

  async enrichWithFullText(item) {
    let fullContent = null;
    let images = [];

    const cleanLink = normalizeUrl(item.link);

    try {
      const { data: html } = await axios.get(cleanLink, { timeout: 5000 });
      const $ = cheerio.load(html);

      $(
        "article noscript, \
      article .media-player, \
      article figure, \
      article [data-component='ad-slot'], \
      article [data-component='tags'], \
      article .ssrcss-1kczw0k-PromoGroup"
      ).remove();

      fullContent = $("article").text().trim();

      //   images = $("article img")
      //     .map((_, el) => $(el).attr("src"))
      //     .get();
    } catch (err) {
      console.error(`[BBC] Error fetching full article:`, err.message);
    }

    // summary: item.contentSnippet,
    //   images,

    return this.toStandardFormat({
      title: item.title,
      content: fullContent,
      sourceUrl: cleanLink,
      publishedAt: item.pubDate,
    });
  }

  isTextArticle(url) {
    if (!url) return false;

    const blockedPatterns = [
      "/news/videos/",
      "/news/av/",
      "/in-pictures-",
      "/news/live/",
      "/resources/",
    ];

    return !blockedPatterns.some((pattern) => url.includes(pattern));
  }
}

const bbcNewsSource = new BbcNewsSource();
export { bbcNewsSource };
