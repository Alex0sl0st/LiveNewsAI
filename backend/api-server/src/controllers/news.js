import { newsService } from "../shared.js";
import { chatGptService } from "../shared.js";

export function chatGptAPI(req, res) {
  chatGptService
    .fetchChatGptAPI(req.body.newsText)
    .then((answer) => res.json(answer));
}

export function getAllNewsFromDb(req, res) {
  newsService.getAll().then((news) => res.json(news));
}
