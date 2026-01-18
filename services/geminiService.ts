
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, UserFilters, Language } from "../types";

// Initialiserer AI med API-nøkkel fra miljøvariabler
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function identifyIngredientsFromImage(base64Image: string, language: Language): Promise<string[]> {
  const model = 'gemini-3-flash-preview';
  const instruction = language === 'no' 
    ? "Identifiser alle matvare-ingredienser i dette bildet. Svar med en kommaseparert liste på norsk. Vær spesifikk og nøyaktig."
    : "Identify all food ingredients in this image. Answer with a comma separated list in English. Be specific and accurate.";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: instruction }
        ]
      }
    });
    return (response.text || "").split(',').map(item => item.trim()).filter(Boolean);
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
}

export async function generateRecipes(ingredients: string[], filters: UserFilters, language: Language): Promise<Recipe[]> {
  const model = 'gemini-3-pro-preview'; // Oppgradert til Pro for bedre logikk på PC/iPad
  const nutritionPrompt = filters.nutritionEnabled ? (language === 'no' 
    ? `MÅ være under ${filters.maxCalories} kcal og over ${filters.minProtein}g protein per porsjon.` 
    : `MUST be under ${filters.maxCalories} kcal and over ${filters.minProtein}g protein per serving.`) : "";
  
  const prompt = language === 'no' 
    ? `Du er en profesjonell kokk. Brukeren har: ${ingredients.join(', ')}. Foreslå 3 kreative oppskrifter på NORSK. 
       Kjøkkentype: ${filters.cuisine}. Kosthold: ${filters.diet.join(', ')}. Allergier som må unngås: ${filters.allergies.join(', ')}. 
       ${nutritionPrompt} Returner resultatet som et JSON-objekt.`
    : `You are a professional chef. User has: ${ingredients.join(', ')}. Suggest 3 creative recipes in ENGLISH. 
       Cuisine: ${filters.cuisine}. Diet: ${filters.diet.join(', ')}. Allergies to avoid: ${filters.allergies.join(', ')}. 
       ${nutritionPrompt} Return as a JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              prepTime: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              cuisine: { type: Type.STRING },
              availableIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              shoppingList: { type: Type.ARRAY, items: { type: Type.STRING } },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              imagePrompt: { type: Type.STRING }
            },
            required: ["id", "name", "description", "prepTime", "difficulty", "availableIngredients", "missingIngredients", "instructions", "shoppingList", "calories", "protein", "imagePrompt"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Generation Error:", error);
    return [];
  }
}

export async function generateRecipeImage(prompt: string): Promise<string> {
  const model = 'gemini-2.5-flash-image';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: `High-end professional food photography, minimalist style, bright lighting, appetizing: ${prompt}` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    console.error("Image gen error:", e);
  }
  return "";
}
