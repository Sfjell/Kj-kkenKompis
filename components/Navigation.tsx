
import React from 'react';
import { AppView, Language } from '../types';
import { translations } from '../translations';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  language: Language;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, language }) => {
  const t = translations[language];
  const tabs: { view: AppView; icon: string; label: string }[] = [
    { view: 'home', icon: 'fa-solid fa-magnifying-glass', label: t.explore },
    { view: 'shopping', icon: 'fa-solid fa-cart-shopping', label: t.shopping },
    { view: 'favorites', icon: 'fa-solid fa-heart', label: t.favorites },
    { view: 'profile', icon: 'fa-solid fa-user', label: t.profile },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center md:justify-around">
        {tabs.map(tab => {
          const isActive = currentView === tab.view || (tab.view === 'home' && (currentView === 'results' || currentView === 'scanning'));
          return (
            <button 
              key={tab.view}
              onClick={() => setView(tab.view)}
              className={`flex flex-col items-center gap-1.5 transition-all relative group ${isActive ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`}
            >
              {isActive && (
                <div className="hidden md:block w-8 h-1 bg-emerald-500 absolute -top-4 rounded-b-full"></div>
              )}
              <div className={`w-12 h-10 flex items-center justify-center rounded-2xl transition-all ${isActive ? 'bg-emerald-50 md:bg-transparent' : 'group-hover:bg-gray-50'}`}>
                <i className={`${tab.icon} text-xl md:text-2xl`}></i>
              </div>
              <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
