import "dotenv/config";
import express from "express";

import { externalNewsService } from "./services/externalNewsService.js";
import { newsStorageService } from "./shared.js";

const app = express();
const PORT = process.env.PORT;

function startCollecting(req, res) {
  externalNewsService.fetchNewsFromNewsAPI().then((news) => {
    newsStorageService.store(news);
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
