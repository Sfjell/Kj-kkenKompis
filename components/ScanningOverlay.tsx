
import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface ScanningOverlayProps {
  language: Language;
}

const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ language }) => {
  const [dots, setDots] = useState('');
  const t = translations[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const messages = [
    t.analyzing,
    t.recognizing,
    t.suggesting,
    t.checking,
    t.planning
  ];
  
  const [messageIdx, setMessageIdx] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIdx(prev => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[70vh] text-center">
      <div className="relative w-64 h-64 mb-12">
        <div className="absolute inset-0 border-4 border-emerald-500 rounded-[48px] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-scan"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fa-solid fa-microchip text-6xl text-emerald-500 opacity-20"></i>
        </div>
      </div>

      <h3 className="text-2xl font-black text-gray-800 mb-2">{messages[messageIdx]}{dots}</h3>
      <p className="text-gray-500 font-bold">{t.aiWorking}</p>
      
      <div className="mt-12 w-full max-w-xs bg-gray-100 h-2 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 animate-loading-bar"></div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 1; }
          50% { top: 100%; opacity: 1; }
          100% { top: 0; opacity: 1; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 10s linear;
        }
      `}</style>
    </div>
  );
};

export default ScanningOverlay;
