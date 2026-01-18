
import React, { useState } from 'react';
import { ONBOARDING_STEPS } from '../constants';
import { Language } from '../types';
import { translations } from '../translations';

interface OnboardingProps {
  onComplete: () => void;
  language: Language;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, language }) => {
  const [step, setStep] = useState(0);
  const t = translations[language];
  const steps = t.onboarding;

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-12 animate-bounce">
        {ONBOARDING_STEPS[step].icon}
      </div>
      <h2 className="text-3xl font-black mb-4 text-gray-900">{steps[step].title}</h2>
      <p className="text-gray-500 mb-12 max-w-xs font-medium leading-relaxed">{steps[step].desc}</p>
      
      <div className="flex gap-2 mb-12">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-10 bg-emerald-500' : 'w-2 bg-gray-200'}`} 
          />
        ))}
      </div>

      <button 
        onClick={next}
        className="w-full max-w-xs bg-emerald-500 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all"
      >
        {step === steps.length - 1 ? t.getStarted : t.next}
      </button>
      
      {step < steps.length - 1 && (
        <button 
          onClick={onComplete}
          className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-xs"
        >
          {t.skip}
        </button>
      )}
    </div>
  );
};

export default Onboarding;
