import "dotenv/config";

import OpenAI from "openai";

class ChatGptService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
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

const chatGptService = new ChatGptService();

export { chatGptService, ChatGptService };
