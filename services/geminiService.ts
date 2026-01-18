
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, UserFilters, Language } from "../types";

// Initialiserer AI med API-nøkkel fra miljøvariabler
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Renser AI-output for å sikre at vi bare har ren JSON.
 */
function cleanJsonResponse(text: string): string {
  // Fjerner markdown-blokker og alt som ikke er del av selve JSON-matrisen
  const jsonStart = text.indexOf('[');
  const jsonEnd = text.lastIndexOf(']');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    return text.substring(jsonStart, jsonEnd + 1);
  }
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

/**
 * Renser ingredienslisten for forklarende tekst fra AI-en.
 */
function cleanIngredientList(text: string): string[] {
  // Noen ganger svarer AI-en "Her er listen: eple, banan". Vi vil bare ha "eple, banan".
  let cleaned = text;
  if (cleaned.includes(':')) {
    cleaned = cleaned.split(':').pop() || cleaned;
  }
  
  return cleaned.split(',')
    .map(item => item.trim())
    // Fjerner punktum til slutt og uønsket tekst
    .map(item => item.replace(/\.$/, ""))
    .filter(item => item.length > 1 && item.length < 50 && !item.toLowerCase().includes('her er'));
}

export async function identifyIngredientsFromImage(base64Image: string, language: Language): Promise<string[]> {
  const model = 'gemini-3-flash-preview';
  const systemInstruction = language === 'no'
    ? "Du er en ekspert på matvarer. Identifiser alle ingredienser i bildet. Svar KUN med en liste separert med komma. Ikke skriv introduksjon eller forklaring. Hvis du ikke ser mat, svar 'EMPTY'."
    : "Food expert. Identify ingredients. Respond ONLY with a comma-separated list. No preamble. If no food, respond 'EMPTY'.";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
            { text: "List ingredients." }
          ]
        }
      ],
      config: { systemInstruction }
    });
    
    const text = response.text?.trim() || "";
    if (text.toUpperCase() === 'EMPTY') return [];
    
    return cleanIngredientList(text);
  } catch (error) {
    console.error("AI Ingredient Error:", error);
    return [];
  }
}

export async function generateRecipes(ingredients: string[], filters: UserFilters, language: Language): Promise<Recipe[]> {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = language === 'no'
    ? "Du er en kreativ kokk. Lag 3 oppskrifter basert på ingrediensene. Du SKAL returnere svaret som en valid JSON-matrise (array). Ikke bruk markdown-formatering i svaret, bare rå JSON."
    : "Creative chef. Create 3 recipes based on ingredients. You MUST return the response as a valid JSON array. Do not use markdown, only raw JSON.";

  const prompt = language === 'no'
    ? `Ingredienser: ${ingredients.join(', ')}. 
       Filtre: Kjøkken: ${filters.cuisine}, Diett: ${filters.diet.join(', ')}, Allergier: ${filters.allergies.join(', ')}.
       Maks kalorier: ${filters.nutritionEnabled ? filters.maxCalories : 'Ingen grense'}.
       Lag 3 oppskrifter på NORSK. Vær kreativ med det jeg har!`
    : `Ingredients: ${ingredients.join(', ')}. 
       Filters: ${filters.cuisine} cuisine, Diet: ${filters.diet.join(', ')}, Allergies: ${filters.allergies.join(', ')}.
       Max calories: ${filters.nutritionEnabled ? filters.maxCalories : 'No limit'}.
       Create 3 recipes in ENGLISH.`;

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

    const text = response.text || "[]";
    const cleanedText = cleanJsonResponse(text);
    const results = JSON.parse(cleanedText);
    return Array.isArray(results) ? results : [];
  } catch (error) {
    console.error("AI Recipe Generation Error:", error);
    // Prøv en gang til uten strenge JSON-krav hvis det feilet (fallback)
    return [];
  }
}

export async function generateRecipeImage(prompt: string): Promise<string> {
  const model = 'gemini-2.5-flash-image';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: `Gourmet food photography, plate, delicious: ${prompt}` }] },
      config: { 
        imageConfig: { aspectRatio: "16:9" } 
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
