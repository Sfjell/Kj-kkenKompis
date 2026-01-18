
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, UserFilters, Language } from "../types";

// Initialiserer AI med API-nøkkel fra miljøvariabler
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function identifyIngredientsFromImage(base64Image: string, language: Language): Promise<string[]> {
  const model = 'gemini-3-flash-preview';
  const systemInstruction = language === 'no'
    ? "Du er en ekspert på matvarer og bildegjenkjenning. Din oppgave er å identifisere alle spiselige ingredienser i et bilde. Svar KUN med en liste separert med komma. Ikke skriv introduksjoner eller forklaringer."
    : "You are a food and image recognition expert. Identify all edible ingredients in the image. Respond ONLY with a comma-separated list. No preamble or explanations.";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
            { text: language === 'no' ? "Hvilke ingredienser ser du her? Svar med komma-separert liste." : "What ingredients do you see? Respond with a comma-separated list." }
          ]
        }
      ],
      config: {
        systemInstruction
      }
    });
    
    const text = response.text || "";
    return text.split(',').map(item => item.trim()).filter(item => item.length > 1);
  } catch (error) {
    console.error("AI Ingredient Error:", error);
    return [];
  }
}

export async function generateRecipes(ingredients: string[], filters: UserFilters, language: Language): Promise<Recipe[]> {
  // Bruker Flash for hastighet og bedre JSON-følging i sanntid
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = language === 'no'
    ? "Du er en kreativ profesjonell kokk. Din oppgave er å foreslå nøyaktig 3 inspirerende oppskrifter basert på ingrediensene brukeren har tilgjengelig. Du skal returnere en JSON-matrise (array) med oppskriftsobjekter."
    : "You are a creative professional chef. Your task is to suggest exactly 3 inspiring recipes based on the ingredients provided. You must return a JSON array of recipe objects.";

  const nutritionRequirement = filters.nutritionEnabled 
    ? (language === 'no' 
        ? `Hver porsjon MÅ ha maks ${filters.maxCalories} kcal og minst ${filters.minProtein}g protein.` 
        : `Each serving MUST have a maximum of ${filters.maxCalories} calories and at least ${filters.minProtein}g protein.`)
    : "";

  const prompt = language === 'no'
    ? `Ingredienser tilgjengelig: ${ingredients.join(', ')}.
       Preferanser: Kjøkken: ${filters.cuisine}, Kosthold: ${filters.diet.join(', ') || 'Ingen spesielle'}, Allergier: ${filters.allergies.join(', ') || 'Ingen'}.
       ${nutritionRequirement}
       Lag 3 detaljerte oppskrifter på NORSK. Sørg for at 'availableIngredients' kun inneholder ting fra listen over, og 'missingIngredients' er ting man sannsynligvis må kjøpe i tillegg.`
    : `Available ingredients: ${ingredients.join(', ')}.
       Preferences: Cuisine: ${filters.cuisine}, Diet: ${filters.diet.join(', ') || 'None'}, Allergies: ${filters.allergies.join(', ') || 'None'}.
       ${nutritionRequirement}
       Create 3 detailed recipes in ENGLISH. Ensure 'availableIngredients' only contains items from the list above, and 'missingIngredients' are items the user likely needs to buy.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
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
            required: ["id", "name", "description", "prepTime", "difficulty", "cuisine", "availableIngredients", "missingIngredients", "instructions", "shoppingList", "calories", "protein", "imagePrompt"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return Array.isArray(results) ? results : [];
  } catch (error) {
    console.error("AI Recipe Generation Error:", error);
    return [];
  }
}

export async function generateRecipeImage(prompt: string): Promise<string> {
  const model = 'gemini-2.5-flash-image';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: `Professional food photography, top-down view, studio lighting, delicious: ${prompt}` }] },
      config: { 
        imageConfig: { 
          aspectRatio: "16:9" 
        } 
      }
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }
  } catch (e) {
    console.error("AI Image Generation Error:", e);
  }
  return "";
}
