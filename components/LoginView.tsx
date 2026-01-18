
import React, { useState } from 'react';
import { User, Language, AppView } from '../types';
import { translations } from '../translations';

interface LoginViewProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  onNavigate: (view: AppView) => void;
  language: Language;
}

interface StoredAccount extends User {
  password?: string;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack, onNavigate, language }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const t = translations[language];

  const getAccounts = (): StoredAccount[] => {
    const data = localStorage.getItem('kk_accounts');
    return data ? JSON.parse(data) : [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const accounts = getAccounts();
    const cleanEmail = email.toLowerCase().trim();

    if (isRegistering) {
      if (!agreedTerms || !agreedPrivacy) {
        setError(t.mustAccept);
        return;
      }

      if (accounts.some(acc => acc.email === cleanEmail)) {
        setError(language === 'no' ? 'Denne e-posten er allerede registrert.' : 'Email already registered.');
        return;
      }

      const newUser: StoredAccount = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: password,
        isLoggedIn: true,
        isPro: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`
      };

      localStorage.setItem('kk_accounts', JSON.stringify([...accounts, newUser]));
      setSuccess(language === 'no' ? 'Konto opprettet!' : 'Account created!');
      setTimeout(() => onLogin(newUser), 1000);
    } else {
      const user = accounts.find(acc => acc.email === cleanEmail && acc.password === password);
      if (user) {
        onLogin(user);
      } else {
        const emailExists = accounts.some(acc => acc.email === cleanEmail);
        setError(emailExists 
          ? (language === 'no' ? 'Feil passord.' : 'Incorrect password.')
          : (language === 'no' ? 'Fant ingen bruker med denne e-posten.' : 'No user found with this email.'));
      }
    }
  };

  return (
    <div className="px-8 py-12 flex flex-col min-h-full bg-white max-w-md mx-auto animate-fade-in">
      <div className="mb-10 text-center pt-8">
        <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-inner">
          <i className="fa-solid fa-cookie-bite text-3xl"></i>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          {isRegistering ? t.registerTitle : t.loginTitle}
        </h2>
        <p className="text-gray-500 font-medium text-sm">{t.loginDesc}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistering && (
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              {language === 'no' ? 'Fullt Navn' : 'Full Name'}
            </label>
            <input 
              type="text" required
              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-gray-800"
              placeholder="Ola Nordmann"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
          <input 
            type="email" required
            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-gray-800"
            placeholder="din@epost.no"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            {language === 'no' ? 'Passord' : 'Password'}
          </label>
          <input 
            type={showPassword ? "text" : "password"} required
            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-gray-800"
            placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 bottom-4 text-gray-300 hover:text-emerald-500"
          >
            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>

        {isRegistering && (
          <div className="py-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="hidden" checked={agreedTerms} onChange={() => setAgreedTerms(!agreedTerms)} />
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${agreedTerms ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200 group-hover:border-emerald-200'}`}>
                {agreedTerms && <i className="fa-solid fa-check text-white text-[10px]"></i>}
              </div>
              <span className="text-xs font-bold text-gray-500">{t.acceptTerms}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="hidden" checked={agreedPrivacy} onChange={() => setAgreedPrivacy(!agreedPrivacy)} />
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${agreedPrivacy ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200 group-hover:border-emerald-200'}`}>
                {agreedPrivacy && <i className="fa-solid fa-check text-white text-[10px]"></i>}
              </div>
              <span className="text-xs font-bold text-gray-500">{t.acceptPrivacy}</span>
            </label>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold text-center border border-red-100 animate-shake">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
            {!isRegistering && error.includes('Fant ingen bruker') && (
              <button type="button" onClick={() => setIsRegistering(true)} className="block mt-2 mx-auto text-emerald-600 underline">
                {language === 'no' ? 'Lag konto her' : 'Create account here'}
              </button>
            )}
          </div>
        )}

        <button 
          type="submit"
          className="w-full bg-emerald-500 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all mt-4"
        >
          {isRegistering ? t.registerTitle : t.loginTitle}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          className="font-black text-emerald-600 uppercase tracking-widest text-xs hover:opacity-70"
        >
          {isRegistering 
            ? (language === 'no' ? 'Logg inn isteden' : 'Login instead')
            : (language === 'no' ? 'Ny her? Opprett konto' : 'New here? Join us')}
        </button>
      </div>
      
      <div className="mt-auto pt-10 text-center text-[9px] text-gray-300 uppercase tracking-widest font-black">
        KitchenBuddy v1.2 Build Final
      </div>
    </div>
  );
};

export default LoginView;
