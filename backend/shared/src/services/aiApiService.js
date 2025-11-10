import "dotenv/config";

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

class AiApiService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    this.gemini = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    this.summarizeRulesText =
      "You are an expert summarization system. " +
      "Your goal is to produce the most information-dense and concise summary possible. " +
      "Keep all key facts, names, numbers, and relationships. " +
      "Be as short as possible, but as long as needed to preserve all crucial details. " +
      "Use neutral, factual language without introductions or commentary.";

    this.getSummarizeRulesPrompt = (role) => {
      const content = this.summarizeRulesText;

      return { role, content };
    };

    this.getSummarizeMassagePrompt = (role, data) => {
      const content = `Summarize the following text:\n\n${data}`;

      return { role, content };
    };

    this.summarizeTestRulesText = `
You are an expert system for summarizing and classifying news articles.

Your objectives:
1. Summarize the article in the most concise and information-dense way possible.
   - Include all essential facts, names, numbers, dates, and relationships.
   - Use neutral and factual language only.
   - Avoid introductions, opinions, or extra commentary.

2. Classify the article by topic.
   - Identify exactly one main category.
   - Optionally list up to three secondary relevant categories.
   - Use only these predefined categories:
     [World, Politics, Economy & Business, Science & Technology, Society, Law & Justice, Health, Environment, Sports, Culture & Entertainment, Lifestyle, Technology Business, War & Security, Opinion & Analysis]

Return the result strictly in valid JSON (no extra text):
{
  "summary": "...",
  "main_category": "Politics",
  "relevant_categories": ["Science & Technology", "War & Security"]
}
`;
  }

  async summarizeNewsChatGpt(newsText) {
    // console.log(this.summarizeRulesText);
    try {
      // console.log(newsText);
      const response = await this.openai.responses.create({
        model: "gpt-5-nano",
        input: [
          this.getSummarizeRulesPrompt("system"),
          this.getSummarizeMassagePrompt("user", newsText),
        ],
      });

      // console.log(response);

      // console.log(111111, response.output_text);

      return response.output_text.trim();
    } catch (error) {
      console.error("❌ OpenAI summarize error:", error);
      return null;
    }
  }

  async summarizeNewsClaude(newsText) {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content:
              "You are an expert summarization system. " +
              "Your goal is to produce the most information-dense and concise summary possible. " +
              "Keep all key facts, names, numbers, and relationships. " +
              "Be as short as possible, but as long as needed to preserve all crucial details. " +
              "Use neutral, factual language without introductions or commentary.\n\n" +
              `Summarize the following text:\n\n${newsText}`,
          },
        ],
      });

      return response.content[0]?.text?.trim() || "";
    } catch (error) {
      console.error("❌ Claude summarize error:", error);
      return null;
    }
  }

  async summarizeNewsGemini(newsText) {
    console.log(
      this.summarizeRulesText + "\n\n" + `Summarize the following text:`
    );
    try {
      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents:
          this.summarizeTestRulesText +
          "\n\nARTICLE:\n" +
          newsText +
          "\n\nReturn only the JSON result as specified above.",
      });

      return response.text.trim();
    } catch (error) {
      console.error("❌ Gemini summarize error:", error);
      return null;
    }

    // const response = await this.gemini.models.generateContent({
    //   model: "gemini-2.5-flash-lite",
    //   contents:
    //     this.summarizeRulesText +
    //     "\n\n" +
    //     `Summarize the following text:\n\n${newsText}`,
    // });
  }
}

const aiApiService = new AiApiService();

export { aiApiService, AiApiService };

// async fetchChatGptAPI(newsText) {
//   // console.log(newsText, 123);

//   console.log();
//   try {
//     const completion = await this.openai.chat.completions.create({
//       model: "gpt-4o-mini", // швидший і дешевший, але можеш лишити gpt-4o для кращої якості
//       messages: [
//         {
//           role: "system",
//           content:
//             "Ти розумний асистент, який стисло і зрозуміло підсумовує новини. " +
//             "Форматуй відповідь у 3–5 коротких реченнях, без води, тільки головне. " +
//             "Відповідь має бути нейтральною і простою для читача.",
//         },
//         {
//           role: "user",
//           content: `Ось текст новини або добірка новин:\n\n${newsText}\n\nЗроби короткий підсумок.`,
//         },
//       ],
//       temperature: 0.4, // менше випадковості → чіткіші підсумки
//       max_tokens: 300, // обмеження на довжину відповіді
//     });

//     return completion.choices[0].message.content.trim();
//   } catch (err) {
//     console.error("❌ OpenAI error:", err);
//     return null;
//   }
// }
