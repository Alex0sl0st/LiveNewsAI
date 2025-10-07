import { externalNewsService } from "./externalNewsService.js";
import { newsService } from "../shared.js";
import { bbcNewsSource } from "./sources/BbcNewsSource.js";

class NewsManagerService {
  constructor() {
    this.externalNewsService = externalNewsService;
    this.newsService = newsService;
  }

  async createNews(news) {
    const newsPromises = news.articles.map(({ title, content }) =>
      this.newsService.create({ title, content })
    );

    await Promise.all(newsPromises);
  }

  async createNewsFromNewsAPI(topic = "latest") {
    const news = await this.externalNewsService.fetchNewsFromNewsAPI(topic);

    await this.createNews(news);
  }

  async createBbcNews() {
    const news = await bbcNewsSource.fetchNews();

    const newsPromises = news.map((singleNews) => {
      try {
        if (!singleNews) return;
        const { title, content, sourceUrl, images } = singleNews;
        return this.newsService.create({ title, content, sourceUrl, images });
      } catch (err) {
        console.log("Error in createBbcNews", err);
      }
    });

    await Promise.allSettled(newsPromises);
  }
}

const newsManagerService = new NewsManagerService();

export { newsManagerService };
