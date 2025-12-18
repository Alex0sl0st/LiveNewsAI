import { newsService, aiApiService } from "../../shared.js";
import { newsManagerService } from "../../services/NewsManagerService.js";
import { newsSourcesConfig } from "../../config/external.js";

function sendResponse(
  res,
  {
    data = [],
    success = true,
    resType = "data",
    message = "",
    toDisplayOnPanel = false,
  }
) {
  res.json({
    success,
    data,
    resType,
    message,
    toDisplayOnPanel,
  });
}

export function getAll(res) {
  newsService.getAll().then((news) => {
    sendResponse(res, { data: news, message: "getAll" });
  });
}

export function deleteDuplicates(res) {
  newsService.deleteDuplicates().then(() => {
    sendResponse(res, { message: "Delete Duplicates", resType: "result" });
  });
}

export function deleteAllResetIds(res) {
  newsService.deleteAllResetIds().then(() => {
    sendResponse(res, { message: "deleteAllResetIds", resType: "result" });
  });
}

export function deleteNews(res, ids) {
  newsService.delete(ids).then(() => {
    sendResponse(res, { message: "deleteNews", resType: "result" });
  });
}

export function unknown(res) {
  sendResponse(res, {
    news: [],
    success: false,
    resType: "result",
    message: "Something went wrong",
  });
}

export function sourceBBC(res) {
  newsManagerService.createNews(newsSourcesConfig.bbc.name).then(() => {
    sendResponse(res, { message: "sourceBBC", resType: "result" });
  });
}

export function sourceDW(res) {
  newsManagerService.createNews(newsSourcesConfig.dw.name).then(() => {
    sendResponse(res, { message: "sourceDW", resType: "result" });
  });
}

export function sourceAP(res) {
  newsManagerService.createNews(newsSourcesConfig.ap.name, true).then(() => {
    sendResponse(res, { message: "sourceAP", resType: "result" });
  });
}

export function summarize(res, saveToDb = false) {
  newsService.getAll().then(async (news) => {
    console.log("Start generating");

    const selectedNews = news.slice(0, 20);

    const summariesArray = await Promise.all(
      selectedNews.map(async (item, i) => {
        console.log(`🧠 Summarizing news #${i + 1}`);
        const raw = await aiApiService.summarizeNewsGemini(item.content);
        const summary = JSON.parse(
          raw
            .replace(/```json\s*/gi, "")
            .replace(/```/g, "")
            .trim()
        );

        if (saveToDb) {
          await newsService.updateNewsCategory(
            item.id,
            summary.main_category,
            summary.relevant_categories
          );

          await newsService.updateNewsSummary(item.id, summary.summary);
        }

        return summary;
      })
    );

    sendResponse(res, {
      message: "summarize",
      resType: "data",
      toDisplayOnPanel: true,
      data: summariesArray,
    });
  });
}

export function getFiltered(res, filters) {
  newsService.getFilteredNews(filters).then((news) => {
    sendResponse(res, { data: news, message: "getFiltered" });
  });
}
