
export type Language = 'en' | 'no';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
  isPro: boolean;
}

export interface Ingredient {
  name: string;
  category?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced' | 'Enkel' | 'Middels' | 'Avansert';
  cuisine: string;
  availableIngredients: string[];
  missingIngredients: string[];
  instructions: string[];
  shoppingList: string[];
  calories?: number;
  protein?: number;
  imagePrompt?: string;
}

export interface UserFilters {
  cuisine: string;
  diet: string[];
  allergies: string[];
  nutritionEnabled: boolean;
  maxCalories: number;
  minProtein: number;
}

export interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
}

export type AppView = 'onboarding' | 'home' | 'scanning' | 'results' | 'favorites' | 'history' | 'shopping' | 'profile' | 'login' | 'privacy' | 'support' | 'terms' | 'paywall';
