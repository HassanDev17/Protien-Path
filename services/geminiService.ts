import { GoogleGenAI, Type, Schema } from "@google/genai";

// Initialize Gemini Client
// @ts-ignore
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NUTRITION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "A short, concise name of the identified food." },
    calories: { type: Type.NUMBER, description: "Estimated total calories (kcal)." },
    protein: { type: Type.NUMBER, description: "Estimated protein content (g)." },
    fat: { type: Type.NUMBER, description: "Estimated fat content (g)." },
    carbs: { type: Type.NUMBER, description: "Estimated carbohydrate content (g)." },
    sugar: { type: Type.NUMBER, description: "Estimated sugar content (g). Include added sugars and natural sugars." },
    estimatedWeight: { type: Type.STRING, description: "Estimated serving size or weight (e.g., '200g' or '1 bowl')." },
    confidence: { type: Type.STRING, description: "Low, Medium, or High confidence in this estimation." }
  },
  required: ["name", "calories", "protein", "carbs", "fat"],
};

export const analyzeMealWithGemini = async (
  textDescription: string,
  imageBase64?: string
): Promise<{
  name: string;
  nutrition: { calories: number; protein: number; fat: number; carbs: number; sugar?: number; estimatedWeight: string };
}> => {
  try {
    const parts: any[] = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg", // Assuming JPEG for simplicity from camera
          data: imageBase64,
        },
      });
    }

    if (textDescription) {
      parts.push({
        text: `Analyze this meal description/image. Identify the food and provide a detailed nutritional breakdown properly estimating calories, protein, fats, carbs, and sugar. Description: "${textDescription}"`
      });
    } else if (imageBase64) {
      parts.push({
        text: "Analyze this food image. Identify the food and provide a detailed nutritional breakdown properly estimating calories, protein, fats, carbs, and sugar."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: NUTRITION_SCHEMA,
        systemInstruction: "You are an expert nutritionist. Be conservative but realistic with calorie and macro estimates. Ensure you provide estimates for Protein, Carbs, Fats, and Sugar. Provide a single object response."
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const data = JSON.parse(resultText);

    return {
      name: data.name || "Unknown Meal",
      nutrition: {
        calories: data.calories || 0,
        protein: data.protein || 0,
        fat: data.fat || 0,
        carbs: data.carbs || 0,
        sugar: data.sugar || 0,
        estimatedWeight: data.estimatedWeight || "1 serving"
      }
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze meal. Please try again.");
  }
};
