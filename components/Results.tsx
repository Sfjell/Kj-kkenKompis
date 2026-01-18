
import React, { useState } from 'react';
import { Recipe, Language } from '../types';
import RecipeModal from './RecipeModal';
import RecipeImage from './RecipeImage';
import { translations } from '../translations';

interface ResultsProps {
  recipes: Recipe[];
  ingredients: string[];
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  onRetry: () => void;
  isProcessing: boolean;
  onAddToShopping: (items: string[]) => void;
  language: Language;
}

const Results: React.FC<ResultsProps> = ({ 
  recipes, 
  ingredients, 
  favorites, 
  onToggleFavorite, 
  onRetry,
  isProcessing,
  onAddToShopping,
  language
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const t = translations[language];

  if (isProcessing) {
    return null;
  }

  // Sikre at ingredients og recipes er matriser
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];
  const safeRecipes = Array.isArray(recipes) ? recipes : [];

  return (
    <div className="py-6 pb-20 px-4">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900">{t.scanResults.replace('{count}', safeIngredients.length.toString())}</h2>
          <p className="text-gray-500 font-bold mt-1">
            Basert på: <span className="text-emerald-600 underline decoration-emerald-200">{safeIngredients.join(', ')}</span>
          </p>
        </div>
        <button 
          onClick={onRetry}
          className="w-full md:w-auto text-emerald-600 font-black text-sm bg-emerald-50 px-8 py-3 rounded-2xl uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-colors"
        >
          {t.newScan}
        </button>
      </div>

      <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="text-2xl font-black text-gray-800">{t.suggestions}</h3>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{safeRecipes.length} oppskrifter</span>
      </div>
      
      {safeRecipes.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] p-12 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-gray-400">
            <i className="fa-solid fa-face-sad-tear text-3xl"></i>
          </div>
          <p className="text-gray-500 font-black text-lg">{t.noRecipes}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeRecipes.map(recipe => (
            <div 
              key={recipe.id || Math.random()}
              className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative flex flex-col"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="relative aspect-video overflow-hidden bg-gray-50">
                <RecipeImage 
                  prompt={recipe.imagePrompt || recipe.name} 
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(recipe);
                  }}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-lg shadow-md active:scale-90 transition-all hover:bg-white"
                >
                  <i className={`${Array.isArray(favorites) && favorites.some(f => f.id === recipe.id) ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-gray-400'}`}></i>
                </button>
                <div className="absolute bottom-3 left-3">
                   <span className="px-2 py-1 bg-black/40 backdrop-blur text-white text-[9px] font-black rounded-lg uppercase tracking-widest">
                     {recipe.prepTime}
                   </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-xl font-black text-gray-900 mb-2 leading-tight line-clamp-1">{recipe.name}</h4>
                <p className="text-gray-500 text-xs font-bold line-clamp-2 mb-4 leading-relaxed flex-1">{recipe.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <div className="flex -space-x-2">
                    {Array.isArray(recipe.availableIngredients) && recipe.availableIngredients.slice(0, 3).map((ing, i) => (
                      <div key={i} className="w-8 h-8 rounded-xl bg-emerald-50 border-2 border-white flex items-center justify-center text-[10px] text-emerald-700 font-black uppercase shadow-sm">
                        {ing[0]}
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600">{recipe.calories || 0} kcal</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)}
          onAddToShopping={onAddToShopping}
          language={language}
        />
      )}
    </div>
  );
};

export default Results;
