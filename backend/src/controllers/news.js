import { newsService } from "../services/newsService.js";

function getNews(req, res) {
  try {
    const news = newsService.getAllNews();
    res.json(news);
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

export { getNews, getNewsById, createNews };
