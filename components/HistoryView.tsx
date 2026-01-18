
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface HistoryViewProps {
  history: { date: string; image?: string; ingredients: string[] }[];
  language: Language;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, language }) => {
  const t = translations[language];

  return (
    <div className="px-6 py-8">
      <h2 className="text-3xl font-black text-gray-900 mb-8">{t.scanHistory}</h2>
      
      {history.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-gray-300">
            <i className="fa-solid fa-camera-rotate text-3xl"></i>
          </div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">{t.noScans}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 flex gap-4 items-center border border-gray-100 shadow-sm">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-xl">
                <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.date}</p>
                <h4 className="font-black text-gray-800 mb-1">{item.ingredients?.length || 0} {t.ingredientsFound}</h4>
                <p className="text-xs text-gray-500 truncate font-bold">{item.ingredients?.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
