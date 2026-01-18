
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, UserFilters, Language } from "../types";

// Henter nøkkelen fra miljøvariabler
const API_KEY = process.env.API_KEY;

// En enkel sjekk som kun logger i konsollen hvis noe er galt
if (!API_KEY || API_KEY === "undefined") {
  console.error("KJØKKENKOMPIS FEIL: API_KEY mangler i miljøvariablene! Sjekk kontrollpanelet i hostingen din.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

/**
 * Renser AI-output for å sikre at vi bare har ren JSON.
 */
function cleanJsonResponse(text: string): string {
  if (!text) return "[]";
  
  const jsonStart = text.indexOf('[');
  const jsonEnd = text.lastIndexOf(']');
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    let jsonContent = text.substring(jsonStart, jsonEnd + 1);
    return jsonContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  }
  
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

/**
 * Renser ingredienslisten for forklarende tekst fra AI-en.
 */
function cleanIngredientList(text: string): string[] {
  if (!text) return [];
  
  const introPhrases = [
    "her er en liste over matvarene i kjøleskapet",
    "her er en liste over matvarene",
    "her er listen over",
    "her er varene",
    "jeg ser følgende",
    "i kjøleskapet finnes",
    "here is a list of",
    "i can see",
    "the ingredients are"
  ];
  
  let cleaned = text;
  
  if (cleaned.includes(':')) {
    cleaned = cleaned.split(':').pop() || cleaned;
  } else {
    for (const phrase of introPhrases) {
      const regex = new RegExp(`^${phrase}\\s*`, 'i');
      cleaned = cleaned.replace(regex, "");
    }
  }
  
  return cleaned.split(',')
    .map(item => item.trim())
    .map(item => item.replace(/\.$/, ""))
    .filter(item => item.length > 1 && item.length < 60 && !item.toLowerCase().includes('her er'));
}

export async function identifyIngredientsFromImage(base64Image: string, language: Language): Promise<string[]> {
  if (!API_KEY) return [];
  
  const model = 'gemini-3-flash-preview';
  const systemInstruction = language === 'no'
    ? "Du er en matekspert. Identifiser ingredienser i bildet. Svar KUN med en liste separert med komma. Ingen introduksjon. Hvis ingen mat, svar 'EMPTY'."
    : "Food expert. Identify ingredients. Respond ONLY with a comma-separated list. No preamble. If no food, respond 'EMPTY'.";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
            { text: "List ingredients found in this photo." }
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
  if (!API_KEY) return [];
  
  const model = 'gemini-3-flash-preview';
  const systemInstruction = language === 'no'
    ? "Du er en kreativ kokk. Lag 3 oppskrifter som en JSON-matrise. Svar KUN med JSON. For 'imagePrompt', skriv en detaljert beskrivelse på engelsk av hvordan retten ser ut servert (f.eks. 'A steaming bowl of creamy tomato soup topped with fresh basil')."
    : "Creative chef. Create 3 recipes as a JSON array. Respond ONLY with JSON. For 'imagePrompt', write a detailed English description of the plated dish.";

  const prompt = language === 'no'
    ? `Ingredienser: ${ingredients.join(', ')}. 
       Filtre: ${filters.cuisine} kjøkken, ${filters.diet.join(', ')} diett. Allergier: ${filters.allergies.join(', ')}.
       Maks kalorier: ${filters.nutritionEnabled ? filters.maxCalories : 'Ubegrenset'}.
       Lag 3 gode oppskrifter på NORSK.`
    : `Ingredients: ${ingredients.join(', ')}. 
       Filters: ${filters.cuisine} cuisine, ${filters.diet.join(', ')} diet. Allergies: ${filters.allergies.join(', ')}.
       Create 3 detailed recipes in ENGLISH.`;

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
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Recipe Error:", error);
    return [];
  }
}

export async function generateRecipeImage(prompt: string): Promise<string> {
  if (!API_KEY) return "";
  
  const model = 'gemini-2.5-flash-image';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
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
    console.error("AI Image Error:", e);
  }
  return "";
}
