
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface PrivacyPolicyViewProps {
  onBack: () => void;
  language: Language;
}

const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack, language }) => {
  const t = translations[language].legal;
  const common = translations[language];

  return (
    <div className="px-8 py-10">
      <button onClick={onBack} className="mb-6 text-emerald-500 font-bold flex items-center gap-2">
        <i className="fa-solid fa-arrow-left"></i> {common.back}
      </button>
      <h2 className="text-3xl font-black mb-6">{t.privacyTitle}</h2>
      <div className="prose prose-sm text-gray-600 space-y-4">
        <p className="font-bold text-gray-900">{t.privacyUpdate}</p>
        <p className="font-medium leading-relaxed">{t.privacyText}</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyView;
