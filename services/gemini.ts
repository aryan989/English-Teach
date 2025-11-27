import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VocabQuestion, StoryLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

// Schema for Vocabulary Questions
const vocabSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "The Thai word or a simple definition in Thai" },
      correctAnswer: { type: Type.STRING, description: "The correct English translation" },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "4 possible English answers (1 correct, 3 wrong)" 
      },
      emoji: { type: Type.STRING, description: "A single emoji representing the word" }
    },
    required: ["question", "correctAnswer", "options", "emoji"],
  },
};

// Schema for Story Levels
const storySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    story: { type: Type.STRING, description: "A short, simple story (3-5 sentences) in English suitable for Thai kids." },
    question: { type: Type.STRING, description: "A comprehension question about the story." },
    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options for the answer" },
    correctAnswer: { type: Type.STRING }
  },
  required: ["title", "story", "question", "options", "correctAnswer"],
};

export const generateVocabQuestions = async (topic: string = "Animals"): Promise<VocabQuestion[]> => {
  try {
    const prompt = `Generate 5 vocabulary multiple-choice questions for Thai elementary students learning English. 
    Topic: ${topic}.
    The 'question' field MUST be the Thai word (Translation) for the target English word.
    Ensure the English options are simple and distinct.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: vocabSchema,
        temperature: 0.7,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as VocabQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Error generating vocab questions:", error);
    return [];
  }
};

export const generateStoryLevel = async (theme: string = "Thailand Adventure"): Promise<StoryLevel | null> => {
  try {
    const prompt = `Write a very short, simple story (max 50 words) for a Thai child learning English.
    Theme: ${theme}. 
    Use simple grammar.
    Include one multiple-choice comprehension question based on the text.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: storySchema,
        temperature: 0.8,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as StoryLevel;
    }
    return null;
  } catch (error) {
    console.error("Error generating story:", error);
    return null;
  }
};