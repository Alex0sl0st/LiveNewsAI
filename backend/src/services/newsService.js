import { buildNews } from "../Utils/newsFactory.js";
import fsPromises from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class NewsService {
  constructor() {
    this.news = ["News1", "News2", "News3", "News4"];
  }

  async tempSaveNews(news) {
    await fsPromises.writeFile(
      join(__dirname, "news.json"),
      JSON.stringify(news)
    );
  }

  async tempGetSavedNews() {
    const newsJson = await fsPromises.readFile(
      join(__dirname, "news.json"),
      "utf8"
    );

    const news = await JSON.parse(newsJson);

    return news;
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
