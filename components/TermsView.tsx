
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface TermsViewProps {
  onBack: () => void;
  language: Language;
}

const TermsView: React.FC<TermsViewProps> = ({ onBack, language }) => {
  const t = translations[language].legal;
  const common = translations[language];

  return (
    <div className="px-8 py-10">
      <button onClick={onBack} className="mb-6 text-emerald-500 font-bold flex items-center gap-2">
        <i className="fa-solid fa-arrow-left"></i> {common.back}
      </button>
      <h2 className="text-3xl font-black mb-6">{t.termsTitle}</h2>
      <div className="prose prose-sm text-gray-600 space-y-4 font-medium leading-relaxed">
        <p>{t.termsText}</p>
      </div>
    </div>
  );
};

export default TermsView;
