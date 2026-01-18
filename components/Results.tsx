
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
    return null; // ScanningOverlay handles this
  }

  return (
    <div className="py-6 pb-20">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900">{t.scanResults.replace('{count}', ingredients.length.toString())}</h2>
          <p className="text-gray-500 font-bold mt-1">
            Basert på: <span className="text-emerald-600 underline decoration-emerald-200">{ingredients.join(', ')}</span>
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
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{recipes.length} oppskrifter funnet</span>
      </div>
      
      {recipes.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] p-20 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-gray-400">
            <i className="fa-solid fa-face-sad-tear text-4xl"></i>
          </div>
          <p className="text-gray-500 font-black text-xl">{t.noRecipes}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map(recipe => (
            <div 
              key={recipe.id}
              className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative flex flex-col"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="relative aspect-video overflow-hidden">
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
                  className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-xl shadow-lg active:scale-90 transition-all hover:bg-white"
                >
                  <i className={`${favorites.some(f => f.id === recipe.id) ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-gray-400'}`}></i>
                </button>
                <div className="absolute bottom-4 left-4 flex gap-2">
                   <span className="px-3 py-1 bg-black/50 backdrop-blur text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                     {recipe.prepTime}
                   </span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h4 className="text-2xl font-black text-gray-900 mb-3 leading-tight line-clamp-1">{recipe.name}</h4>
                <p className="text-gray-500 text-sm font-bold line-clamp-2 mb-6 leading-relaxed flex-1">{recipe.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                  <div className="flex -space-x-3">
                    {recipe.availableIngredients.slice(0, 3).map((ing, i) => (
                      <div key={i} className="w-10 h-10 rounded-2xl bg-emerald-50 border-4 border-white flex items-center justify-center text-xs text-emerald-700 font-black uppercase shadow-sm" title={ing}>
                        {ing[0]}
                      </div>
                    ))}
                    {recipe.availableIngredients.length > 3 && (
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 border-4 border-white flex items-center justify-center text-xs text-gray-400 font-black shadow-sm">
                        +{recipe.availableIngredients.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Næring</span>
                    <span className="text-sm font-black text-emerald-600">{recipe.calories} kcal</span>
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
