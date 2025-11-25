import "dotenv/config";

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

import { firstPrompt, improvedP, idP, improvedIdP } from "./prompts.js";

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

    this.summarizeTestRulesText = `You are an automated system for summarizing and classifying news articles.

Follow these rules strictly.

### Task 1: Summarization
- Write one concise paragraph that captures all key facts, names, dates, numbers, and relationships.
- Use neutral, factual, journalistic language only.
- Avoid adjectives, emotions, or personal commentary.
- Do not start with phrases like “This article reports that…” — begin directly with the facts.

### Task 2: Classification
- Identify exactly one main category (slug).
- Optionally list up to three secondary relevant categories (also slugs).
- Add relevant categories **only if** they are strongly related and could *reasonably* serve as an alternative main category.  
  Do not include weakly or tangentially related topics.
- Choose only from the following predefined list:

[
  {"slug": "world", "desc": "International news, diplomacy, global events, and conflicts."},
  {"slug": "politics", "desc": "Governments, elections, policies, and political decisions."},
  {"slug": "economy", "desc": "Markets, finance, trade, companies, and economic policy."},
  {"slug": "science", "desc": "Research, discoveries, academia, and scientific studies."},
  {"slug": "technology", "desc": "Tech industry, AI, startups, and digital innovation."},
  {"slug": "society", "desc": "Social issues, demographics, culture, and human interest."},
  {"slug": "law-crime", "desc": "Criminal cases, courts, investigations, and legal systems."},
  {"slug": "health", "desc": "Medicine, healthcare, epidemics, and medical research."},
  {"slug": "environment", "desc": "Climate, ecology, disasters, and sustainability."},
  {"slug": "sports", "desc": "Sports, athletes, competitions, and match results."},
  {"slug": "culture-lifestyle", "desc": "Arts, entertainment, travel, food, and lifestyle."},
  {"slug": "war-security", "desc": "Military, defense, cyberwarfare, and national security."},
  {"slug": "opinion", "desc": "Commentaries, editorials, and expert analysis."}
]
Use only the slugs listed above. 
If a topic does not fit any category, choose the closest match from the list.
Do not invent or output new category names under any circumstances.

When multiple categories seem possible, choose only one — the most specific and dominant one. 
Add relevant categories only if they are equally central to the article’s main subject, not just tangentially related. 
If uncertain, do not include any secondary categories.

### Output format
Return ONLY a valid JSON object with no markdown formatting, code fences, or explanations.
The output must start with { and end with }.

Example:
{
  "summary": "President Biden signed a new AI regulation law aiming to establish federal standards for data transparency and model safety, with enforcement beginning in 2026.",
  "main_category": "politics",
  "relevant_categories": ["technology", "science"]
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
    // console.log(
    //   this.summarizeRulesText + "\n\n" + `Summarize the following text:`
    // );

    // this.summarizeTestRulesText
    // firstPrompt
    try {
      const prompt = improvedIdP;
      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt + "\n\nARTICLE:\n" + newsText,
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
