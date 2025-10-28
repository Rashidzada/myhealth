
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { MealAnalysisResult, ChatMessage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const chatModel = 'gemini-2.5-flash';
const analysisModel = 'gemini-2.5-flash';

const mealAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief, 1-2 sentence summary of the meal's impact on blood sugar.",
    },
    good_for_sugar: {
      type: Type.ARRAY,
      description: "List of ingredients or components in the meal that are generally good for blood sugar control.",
      items: { type: Type.STRING },
    },
    bad_for_sugar: {
      type: Type.ARRAY,
      description: "List of ingredients or components in the meal that could negatively impact blood sugar.",
      items: { type: Type.STRING },
    },
    suggestions: {
      type: Type.ARRAY,
      description: "Actionable suggestions for making the meal healthier or for future meal choices.",
      items: { type: Type.STRING },
    },
  },
  required: ["summary", "good_for_sugar", "bad_for_sugar", "suggestions"],
};

export const analyzeMealWithGemini = async (mealDescription: string): Promise<MealAnalysisResult> => {
  try {
    const prompt = `Analyze the following meal for its potential impact on blood sugar. Identify ingredients that are good and bad for blood sugar management, provide a brief summary, and suggest healthier alternatives. Important: Do not give medical advice. Meal: "${mealDescription}"`;
    
    const response = await ai.models.generateContent({
      model: analysisModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mealAnalysisSchema,
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as MealAnalysisResult;
  } catch (error) {
    console.error("Error analyzing meal with Gemini:", error);
    throw new Error("Failed to get meal analysis from AI.");
  }
};

let chatInstance: Chat | null = null;

const initializeChat = () => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model: chatModel,
            config: {
                systemInstruction: 'You are a helpful and encouraging health and wellness assistant. Provide general information and positive suggestions based on user questions. You must explicitly state at the beginning of the conversation that you are not a medical professional and your advice should not be considered a substitute for professional medical consultation. Keep your responses concise, friendly, and easy to understand.',
            },
        });
    }
    return chatInstance;
};

export const getHealthAdvice = async (prompt: string): Promise<string> => {
    try {
        const chat = initializeChat();
        const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
        return response.text;
    } catch (error) {
        console.error("Error getting health advice from Gemini:", error);
        throw new Error("Failed to get health advice from AI.");
    }
};
