
import React from 'react';
import { User, AppView, Language } from '../types';
import { translations } from '../translations';

interface ProfileViewProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onNavigate: (view: AppView) => void;
  historyCount: number;
  favoriteCount: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isPro: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onLoginClick, onNavigate, historyCount, favoriteCount, language, onLanguageChange, isPro }) => {
  const t = translations[language];

  return (
    <div className="px-6 py-10">
      <div className="flex flex-col items-center mb-10">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-[40px] bg-emerald-100 border-4 border-emerald-50 overflow-hidden shadow-lg">
            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full flex items-center justify-center text-4xl text-emerald-600 font-black">{user ? user.name[0] : '?'}</div>}
          </div>
          {isPro && (
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl shadow-md flex items-center justify-center text-white border-2 border-white">
              <i className="fa-solid fa-crown text-xs"></i>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-black text-gray-900">{user?.name || "Guest User"}</h2>
        <div className="mt-2 flex gap-2">
           <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${isPro ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
             {isPro ? t.proStatus : t.freeStatus}
           </span>
        </div>
      </div>

      {!isPro && (
        <button 
          onClick={() => onNavigate('paywall')}
          className="w-full mb-8 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-3xl flex items-center justify-between shadow-xl shadow-emerald-100 active:scale-95 transition-all"
        >
          <div className="text-left">
            <span className="block font-black text-lg">{t.upgrade}</span>
            <span className="text-sm text-emerald-100 font-medium">Unlock everything for 100kr</span>
          </div>
          <i className="fa-solid fa-chevron-right opacity-50"></i>
        </button>
      )}

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 rounded-3xl p-6 text-center border border-gray-100">
          <span className="block text-3xl font-black text-gray-900 mb-1">{favoriteCount}</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.favorites}</span>
        </div>
        <div className="bg-gray-50 rounded-3xl p-6 text-center border border-gray-100">
          <span className="block text-3xl font-black text-gray-900 mb-1">{historyCount}</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scans</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Settings</h3>
        
        <div className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><i className="fa-solid fa-language"></i></div>
            <span className="font-bold text-gray-800">{t.language}</span>
          </div>
          <select 
            value={language} 
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-transparent font-bold text-emerald-500 outline-none border-none p-0 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="no">Norsk</option>
          </select>
        </div>

        <button onClick={() => onNavigate('support')} className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center"><i className="fa-solid fa-circle-question"></i></div>
            <span className="font-bold text-gray-800">Support</span>
          </div>
          <i className="fa-solid fa-chevron-right text-gray-300"></i>
        </button>

        {user ? (
          <button onClick={onLogout} className="w-full flex items-center gap-4 p-5 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors mt-6">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><i className="fa-solid fa-right-from-bracket"></i></div>
            <span>{t.logout}</span>
          </button>
        ) : (
          <button onClick={onLoginClick} className="w-full flex items-center gap-4 p-5 text-emerald-500 font-bold hover:bg-emerald-50 rounded-2xl transition-colors mt-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><i className="fa-solid fa-right-from-bracket"></i></div>
            <span>{t.login}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
