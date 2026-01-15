import OpenAI from 'openai';

// Initialize OpenAI Client
// @ts-ignore
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

const NUTRITION_SCHEMA_DESCRIPTION = `You must respond with a valid JSON object matching this exact schema:
{
  "name": "string - A short, concise name of the identified food",
  "calories": "number - Estimated total calories (kcal)",
  "protein": "number - Estimated protein content (g)",
  "fat": "number - Estimated fat content (g)",
  "carbs": "number - Estimated carbohydrate content (g)",
  "sugar": "number - Estimated sugar content (g). Include added sugars and natural sugars",
  "estimatedWeight": "string - Estimated serving size or weight (e.g., '200g' or '1 bowl')",
  "confidence": "string - Low, Medium, or High confidence in this estimation"
}`;

export const analyzeMealWithOpenAI = async (
  textDescription: string,
  imageBase64?: string
): Promise<{
  name: string;
  nutrition: { calories: number; protein: number; fat: number; carbs: number; sugar?: number; estimatedWeight: string };
}> => {
  try {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

    // Build content array for the message
    const content: Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }> = [];

    // Add image if provided
    if (imageBase64) {
      // OpenAI expects data URL format
      const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
      content.push({
        type: 'image_url',
        image_url: {
          url: imageUrl,
        },
      });
    }

    // Add text description
    let userText = '';
    if (textDescription) {
      userText = `Analyze this meal description${imageBase64 ? '/image' : ''}. Identify the food and provide a detailed nutritional breakdown properly estimating calories, protein, fats, carbs, and sugar. Description: "${textDescription}"`;
    } else if (imageBase64) {
      userText = 'Analyze this food image. Identify the food and provide a detailed nutritional breakdown properly estimating calories, protein, fats, carbs, and sugar.';
    }

    if (userText) {
      content.push({
        type: 'text',
        text: userText,
      });
    }

    // Add system message with schema instructions
    messages.push({
      role: 'system',
      content: `You are an expert nutritionist. Be conservative but realistic with calorie and macro estimates. Ensure you provide estimates for Protein, Carbs, Fats, and Sugar. Provide a single object response in valid JSON format.

${NUTRITION_SCHEMA_DESCRIPTION}`,
    });

    // Add user message with content
    messages.push({
      role: 'user',
      content: content as any,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) {
      throw new Error('No response from AI');
    }

    const data = JSON.parse(resultText);

    return {
      name: data.name || 'Unknown Meal',
      nutrition: {
        calories: data.calories || 0,
        protein: data.protein || 0,
        fat: data.fat || 0,
        carbs: data.carbs || 0,
        sugar: data.sugar || 0,
        estimatedWeight: data.estimatedWeight || '1 serving',
      },
    };
  } catch (error: any) {
    console.error('OpenAI Analysis Error:', error);

    // Provide more specific error messages
    if (error?.message?.includes('API key') || error?.message?.includes('authentication') || error?.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key configuration.');
    }

    if (error?.message?.includes('quota') || error?.message?.includes('Quota') || error?.status === 429) {
      throw new Error('API quota exceeded. Please check your OpenAI API usage limits.');
    }

    if (error?.message?.includes('rate limit') || error?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }

    // Show the actual error message if available
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    throw new Error(`Failed to analyze meal: ${errorMessage}`);
  }
};

