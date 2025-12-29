
import { GoogleGenAI, Type } from "@google/genai";
import { TriviaQuestion } from "../types";

// Always use process.env.API_KEY directly when initializing GoogleGenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchTriviaQuestion(category: string): Promise<TriviaQuestion> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `قم بتوليد سؤال مسابقات باللغة العربية في تصنيف: ${category}. يجب أن يكون السؤال ممتعاً وصعباً قليلاً.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctIndex: { type: Type.INTEGER },
            category: { type: Type.STRING },
          },
          // propertyOrdering is recommended for structured JSON output
          propertyOrdering: ["question", "options", "correctIndex", "category"],
        },
      },
    });

    // response.text is a property, not a method. trim() is used to ensure clean JSON string.
    const result = JSON.parse(response.text.trim());
    return result as TriviaQuestion;
  } catch (error) {
    console.error("Error fetching trivia:", error);
    return {
      question: "ما هي عاصمة مصر؟",
      options: ["القاهرة", "الإسكندرية", "الجيزة", "المنصورة"],
      correctIndex: 0,
      category: "جغرافيا"
    };
  }
}

export async function generateChatReaction(event: string, playerName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `أنت معلق في لعبة "سيف المعرفة". الحدث هو: ${event} للاعب ${playerName}. اكتب تعليقاً قصيراً وحماسياً بالعامية العربية أو الفصحى البسيطة (أقل من 10 كلمات).`,
    });
    // response.text is a property, not a method
    return response.text.trim();
  } catch {
    return "يا له من تحرك ذكي!";
  }
}
