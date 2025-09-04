import { newsSourcesConfig, getSourceConfig } from "../config/external.js";
import axios from "axios";
import OpenAI from "openai";

class ExternalNewsService {
  constructor() {
    this.newsApi = getSourceConfig("newsApi");

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
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
      console.log(news);
      return news;
    } catch (err) {
      console.log("Error fetching news :", err.message);
    }
  }

  async fetchChatGptAPI(newsText) {
    console.log(newsText);
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // швидший і дешевший, але можеш лишити gpt-4o для кращої якості
        messages: [
          {
            role: "system",
            content:
              "Ти розумний асистент, який стисло і зрозуміло підсумовує новини. " +
              "Форматуй відповідь у 3–5 коротких реченнях, без води, тільки головне. " +
              "Відповідь має бути нейтральною і простою для читача.",
          },
          {
            role: "user",
            content: `Ось текст новини або добірка новин:\n\n${newsText}\n\nЗроби короткий підсумок.`,
          },
        ],
        temperature: 0.4, // менше випадковості → чіткіші підсумки
        max_tokens: 300, // обмеження на довжину відповіді
      });

      return completion.choices[0].message.content.trim();
    } catch (err) {
      console.error("❌ OpenAI error:", err);
      return null;
    }
  }
}

const externalNewsService = new ExternalNewsService();

export { externalNewsService, ExternalNewsService };
