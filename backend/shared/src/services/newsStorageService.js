import { newsDataPath } from "../config/index.js";
import fsPromises from "fs/promises";

class NewsStorageService {
  constructor() {
    this.newsDataPath = newsDataPath;
  }
  async store(news) {
    await fsPromises.writeFile(this.newsDataPath, JSON.stringify(news));
  }

  async retrieve() {
    const newsJson = await fsPromises.readFile(this.newsDataPath, "utf8");

    const news = await JSON.parse(newsJson);

    return news;
  }
}

const newsStorageService = new NewsStorageService();

export { newsStorageService, NewsStorageService };
