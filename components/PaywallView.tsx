
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { initiateStripeCheckout } from '../services/stripeService';

interface PaywallViewProps {
  language: Language;
  onSubscribe: () => void;
  onBack: () => void;
  userId: string;
}

const PaywallView: React.FC<PaywallViewProps> = ({ language, onSubscribe, onBack, userId }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const t = translations[language];

  const handleStripePayment = async () => {
    setIsRedirecting(true);
    // Vi kaller Stripe-tjenesten
    await initiateStripeCheckout(userId);
    
    // Siden dette er en demo/sandbox, simulerer vi suksess her hvis omdirigering er deaktivert
    // I prod vil brukeren forlate siden her.
    onSubscribe();
    setIsRedirecting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center animate-fade-in overflow-y-auto">
      <button 
        onClick={onBack}
        className="absolute top-10 left-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <i className="fa-solid fa-xmark text-2xl"></i>
      </button>

      <div className="mb-8 w-24 h-24 bg-emerald-100 rounded-[40px] flex items-center justify-center text-emerald-600 text-4xl shadow-inner relative">
        <i className="fa-solid fa-crown animate-pulse"></i>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-sm">
          <i className="fa-solid fa-star"></i>
        </div>
      </div>
      
      <h2 className="text-3xl font-black text-gray-900 mb-4">{t.paywallTitle}</h2>
      <p className="text-gray-500 mb-10 max-w-xs mx-auto leading-relaxed font-medium">
        {t.paywallDesc}
      </p>

      <div className="w-full max-w-xs bg-emerald-50 rounded-[40px] p-8 border-2 border-emerald-100 mb-8 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-widest">PRO</div>
        <span className="block text-4xl font-black text-emerald-600 mb-2">{t.paywallPrice}</span>
        <span className="text-emerald-800/60 font-black text-[10px] uppercase tracking-widest">Alt inkludert • Ingen binding</span>
      </div>

      <div className="space-y-4 w-full max-w-xs">
        <button 
          onClick={handleStripePayment}
          disabled={isRedirecting}
          className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isRedirecting ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>{t.paywallButton}</>
          )}
        </button>
        
        <div className="flex items-center justify-center gap-4 pt-2">
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sikker betaling med</span>
          <div className="flex gap-3 text-gray-300 text-lg">
            <i className="fa-brands fa-stripe"></i>
            <i className="fa-brands fa-cc-visa"></i>
            <i className="fa-brands fa-cc-mastercard"></i>
            <i className="fa-brands fa-apple-pay"></i>
          </div>
        </div>
      </div>

      <p className="mt-10 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        {t.cancelAnytime}
      </p>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default PaywallView;
