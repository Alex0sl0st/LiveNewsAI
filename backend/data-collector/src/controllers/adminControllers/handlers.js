import { newsService } from "../../shared.js";
import { newsManagerService } from "../../services/NewsManagerService.js";
import { newsSourcesConfig } from "../../config/external.js";

function sendResponse(
  res,
  { news = [], success = true, resType = "data", massage = "" }
) {
  res.json({
    success,
    data: news,
    resType,
    massage,
  });
}

export function getAll(res) {
  newsService.getAll().then((news) => {
    sendResponse(res, { news, massage: "getAll" });
  });
}

export function deleteDuplicates(res) {
  newsService.deleteDuplicates().then(() => {
    sendResponse(res, { massage: "Delete Duplicates", resType: "result" });
  });
}

export function deleteAllResetIds(res) {
  newsService.deleteAllResetIds().then(() => {
    sendResponse(res, { massage: "deleteAllResetIds", resType: "result" });
  });
}

export function unknown(res) {
  sendResponse(res, {
    news: [],
    success: false,
    resType: "result",
    massage: "Something went wrong",
  });
}

export function createNewsAPI(res) {
  newsManagerService.createNewsFromNewsAPI().then(() => {
    sendResponse(res, { massage: "Create NewsAPI", resType: "result" });
  });
}

export function sourceBBC(res) {
  newsManagerService.createNews(newsSourcesConfig.bbc.name).then(() => {
    sendResponse(res, { massage: "sourceBBC", resType: "result" });
  });
}

export function sourceDW(res) {
  newsManagerService.createNews(newsSourcesConfig.dw.name).then(() => {
    sendResponse(res, { massage: "sourceDW", resType: "result" });
  });
}
