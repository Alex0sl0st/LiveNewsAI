import RSSParser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import BaseNewsSource from "./BaseNewsSource.js";
import { getSourceConfig } from "../../config/external.js";
import { normalizeUrl } from "../../utils/normalizeUrl.js";
import { createDefaultImage } from "../../shared.js";

const BBC_IMAGE_DOMAINS = ["ichef.bbci.co.uk"];
const BLOCKED_PATTERNS = [
  "/news/videos/",
  "/news/av/",
  "/in-pictures-",
  "/news/live/",
  "/resources/",
  "/iplayer/",
  "/sounds/",
];

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

function isValidImageSrc(src) {
  return BBC_IMAGE_DOMAINS.some((domain) => src.includes(domain));
}

function isBlockedImage(alt, url) {
  const lowerAlt = alt?.toLowerCase() || "";
  return (
    lowerAlt.includes("presentational") ||
    url.includes("placeholder") ||
    url.includes("bbc-blocks")
  );
}

function cleanArticleContent($) {
  $(
    "article noscript, \
    article .media-player, \
    article figure, \
    article [data-component='ad-slot'], \
    article [data-component='tags'], \
    article .ssrcss-1kczw0k-PromoGroup"
  ).remove();
  return $("article").text().trim();
}

class BbcNews extends BaseNewsSource {
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
      let images = [];
      const cleanLink = normalizeUrl(item.link);

      const { data: html } = await this.baseHttpClient.get(cleanLink);
      const $ = cheerio.load(html);

      // console.log($("article").html());

      images = this.extractArticleMedia($);
      const content = cleanArticleContent($);

      if (!content || content.length < this.minContentLength) {
        return null; // skip non-text
      }

      return this.toStandardFormat({
        title: item.title,
        content: content,
        sourceUrl: cleanLink,
        publishedAt: item.pubDate,
        images: images,
      });
    } catch (err) {
      console.error(`[BBC] Error fetching full article:`, err.message);
      return null;
    }

    // summary: item.contentSnippet,
    //   images,
  }

  isTextArticle(url) {
    if (!url) return false;
    return !BLOCKED_PATTERNS.some((pattern) => url.includes(pattern));
  }

  extractArticleMedia($) {
    const mediaImages = [];

    $("article figure").each((_, fig) => {
      const img = $(fig)
        .find("img")
        .filter((_, el) => {
          const src = getImageSrc($(el));
          return isValidImageSrc(src);
        })
        .first();

      if (!img.length) return;

      const url = getImageSrc(img);

      if (!url) return;

      const alt = img.attr("alt") || "";

      if (isBlockedImage(alt, url)) {
        return;
      }

      const caption =
        $(fig).find("figcaption").text().trim() || alt.trim() || "";

      mediaImages.push(createDefaultImage({ url, caption }));
    });

    return mediaImages.slice(0, this.articleImageLimit + 1);
  }
}

const bbcNews = new BbcNews();
export { bbcNews };
