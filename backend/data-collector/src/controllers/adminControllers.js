import path from "path";
import { fileURLToPath } from "url";
import { newsService } from "../shared.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getAdminPage(req, res) {
  res.sendFile(path.join(__dirname, "../public/admin.html"));
}

export function doNewsAction(req, res) {
  const { action, ...params } = req.body;

  const newsResponse = {
    success: true,
    data: [],
    resType: "news",
    massage: "",
  };

  function resNews({
    news,
    success = newsResponse.success,
    resType = newsResponse.resType,
    massage = newsResponse.massage,
  }) {
    newsResponse.success = success;
    newsResponse.data = news;
    newsResponse.resType = resType;
    newsResponse.massage = massage;
    res.json(newsResponse);
  }

  if (action === "getAll") {
    newsService.getAll().then((news) => {
      resNews({ news, massage: "getAll" });
    });
  } else {
    resNews({
      news: [],
      success: false,
      resType: "action",
      massage: "Something went wrong",
    });
  }
}
