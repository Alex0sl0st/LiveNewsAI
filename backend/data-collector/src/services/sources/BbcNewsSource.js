import RSSParser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import BaseNewsSource from "./BaseNewsSource.js";
import { getSourceConfig } from "../../config/external.js";

class BbcNewsSource extends BaseNewsSource {
  constructor() {
    super(getSourceConfig("bbc"));
    this.parser = new RSSParser();
  }

  /**
   * Головний метод: отримати новини
   */
  async fetchNews() {
    try {
      const feed = await this.parser.parseURL(this.config.urls.rss);

      // витягуємо повний текст для кожної новини
      const articles = await Promise.all(
        feed.items.map((item) => this.enrichWithFullText(item))
      );

      return articles;
    } catch (err) {
      console.error(`[BBC] Error fetching RSS:`, err.message);
      return [];
    }
  }

  /**
   * Допоміжний метод: завантажує повний текст статті з HTML
   */
  async enrichWithFullText(item) {
    let fullContent = null;
    let images = [];

    try {
      const { data: html } = await axios.get(item.link, { timeout: 5000 });
      const $ = cheerio.load(html);

      // основний текст у <article>
      fullContent = $("article").text().trim();

      // приклад: зібрати всі зображення з <article>
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
      sourceUrl: item.link,
      publishedAt: item.pubDate,
    });
  }
}

const bbcNewsSource = new BbcNewsSource();
export { bbcNewsSource };
