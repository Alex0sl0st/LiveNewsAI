import { buildNews } from "../Utils/newsFactory.js";

class NewsService {
  constructor() {
    this.news = ["News1", "News2", "News3", "News4"];
  }

  createNews({ title, url }) {
    const newNews = buildNews({ text: title, url });
    this.news.push(newNews);
    return newNews;
  }

  getAllNews() {
    return this.news;
  }

  getNewsById(id) {
    return this.news.find((n) => n.id === Number(id));
  }
}

const newsService = new NewsService();

export { newsService, NewsService };
