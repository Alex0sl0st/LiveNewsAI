import { newsService } from "../shared.js";
import { aiApiService } from "../shared.js";

export function chatGptAPI(req, res) {
  aiApiService
    .fetchChatGptAPI(req.body.newsText)
    .then((answer) => res.json(answer));
}

export function getAllNewsFromDb(req, res) {
  newsService.getAll().then((news) => res.json(news));
}
