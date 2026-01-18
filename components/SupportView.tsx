
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface SupportViewProps {
  onBack: () => void;
  language: Language;
}

const SupportView: React.FC<SupportViewProps> = ({ onBack, language }) => {
  const [sent, setSent] = useState(false);
  const t = translations[language].legal;
  const common = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="px-8 py-10">
      <button onClick={onBack} className="mb-6 text-emerald-500 font-bold flex items-center gap-2">
        <i className="fa-solid fa-arrow-left"></i> {common.back}
      </button>
      <h2 className="text-3xl font-black mb-6">{t.supportTitle}</h2>
      
      {sent ? (
        <div className="bg-emerald-50 p-8 rounded-[40px] text-center">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
            <i className="fa-solid fa-check"></i>
          </div>
          <h3 className="font-black text-emerald-900 text-xl mb-2">{t.supportSent}</h3>
          <p className="text-emerald-700 text-sm font-bold">{t.supportSentSub}</p>
          <button onClick={onBack} className="mt-8 font-black text-emerald-600 underline uppercase tracking-widest text-xs">{common.back}</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-gray-500 font-medium leading-relaxed">{t.supportDesc}</p>
          
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.supportSubject}</label>
            <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-emerald-500">
              {t.supportOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.supportMsg}</label>
            <textarea 
              required
              className="w-full bg-gray-50 border-none rounded-3xl py-4 px-6 font-bold focus:ring-2 focus:ring-emerald-500 min-h-[150px]"
              placeholder="..."
            ></textarea>
          </div>

          <button type="submit" className="w-full bg-emerald-500 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-emerald-100 active:scale-95 transition-all">
            {t.supportSend}
          </button>
        </form>
      )}
    </div>
  );
};

export default SupportView;
