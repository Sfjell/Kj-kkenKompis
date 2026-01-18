
import React, { useState } from 'react';
import { ShoppingItem, Language } from '../types';
import { translations } from '../translations';

interface ShoppingViewProps {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (text: string) => void;
  language: Language;
}

const ShoppingView: React.FC<ShoppingViewProps> = ({ items, onToggle, onRemove, onAdd, language }) => {
  const [inputText, setInputText] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAdd(inputText);
      setInputText('');
    }
  };

  const completedCount = items.filter(i => i.completed).length;

  return (
    <div className="px-6 py-8">
      <h2 className="text-3xl font-black text-gray-900 mb-2">{t.myShoppingList}</h2>
      <p className="text-gray-500 mb-8 font-medium">
        {items.length === 0 
          ? t.emptyShopping
          : t.itemsBought.replace('{count}', completedCount.toString()).replace('{total}', items.length.toString())}
      </p>

      <form onSubmit={handleSubmit} className="mb-8">
         <div className="relative">
            <input 
              type="text" 
              placeholder={t.addItem}
              className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-6 pr-14 font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-all"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
         </div>
      </form>

      <div className="space-y-3 pb-10">
        {items.map(item => (
          <div 
            key={item.id} 
            className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
              item.completed 
                ? 'bg-gray-50 border-gray-100 opacity-60' 
                : 'bg-white border-gray-100 shadow-sm'
            }`}
          >
            <div 
              className="flex items-center gap-4 flex-1 cursor-pointer"
              onClick={() => onToggle(item.id)}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'
              }`}>
                {item.completed && <i className="fa-solid fa-check text-white text-[10px]"></i>}
              </div>
              <span className={`font-semibold ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {item.text}
              </span>
            </div>
            <button 
              onClick={() => onRemove(item.id)}
              className="p-2 text-gray-300 hover:text-red-400 transition-colors opacity-100"
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <button 
          onClick={() => {
            const text = items.map(i => `${i.completed ? '[x]' : '[ ]'} ${i.text}`).join('\n');
            navigator.clipboard.writeText(text);
            alert(t.copied);
          }}
          className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <i className="fa-solid fa-share-nodes"></i> {t.shareList}
        </button>
      )}
    </div>
  );
};

export default ShoppingView;
