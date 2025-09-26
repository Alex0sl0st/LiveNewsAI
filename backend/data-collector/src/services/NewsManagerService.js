import { externalNewsService } from "./externalNewsService.js";
import { newsService } from "../shared.js";

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
}

const newsManagerService = new NewsManagerService();

export { newsManagerService };
