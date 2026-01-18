
import React from 'react';
import { CUISINES, DIET_OPTIONS, ALLERGY_OPTIONS } from '../constants';
import { UserFilters, Language } from '../types';
import { translations } from '../translations';

interface HomeProps {
  onCapture: (base64: string) => void;
  filters: UserFilters;
  onFilterChange: (filters: UserFilters) => void;
  language: Language;
  usageCount: number;
  isPro: boolean;
}

const Home: React.FC<HomeProps> = ({ onCapture, filters, onFilterChange, language, usageCount, isPro }) => {
  const t = translations[language];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result && result.includes(',')) {
          const base64String = result.split(',')[1];
          onCapture(base64String);
        }
      };
      reader.onerror = () => {
        alert(language === 'no' ? "Kunne ikke lese bildet. Prøv igjen." : "Could not read image. Try again.");
      };
      reader.readAsDataURL(file);
    }
    // Nullstill for å tillate samme fil på nytt
    e.target.value = '';
  };

  const toggleDiet = (diet: string) => {
    const newDiets = filters.diet.includes(diet)
      ? filters.diet.filter(d => d !== diet)
      : [...filters.diet, diet];
    onFilterChange({ ...filters, diet: newDiets });
  };

  const toggleAllergy = (allergy: string) => {
    const newAllergies = filters.allergies.includes(allergy)
      ? filters.allergies.filter(a => a !== allergy)
      : [...filters.allergies, allergy];
    onFilterChange({ ...filters, allergies: newAllergies });
  };

  return (
    <div className="py-4 pb-12 max-w-4xl mx-auto px-4">
      <div className="mb-8 mt-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight" dangerouslySetInnerHTML={{ __html: t.whatToCook }}></h2>
        <p className="text-gray-500 mt-4 text-lg max-w-2xl">{t.scanDesc}</p>
        
        {!isPro && (
          <div className="mt-6 flex items-center gap-4 max-w-sm">
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
               <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(usageCount / 5) * 100}%` }}></div>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
              {t.usageLeft.replace('{count}', Math.max(0, 5 - usageCount).toString())}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {/* Knapp for Kamera - Bruker nå label for bedre mobil-kompatibilitet */}
        <label className="flex flex-row items-center justify-start p-6 bg-emerald-50 border-2 border-emerald-100 rounded-[32px] group hover:bg-emerald-100 transition-all hover:shadow-md active:scale-95 cursor-pointer">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg flex-shrink-0">
            <i className="fa-solid fa-camera text-xl"></i>
          </div>
          <div className="text-left">
            <span className="block font-black text-lg text-emerald-900 leading-tight">{t.takePhoto}</span>
            <span className="text-emerald-700/60 font-bold text-xs">Gjenkjenn varer med AI</span>
          </div>
        </label>

        {/* Knapp for Galleri - Bruker nå label */}
        <label className="flex flex-row items-center justify-start p-6 bg-blue-50 border-2 border-blue-100 rounded-[32px] group hover:bg-blue-100 transition-all hover:shadow-md active:scale-95 cursor-pointer">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg flex-shrink-0">
            <i className="fa-solid fa-image text-xl"></i>
          </div>
          <div className="text-left">
            <span className="block font-black text-lg text-blue-900 leading-tight">{t.upload}</span>
            <span className="text-blue-700/60 font-bold text-xs">Velg bilde fra galleri</span>
          </div>
        </label>
      </div>

      <section className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-black text-gray-800 mb-5 flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500"><i className="fa-solid fa-earth-europe"></i></div>
                 {t.cuisineType}
              </h3>
              <div className="flex flex-wrap gap-2">
                {CUISINES.map(c => (
                  <button 
                    key={c}
                    onClick={() => onFilterChange({ ...filters, cuisine: c })}
                    className={`px-5 py-2 rounded-2xl whitespace-nowrap font-bold transition-all border-2 text-sm ${
                      filters.cuisine === c 
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md scale-105' 
                        : 'bg-white text-gray-400 border-gray-100 hover:border-emerald-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-800 mb-5 flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500"><i className="fa-solid fa-leaf"></i></div>
                 {t.diet}
              </h3>
              <div className="flex flex-wrap gap-2">
                {DIET_OPTIONS.map(d => (
                  <button 
                    key={d.id}
                    onClick={() => toggleDiet(d.id)}
                    className={`px-4 py-2 rounded-2xl border-2 transition-all font-bold text-sm ${
                      filters.diet.includes(d.id)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-100 bg-white text-gray-400'
                    }`}
                  >
                    {t.dietNames[d.id as keyof typeof t.dietNames]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="bg-white p-6 md:p-8 rounded-[32px] border-2 border-gray-50 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500"><i className="fa-solid fa-chart-pie"></i></div>
                    {t.nutritionGoals}
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer scale-110">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={filters.nutritionEnabled}
                      onChange={() => onFilterChange({...filters, nutritionEnabled: !filters.nutritionEnabled})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
               </div>
               
               <div className={`space-y-8 transition-opacity duration-300 ${filters.nutritionEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">{t.maxCalories}</span>
                      <span className="font-black text-emerald-600">{filters.maxCalories} kcal</span>
                    </div>
                    <input 
                      type="range" min="200" max="1500" step="50"
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      value={filters.maxCalories}
                      onChange={(e) => onFilterChange({...filters, maxCalories: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">{t.minProtein}</span>
                      <span className="font-black text-emerald-600">{filters.minProtein} g</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" step="5"
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      value={filters.minProtein}
                      onChange={(e) => onFilterChange({...filters, minProtein: parseInt(e.target.value)})}
                    />
                  </div>
               </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-800 mb-5 flex items-center gap-3">
                 <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500"><i className="fa-solid fa-triangle-exclamation"></i></div>
                 {t.allergies}
              </h3>
              <div className="flex flex-wrap gap-2">
                {ALLERGY_OPTIONS.map(a => (
                  <button 
                    key={a.id}
                    onClick={() => toggleAllergy(a.id)}
                    className={`px-4 py-2 rounded-2xl border-2 transition-all font-bold text-sm ${
                      filters.allergies.includes(a.id)
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-100 bg-white text-gray-400'
                    }`}
                  >
                    {t.allergyNames[a.id as keyof typeof t.allergyNames]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
