import { newsSourcesConfig, getSourceConfig } from "../config/external.js";
import axios from "axios";

class ExternalNewsService {
  constructor() {
    this.newsApi = getSourceConfig("newsApi");
  }

  async fetchNewsFromNewsAPI(topic = "latest") {
    try {
      const {
        baseUrl,
        apiKey,
        endpoints: { everything },
      } = this.newsApi;

      const params = {
        q: topic,
        language: "en",
        pageSize: 10,
        apiKey: apiKey,
      };

      const { data: news } = await axios.get(`${baseUrl}${everything}`, {
        params,
        timeout: 5000,
      });
      // console.log(news, 123);
      return news;
    } catch (err) {
      console.log("Error fetching news :", err.message);
    }
  }
}

const externalNewsService = new ExternalNewsService();

export { externalNewsService, ExternalNewsService };
