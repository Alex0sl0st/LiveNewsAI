import { externalNewsService } from "../services/externalNewsService.js";
import { newsService } from "../shared.js";

export function startCollecting(req, res) {
  externalNewsService.fetchNewsFromNewsAPI().then(async (news) => {
    const newsPromises = news.articles.map(({ title, content }) =>
      newsService.create({ title, content })
    );
    const results = await Promise.all(newsPromises);
    res.status(200).send("<h1>Started Successful</h1>");
  });
}

export function endCollecting(req, res) {
  res.status(200).send("<h1>Ended Successful</h1>");
}
