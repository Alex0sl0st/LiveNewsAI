import axios from "axios";
import * as cheerio from "cheerio";
import BaseNewsSource from "./BaseNewsSource.js";
import { getSourceConfig } from "../../config/external.js";
import { normalizeUrl } from "../../utils/normalizeUrl.js";
import { createDefaultImage } from "../../shared.js";

const REUTERS_BASE = "https://www.reuters.com";
const BLOCKED_PATTERNS = ["/video/", "/pictures/", "/graphics/", "/live/"];

function getImageSrc($el) {
  function getBestSrcFromSrcset(srcset) {
    return (
      srcset
        ?.split(",")
        .map((s) => s.trim().split(" ")[0])
        .pop() || null
    );
  }
  return (
    $el.attr("src") ||
    $el.attr("data-src") ||
    getBestSrcFromSrcset($el.attr("srcset")) ||
    ""
  );
}

export default class ReutersNewsSource extends BaseNewsSource {
  constructor() {
    super(getSourceConfig("reuters"));
  }

  async fetchNews() {
    try {
      const { data: html } = await axios.get(`${REUTERS_BASE}/world/`);
      const $ = cheerio.load(html);

      const articles = [];

      $("article a[href]").each((_, el) => {
        const link = $(el).attr("href");
        if (!link || BLOCKED_PATTERNS.some((p) => link.includes(p))) return;

        const url = link.startsWith("http") ? link : `${REUTERS_BASE}${link}`;

        const title =
          $(el).find("[data-testid='Heading']").text().trim() ||
          $(el).attr("aria-label") ||
          "";

        const publishedAt = $(el).find("time").attr("datetime") || null;

        if (title && url) articles.push({ title, url, publishedAt });
      });

      // завантажуємо повний контент кожної статті
      const detailed = await Promise.allSettled(
        articles.map((item) => this.enrichWithFullContent(item))
      );

      return detailed
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);
    } catch (err) {
      console.error("[Reuters] Error fetching homepage:", err.message);
      return [];
    }
  }

  async enrichWithFullContent(item) {
    try {
      const { data: html } = await axios.get(item.url, { timeout: 7000 });
      const $ = cheerio.load(html);

      const content = this.extractArticleText($);
      const images = this.extractArticleImages($);

      if (!content || content.length < 100) return null;

      return this.toStandardFormat({
        title: item.title,
        content,
        sourceUrl: item.url,
        publishedAt: item.publishedAt,
        images,
      });
    } catch (err) {
      console.error("[Reuters] Error fetching article:", err.message);
      return null;
    }
  }

  extractArticleText($) {
    $(
      "script, style, figure, svg, noscript, .ad, .related-content, .video-container"
    ).remove();
    const text =
      $("article [data-testid='paragraph']").text().trim() ||
      $("article").text().trim();
    return text;
  }

  extractArticleImages($) {
    const images = [];
    const mainImg =
      $("meta[property='og:image']").attr("content") ||
      $("article img").first().attr("src");

    if (mainImg) {
      images.push(createDefaultImage({ url: mainImg, caption: "" }));
    }

    $("article figure img").each((_, el) => {
      const url = getImageSrc($(el));
      if (!url) return;
      if (images.some((i) => i.url === url)) return;
      images.push(
        createDefaultImage({ url, caption: $(el).attr("alt") || "" })
      );
    });

    return images;
  }
}

const reutersNewsSource = new ReutersNewsSource();
export { reutersNewsSource };
