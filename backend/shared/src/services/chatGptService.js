import "dotenv/config";

import OpenAI from "openai";

class ChatGptService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async summarizeNews(newsText) {
    try {
      console.log(newsText);
      const response = await this.openai.responses.create({
        model: "gpt-5-nano",
        input: [
          {
            role: "system",
            content:
              "You are an expert summarization system. " +
              "Your goal is to produce the most information-dense and concise summary possible. " +
              "Keep all key facts, names, numbers, and relationships. " +
              "Be as short as possible, but as long as needed to preserve all crucial details. " +
              "Use neutral, factual language without introductions or commentary.",
          },
          {
            role: "user",
            content: `Summarize the following text:\n\n${newsText}`,
          },
        ],
      });

      console.log(response);

      console.log(111111, response.output_text);

      return response.output_text.trim();
    } catch (error) {
      console.error("❌ OpenAI summarize error:", error);
      return null;
    }
  }

  async fetchChatGptAPI(newsText) {
    // console.log(newsText, 123);
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

const chatGptService = new ChatGptService();

export { chatGptService, ChatGptService };
