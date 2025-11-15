import { newsService } from "../shared.js";
import { newsSourcesConfig } from "../config/external.js";
import { bbcNews } from "./sources/BbcNews/BbcNews.js";
import { dwNews } from "./sources/DwNews/DwNews.js";
import { apNews } from "./sources/ApNews/ApNews.js";

class NewsManagerService {
  constructor() {
    this.newsService = newsService;

    this.sourcesNames = {};

    Object.values(newsSourcesConfig).forEach((source) => {
      if (source.name) {
        const sourceName = source.name.toLowerCase();
        this.sourcesNames[sourceName] = sourceName;
      }
    });

    this.sources = {
      bbc: bbcNews,
      dw: dwNews,
      ap: apNews,
    };
  }

  async saveNewsToDB(news) {
    const newsPromises = news
      .filter((item) => item)
      .map((singleNews) => {
        try {
          return this.newsService.create(singleNews);
        } catch (err) {
          console.log("Error in saveNewsToDB", err);
        }
      });

    await Promise.allSettled(newsPromises);
  }

  async createNews(source, batchSaving = false) {
    let news;

    source = source || this.sourcesNames.bbc;

    switch (source.toLowerCase()) {
      case this.sourcesNames.bbc:
        news = await this.sources.bbc.fetchNews();
        break;
      case this.sourcesNames.dw:
        news = await this.sources.dw.fetchNews();
        break;
      case this.sourcesNames.ap:
        news = await this.sources.ap.fetchNews(batchSaving);
        break;
      default:
        console.log(`Error: Unknown news source: ${source}`);
        return;
    }

    if (!batchSaving) {
      await this.saveNewsToDB(news);
    }
  }
}

const newsManagerService = new NewsManagerService();

export { newsManagerService };
