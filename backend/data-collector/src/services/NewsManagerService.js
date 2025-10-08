import { externalNewsService } from "./externalNewsService.js";
import { newsService } from "../shared.js";
import { newsSourcesConfig } from "../config/external.js";
import { bbcNewsSource } from "./sources/BbcNewsSource.js";
import { reutersNewsSource } from "./sources/ReutersNewsSource.js";

class NewsManagerService {
  constructor() {
    this.externalNewsService = externalNewsService;
    this.newsService = newsService;

    this.sourcesNames = {};

    Object.values(newsSourcesConfig).forEach((source) => {
      if (source.name) {
        const sourceName = source.name.toLowerCase();
        this.sourcesNames[sourceName] = sourceName;
      }
    });

    this.sources = {
      bbc: bbcNewsSource,
      reuters: reutersNewsSource,
    };
  }

  async saveNewsToDB(news) {
    const newsPromises = news
      .filter((item) => item)
      .map((singleNews) => {
        try {
          console.log(singleNews);
          return this.newsService.create(singleNews);
        } catch (err) {
          console.log("Error in saveNewsToDB", err);
        }
      });

    await Promise.allSettled(newsPromises);
  }

  async createNewsFromNewsAPI(topic = "latest") {
    const news = await this.externalNewsService.fetchNewsFromNewsAPI(topic);

    await this.saveNewsToDB(news);
  }

  async createNews(source) {
    let news;

    source = source || this.sourcesNames.bbc;

    switch (source.toLowerCase()) {
      case this.sourcesNames.bbc:
        news = await this.sources.bbc.fetchNews();
        break;
      case this.sourcesNames.reuters:
        news = await this.sources.reuters.fetchNews();
        break;
      default:
        console.log(`Error: Unknown news source: ${source}`);
        return;
    }

    await this.saveNewsToDB(news);
  }
}

const newsManagerService = new NewsManagerService();

export { newsManagerService };
