
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateDocumentSummary = async (content: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize the following document text professionally. Focus on core concepts and high-level takeaways:\n\n${content}`,
  });
  return response.text;
};

export const generateStudyFlashcards = async (content: string, count: number = 8) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the text below, generate ${count} educational flashcards. Return JSON format with "front" and "back" fields for each card:\n\n${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING },
          },
          required: ["front", "back"],
        },
      },
    },
  });
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("AI Flashcard Generation Error:", e);
    return [];
  }
};

export const generateStudyQuiz = async (content: string, count: number = 5) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a ${count}-question multiple choice quiz from the following text. Return JSON with "question", "options" (array of 4), "correctAnswer" (0-3), and "explanation":\n\n${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correctAnswer", "explanation"],
        },
      },
    },
  });
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("AI Quiz Generation Error:", e);
    return [];
  }
};

export const chatDocumentAssistant = async (query: string, context: string, history: any[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      { role: 'user', parts: [{ text: `You are an expert tutor. Use the following document text as your ONLY source of knowledge: \n\n${context}` }] },
      ...history,
      { role: 'user', parts: [{ text: query }] }
    ],
  });
  return response.text;
};
