import RSSParser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import BaseNewsSource from "./BaseNewsSource.js";
import { getSourceConfig } from "../../config/external.js";
import { normalizeUrl } from "../../utils/normalizeUrl.js";
import { createDefaultImage } from "../../shared.js";

const DW_IMAGE_DOMAINS = ["static.dw.com", "images.dw.com"];

function isValidImageSrc(src) {
  return DW_IMAGE_DOMAINS.some((domain) => src.includes(domain));
}

function cleanArticleContent($) {
  $(
    "figure, video, audio, footer, .advertising, .socialMedia, .inArticleTeaser, .ads, .mediaContainer, .mediaPlayer, .col1"
  ).remove();

  $("a").each((_, a) => $(a).replaceWith($(a).text()));

  const paragraphs = [];
  $("article h2, article h3, article p").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 1) paragraphs.push(text);
  });

  return paragraphs.join("\n\n").trim();
}

function extractPublishDate($) {
  const blocks = $('script[type="application/ld+json"]');
  for (const el of blocks.toArray()) {
    try {
      const data = JSON.parse($(el).html());
      if (data.datePublished) return new Date(data.datePublished);
    } catch (_) {}
  }
}

class DwNews extends BaseNewsSource {
  constructor() {
    super(getSourceConfig("dw"));
    this.parser = new RSSParser();
  }

  async fetchNews() {
    try {
      const feed = await this.parser.parseURL(this.config.urls.rss);
      const articles = await Promise.allSettled(
        feed.items.map((item) => this.fetchFullArticle(item))
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

      const images = this.extractArticleImages($);
      const publishedAt = extractPublishDate($) || item.date || null;

      const content = cleanArticleContent($);

      if (!content || content.length < this.minContentLength) return null;

      return this.toStandardFormat({
        title: item.title,
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

  extractArticleImages($) {
    const images = [];

    $("picture").each((_, el) => {
      const $pic = $(el);
      let bestUrl = "";
      let maxWidth = 0;

      $pic.find("source[type='image/jpeg']").each((_, source) => {
        const srcset = $(source).attr("srcset");
        if (!srcset) return;

        srcset.split(",").forEach((s) => {
          const [url, size] = s.trim().split(" ");
          const width = parseInt(size) || 0;
          if (width > maxWidth && isValidImageSrc(url)) {
            maxWidth = width;
            bestUrl = url;
          }
        });
      });

      if (bestUrl) {
        const $img = $pic.find("img").first();
        const caption = $img.attr("alt") || $img.attr("title") || "";
        if (!images.some((i) => i.url === bestUrl)) {
          images.push(createDefaultImage({ url: bestUrl, caption }));
        }
      }
    });

    return images.slice(0, this.articleImageLimit + 1);
  }
}

const dwNews = new DwNews();
export { dwNews };
