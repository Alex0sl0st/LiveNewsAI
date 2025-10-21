// ===== AP News Source Class =====
// Аналогічний до DwNews для сумісності з проектом

import BaseNewsSource from "../BaseNewsSource.js";
import { getSourceConfig } from "../../../config/external.js";

import * as cheerio from "cheerio";
import { parseStringPromise } from "xml2js";

const AP_IMAGE_DOMAINS = [
  "apnews.com",
  "storage.googleapis.com",
  "cloudfront.net",
];

function isValidImageSrc(src) {
  return AP_IMAGE_DOMAINS.some((domain) => src.includes(domain));
}

function cleanArticleContent($) {
  const $body = $("main .Page-storyBody");

  $body
    .find(
      ".Page-below, .Page-authorInfo, .FreeStar, .Advertisement, .HTMLModuleEnhancement, .Enhancement, figure, video, audio, footer, aside, script, noscript, .Ad, .ad, .advert, .advertisement, .ArticleHeader"
    )
    .remove();

  $body.find("a").each((_, a) => $(a).replaceWith($(a).text()));

  const paragraphs = [];
  $body.find("h2, h3, p").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 1) paragraphs.push(text);
  });

  return paragraphs.join("\n\n").trim();
}

function extractPublishDate($) {
  // Метод 1: JSON-LD з id="link-ld-json"
  const jsonLdScript = $("#link-ld-json").html();
  if (jsonLdScript) {
    try {
      const data = JSON.parse(jsonLdScript);
      if (Array.isArray(data) && data[0] && data[0].datePublished) {
        return new Date(data[0].datePublished);
      } else if (data.datePublished) {
        return new Date(data.datePublished);
      }
    } catch (_) {}
  }

  // Метод 2: Meta теги (fallback)
  const metaDate = $('meta[property="article:published_time"]').attr("content");
  if (metaDate) {
    return new Date(metaDate);
  }

  return null;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ApNews extends BaseNewsSource {
  constructor() {
    super(getSourceConfig("ap"));

    this.articlesPerMonth = 10;
    this.delayBetweenArticles = 500;
  }

  // Головний метод для отримання новин
  async fetchNews() {
    try {
      console.log("[AP] Starting news fetch...");

      // Отримуємо sitemap index
      const { data: indexXml } = await this.baseHttpClient.get(
        this.config.urls.sitemapIndex
      );
      const indexData = await parseStringPromise(indexXml);

      // Фільтруємо тільки 2024 рік
      const sitemaps2024 = indexData.sitemapindex.sitemap
        .map((s) => s.loc[0])
        .filter((url) => url.includes("2024"));

      console.log(`[AP] Found ${sitemaps2024.length} months for 2024`);

      // Обробляємо кожен місяць
      const allArticles = [];
      for (let i = 0; i < sitemaps2024.length; i++) {
        const sitemapUrl = sitemaps2024[i];
        const monthName = sitemapUrl.split("/").pop().replace(".xml", "");

        console.log(
          `[AP] Processing ${monthName} (${i + 1}/${sitemaps2024.length})`
        );
        // Завантажуємо sitemap місяця
        const { data: monthXml } = await this.baseHttpClient.get(sitemapUrl);
        const monthData = await parseStringPromise(monthXml);

        // Фільтруємо тільки статті
        const articleUrls = monthData.urlset.url
          .map((u) => u.loc[0])
          .filter((url) => url.includes("/article/"));

        // Беремо перші N статей
        const urlsToParse = articleUrls.slice(0, this.articlesPerMonth);

        // Парсимо статті паралельно
        const articles = await Promise.allSettled(
          urlsToParse.map((url) => this.fetchFullArticle(url))
        );

        // Фільтруємо успішні результати
        const successfulArticles = articles
          .filter((r) => r.status === "fulfilled" && r.value)
          .map((r) => r.value);

        allArticles.push(...successfulArticles);

        console.log(
          `[AP] ${monthName}: ${successfulArticles.length}/${urlsToParse.length} articles`
        );

        // Затримка між місяцями
        if (i < sitemaps2024.length - 1) {
          await delay(this.delayBetweenArticles * 2);
        }
      }

      console.log(`[AP] Total articles fetched: ${allArticles.length}`);
      return allArticles;
    } catch (err) {
      console.error(`[AP] Error fetching news:`, err.message);
      return [];
    }
  }

  // Парсинг повної статті
  async fetchFullArticle(url) {
    try {
      const { data: html } = await this.baseHttpClient.get(url);
      const $ = cheerio.load(html);

      const title =
        $("h1").first().text().trim() ||
        $("h2").first().text().trim() ||
        "No title";

      // Витягуємо зображення ПЕРЕД очищенням контенту
      const images = this.extractArticleImages($);

      // Витягуємо дату публікації
      const publishedAt = extractPublishDate($);

      // Витягуємо контент
      const content = cleanArticleContent($);

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

  // Витягування зображень (УНІВЕРСАЛЬНО: карусель + figure)
  extractArticleImages($) {
    const images = [];
    const $pageLead = $(".Page-lead");

    if ($pageLead.length === 0) return images;

    // Перевіряємо чи є карусель
    const $carousel = $pageLead.find(".Carousel");
    const hasCarousel = $carousel.length > 0;

    if (hasCarousel) {
      // СТРАТЕГІЯ 1: Карусель
      $pageLead.find(".CarouselSlide").each((i, slide) => {
        const $slide = $(slide);
        const $img = $slide.find("img").first();

        if (this.isLogoImage($img)) return;

        let imageUrl = null;

        // Для першого зображення використовуємо "srcset", для інших - "data-flickity-lazyload-srcset"
        const srcset =
          i === 0
            ? $img.attr("srcset")
            : $img.attr("data-flickity-lazyload-srcset");

        if (srcset) {
          const best = this.getBestImageFromSrcset(srcset);
          if (best && best.url) {
            imageUrl = best.url;
          }
        }

        // Fallback до data-flickity-lazyload
        if (!imageUrl) {
          imageUrl = $img.attr("data-flickity-lazyload");
        }

        // Fallback до src
        if (!imageUrl) {
          imageUrl = $img.attr("src");
        }

        // Пропускаємо data: URLs
        if (!imageUrl || imageUrl.startsWith("data:")) return;

        // Пропускаємо якщо не валідне зображення AP
        if (!isValidImageSrc(imageUrl)) return;

        // Пропускаємо дублікати
        if (images.some((img) => img.url === imageUrl)) return;

        // Витягуємо caption з каруселі
        let caption = "";
        const $carouselCaption = $slide
          .find(".CarouselSlide-infoDescription")
          .first();
        if ($carouselCaption.length) {
          caption = $carouselCaption.text().trim();
        }

        // Fallback до alt або title
        if (!caption) {
          const alt = $img.attr("alt") || "";
          const title = $img.attr("title") || "";
          caption = alt || title;
        }

        images.push({
          url: imageUrl,
          caption: caption,
        });
      });
    } else {
      // СТРАТЕГІЯ 2: Figure
      $pageLead.find("figure").each((i, fig) => {
        const $figure = $(fig);
        const $img = $figure.find("img").first();

        if (this.isLogoImage($img)) return;

        let imageUrl = null;

        // Витягуємо з srcset
        const srcset = $img.attr("srcset");
        if (srcset) {
          const best = this.getBestImageFromSrcset(srcset);
          if (best && best.url) {
            imageUrl = best.url;
          }
        }

        // Fallback до src
        if (!imageUrl) {
          imageUrl = $img.attr("src");
        }

        // Пропускаємо data: URLs
        if (!imageUrl || imageUrl.startsWith("data:")) return;

        // Пропускаємо якщо не валідне зображення AP
        if (!isValidImageSrc(imageUrl)) return;

        // Пропускаємо дублікати
        if (images.some((img) => img.url === imageUrl)) return;

        // Витягуємо caption з figure
        let caption = "";
        const $caption = $figure.find("figcaption");
        if ($caption.length) {
          caption = $caption.text().trim();
        }

        // Fallback до alt або title
        if (!caption) {
          const alt = $img.attr("alt") || "";
          const title = $img.attr("title") || "";
          caption = alt || title;
        }

        images.push({
          url: imageUrl,
          caption: caption,
        });
      });
    }

    return images.slice(0, this.articleImageLimit);
  }

  // Парсимо srcset і вибираємо найбільше зображення
  getBestImageFromSrcset(srcset) {
    if (!srcset) return null;

    const sources = srcset.split(",").map((s) => s.trim());
    let bestUrl = "";
    let maxWidth = 0;

    sources.forEach((source) => {
      const parts = source.split(" ");
      const url = parts[0];
      // Парсимо ширину (може бути "1x", "2x" або число)
      const widthStr = parts[1];
      let width = 0;

      if (widthStr.endsWith("x")) {
        // "1x" або "2x" - множимо на 599 (базова ширина)
        const multiplier = parseFloat(widthStr);
        width = multiplier * 599;
      } else {
        width = parseInt(widthStr) || 0;
      }

      if (width > maxWidth) {
        maxWidth = width;
        bestUrl = url;
      }
    });

    return { url: bestUrl, width: maxWidth };
  }

  // Перевірка чи є зображення логотипом
  isLogoImage($img) {
    const src = $img.attr("src") || "";
    const alt = $img.attr("alt") || "";
    const classAttr = $img.attr("class") || "";

    return (
      src.toLowerCase().includes("logo") ||
      alt.toLowerCase().includes("logo") ||
      classAttr.toLowerCase().includes("logo")
    );
  }

  // Конвертація в стандартний формат (аналогічний до DW)
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

// Експортуємо одиночний екземпляр (як у DW)
const apNews = new ApNews();
export { apNews };
