import path from "path";
import { fileURLToPath } from "url";
import { newsService } from "../shared.js";
import { newsManagerService } from "../services/NewsManagerService.js";

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
  } else if (action === "createNewsAPI") {
    newsManagerService
      .createNewsFromNewsAPI()
      .then((r) => resNews({ massage: "Create NewsAPI", resType: "action" }));
  } else if (action === "deleteDuplicates") {
    newsService
      .deleteDuplicates()
      .then((r) =>
        resNews({ massage: "Delete Duplicates", resType: "action" })
      );
  } else {
    resNews({
      news: [],
      success: false,
      resType: "action",
      massage: "Something went wrong",
    });
  }
}
