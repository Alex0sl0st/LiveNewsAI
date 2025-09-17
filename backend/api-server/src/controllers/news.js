import { newsService } from "../services/newsService.js";
import { newsService as newsService2 } from "../shared.js";
import { newsStorageService } from "../shared.js";
import { chatGptService } from "../shared.js";

async function getNews(req, res) {
  try {
    // const news = newsService.getAllNews();
    const news = newsStorageService.retrieve().then((news) => res.json(news));
    // res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}

function getNewsById(req, res) {
  try {
    const { id } = req.params;
    const news = newsService.getNewsById(id);

    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}

function chatGptAPI(req, res) {
  chatGptService
    .fetchChatGptAPI(req.body.newsText)
    .then((answer) => res.json(answer));
}

function createNews(req, res) {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    const newNews = newsService.createNews({ title, url });
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ error: "Failed to create news" });
  }
}

export function getAllNewsFromDb(req, res) {
  newsService2.getAll().then((news) => res.json(news));
}

export { getNews, getNewsById, createNews, chatGptAPI };
