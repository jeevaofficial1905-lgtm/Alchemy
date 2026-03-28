import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getElementInsight(elementName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a short, fascinating, and advanced scientific insight about the element ${elementName}. Focus on its unique quantum properties, industrial applications, or role in the universe. Keep it under 100 words.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch AI insights at this time. Please ensure your GEMINI_API_KEY is configured correctly in the Secrets panel.";
  }
}
