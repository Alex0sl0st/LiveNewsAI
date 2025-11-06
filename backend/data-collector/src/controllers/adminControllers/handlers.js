import { newsService } from "../../shared.js";
import { newsManagerService } from "../../services/NewsManagerService.js";
import { newsSourcesConfig } from "../../config/external.js";
import { chatGptService } from "../../../../shared/src/services/chatGptService.js";

function sendResponse(
  res,
  {
    data = [],
    success = true,
    resType = "data",
    massage = "",
    toDisplayOnPanel = false,
  }
) {
  res.json({
    success,
    data,
    resType,
    massage,
    toDisplayOnPanel,
  });
}

export function getAll(res) {
  newsService.getAll().then((news) => {
    sendResponse(res, { data: news, massage: "getAll" });
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

export function sourceAP(res) {
  newsManagerService.createNews(newsSourcesConfig.ap.name).then(() => {
    sendResponse(res, { massage: "sourceAP", resType: "result" });
  });
}

export function summarizeNano(res) {
  newsService.getAll().then(async (news) => {
    console.log("Start generating");
    // const summarizes = await chatGptService.summarizeNews(news[6].content);

    const summarizes = "123567";
    // console.log(JSON.stringify(summarizes, null, 2));
    sendResponse(res, {
      massage: "summarizeNano",
      resType: "data",
      toDisplayOnPanel: true,
      data: summarizes,
    });
  });
}
