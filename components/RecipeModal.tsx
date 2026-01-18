
import React from 'react';
import { Recipe, Language } from '../types';
import RecipeImage from './RecipeImage';
import { translations } from '../translations';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onAddToShopping: (items: string[]) => void;
  language: Language;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, onAddToShopping, language }) => {
  const t = translations[language];

  const handleAddToShopping = () => {
    onAddToShopping(recipe.shoppingList);
    onClose();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Oppskrift: ${recipe.name}`,
      text: `Sjekk ut denne deilige oppskriften på ${recipe.name} jeg fant med KjøkkenKompis AI!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Kopier til utklippstavle
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        alert(language === 'no' ? "Link kopiert til utklippstavlen!" : "Link copied to clipboard!");
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-12 overflow-hidden">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] rounded-t-[40px] sm:rounded-[48px] overflow-hidden flex flex-col animate-modal-in shadow-2xl">
        
        <div className="flex flex-col md:flex-row h-full">
          {/* Bilde-seksjon (Venstre på desktop) */}
          <div className="relative h-64 md:h-full md:w-2/5 flex-shrink-0">
            <RecipeImage 
              prompt={recipe.imagePrompt || recipe.name} 
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 flex gap-2 z-10">
              <button 
                onClick={onClose}
                className="w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-white"
              >
                <i className="fa-solid fa-xmark text-gray-800 text-xl"></i>
              </button>
              <button 
                onClick={handleShare}
                className="w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-white text-emerald-600"
              >
                <i className="fa-solid fa-share-nodes text-xl"></i>
              </button>
            </div>
            <div className="absolute bottom-6 left-6 right-6 hidden md:block">
               <div className="bg-white/90 backdrop-blur p-6 rounded-3xl shadow-xl border border-white/20">
                  <h3 className="text-xl font-black text-gray-900 mb-2">{recipe.name}</h3>
                  <div className="flex gap-4">
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{recipe.difficulty}</span>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">•</span>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{recipe.cuisine}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Innhold-seksjon (Høyre på desktop) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14 hide-scrollbar flex flex-col">
            <div className="md:hidden mb-6">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100 mb-4 inline-block">
                {recipe.cuisine} • {recipe.difficulty}
              </span>
              <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{recipe.name}</h2>
              <p className="text-gray-500 font-bold leading-relaxed">{recipe.description}</p>
            </div>

            <div className="hidden md:block mb-10">
               <p className="text-xl text-gray-500 font-bold leading-relaxed">{recipe.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
               <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.calories}</span>
                  <span className="text-lg font-black text-gray-900">{recipe.calories}</span>
               </div>
               <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.protein}</span>
                  <span className="text-lg font-black text-gray-900">{recipe.protein}g</span>
               </div>
               <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.time}</span>
                  <span className="text-lg font-black text-gray-900">{recipe.prepTime}</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              <div className="space-y-6">
                <h4 className="font-black text-gray-900 flex items-center gap-3 text-sm uppercase tracking-widest">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-500"><i className="fa-solid fa-circle-check"></i></div>
                  {t.available}
                </h4>
                <ul className="grid grid-cols-1 gap-3">
                  {recipe.availableIngredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="capitalize font-bold text-emerald-900">{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="font-black text-gray-900 flex items-center gap-3 text-sm uppercase tracking-widest">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500"><i className="fa-solid fa-cart-shopping"></i></div>
                  {t.needed}
                </h4>
                <ul className="grid grid-cols-1 gap-3">
                  {recipe.missingIngredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 bg-red-50/50 p-4 rounded-2xl border border-red-100/50">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="capitalize font-bold text-red-900">{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <h4 className="font-black text-2xl text-gray-900">{t.instructions}</h4>
              <div className="space-y-8">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed font-bold pt-1 text-lg">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 rounded-[40px] p-8 md:p-12 mb-12 border-2 border-orange-100 border-dashed">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h4 className="font-black text-orange-900 text-2xl flex items-center gap-3">
                  <i className="fa-solid fa-list-check"></i> {t.shoppingList}
                </h4>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      const text = `Handleliste for ${recipe.name}:\n` + recipe.shoppingList.join('\n');
                      navigator.clipboard.writeText(text);
                    }}
                    className="flex-1 md:flex-none bg-white text-orange-800 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    Kopier tekst
                  </button>
                  <button 
                    onClick={handleAddToShopping}
                    className="flex-1 md:flex-none bg-emerald-500 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95"
                  >
                    Lagre i app
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recipe.shoppingList.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/70 p-5 rounded-2xl border border-orange-100 shadow-sm">
                    <div className="w-6 h-6 border-2 border-orange-200 rounded-lg"></div>
                    <span className="text-orange-900 font-black capitalize text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400 font-bold leading-relaxed italic text-center mb-10">
              {t.nutriDisclaimer}
            </p>
            
            <button 
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-black transition-all active:scale-95 mt-auto"
            >
              {t.doneCooking}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in {
          animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 640px) {
          @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-modal-in {
            animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }
        }
      `}</style>
    </div>
  );
};

export default RecipeModal;
