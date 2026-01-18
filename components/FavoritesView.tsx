
import React, { useState } from 'react';
import { Recipe, Language } from '../types';
import RecipeModal from './RecipeModal';
import RecipeImage from './RecipeImage';
import { translations } from '../translations';

interface FavoritesViewProps {
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  onAddToShopping: (items: string[]) => void;
  language: Language;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, onToggleFavorite, onAddToShopping, language }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const t = translations[language];

  return (
    <div className="px-6 py-8">
      <h2 className="text-3xl font-black text-gray-900 mb-8">{t.favorites}</h2>
      
      {favorites.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-24 h-24 bg-pink-50 rounded-[40px] flex items-center justify-center mx-auto mb-6 text-pink-300">
            <i className="fa-solid fa-heart text-3xl"></i>
          </div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs px-12">{t.emptyFavs}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {favorites.map(recipe => (
            <div 
              key={recipe.id}
              className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex cursor-pointer hover:shadow-md transition-all group"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <RecipeImage 
                prompt={recipe.imagePrompt || recipe.name} 
                alt={recipe.name}
                className="w-32 h-auto object-cover group-hover:scale-105 transition-transform"
              />
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-gray-800 mb-1 leading-tight">{recipe.name}</h4>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(recipe);
                    }}
                    className="text-red-500"
                  >
                    <i className="fa-solid fa-heart"></i>
                  </button>
                </div>
                <p className="text-xs text-gray-400 font-bold line-clamp-1 mb-3">{recipe.description}</p>
                <div className="flex gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  <span><i className="fa-regular fa-clock mr-1"></i> {recipe.prepTime}</span>
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

export default FavoritesView;
