import "dotenv/config";
import express from "express";

import { externalNewsService } from "./services/externalNewsService.js";
import { newsService } from "./shared.js";

const app = express();
const PORT = process.env.PORT;

function startCollecting(req, res) {
  externalNewsService.fetchNewsFromNewsAPI().then(async (news) => {
    const newsPromises = news.articles.map(({ title, content }) =>
      newsService.create({ title, content })
    );
    const results = await Promise.all(newsPromises);
    res.status(200).send("<h1>Started Successful</h1>");
  });
}

function endCollecting(req, res) {
  res.status(200).send("<h1>Ended Successful</h1>");
}

function notFound(req, res) {
  res.status(404).send("<h1>Not Found</h1>");
}

app.get("/start", startCollecting);
app.get("/end", endCollecting);

app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
