
import React, { useState, useEffect } from 'react';
import { AppView, Recipe, UserFilters, ShoppingItem, User, Language } from './types';
import { translations } from './translations';
import Onboarding from './components/Onboarding';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Results from './components/Results';
import HistoryView from './components/HistoryView';
import FavoritesView from './components/FavoritesView';
import ShoppingView from './components/ShoppingView';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
import PrivacyPolicyView from './components/PrivacyPolicyView';
import SupportView from './components/SupportView';
import TermsView from './components/TermsView';
import PaywallView from './components/PaywallView';
import ScanningOverlay from './components/ScanningOverlay';
import { identifyIngredientsFromImage, generateRecipes } from './services/geminiService';
import { checkPaymentStatus, clearPaymentParams } from './services/stripeService';

const FREE_LIMIT = 5;

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('onboarding');
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('no');
  const [user, setUser] = useState<User | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [history, setHistory] = useState<{ date: string; image: string; ingredients: string[] }[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    cuisine: 'All',
    diet: [],
    allergies: [],
    nutritionEnabled: false,
    maxCalories: 800,
    minProtein: 20
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('kk_active_user');
    const hasSeenOnboarding = localStorage.getItem('kk_onboarding_seen');
    const savedLang = localStorage.getItem('kk_lang');

    if (savedLang) setLanguage(savedLang as Language);
    
    let activeUser: User | null = null;
    if (savedUser) {
      activeUser = JSON.parse(savedUser);
      setUser(activeUser);
      loadUserData(activeUser!.id);
      setView('home');
    } else {
      setView(hasSeenOnboarding ? 'login' : 'onboarding');
    }

    const paymentStatus = checkPaymentStatus();
    if (paymentStatus === 'success' && activeUser) {
      handleSubscribe();
      clearPaymentParams();
    }

    setIsLoading(false);
  }, []);

  const loadUserData = (userId: string) => {
    const prefix = `kk_data_${userId}_`;
    setFavorites(JSON.parse(localStorage.getItem(`${prefix}favorites`) || '[]'));
    setHistory(JSON.parse(localStorage.getItem(`${prefix}history`) || '[]'));
    setShoppingItems(JSON.parse(localStorage.getItem(`${prefix}shopping`) || '[]'));
    setUsageCount(parseInt(localStorage.getItem(`${prefix}usage`) || '0'));
  };

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('kk_lang', language);

    if (user) {
      localStorage.setItem('kk_active_user', JSON.stringify(user));
      const prefix = `kk_data_${user.id}_`;
      localStorage.setItem(`${prefix}favorites`, JSON.stringify(favorites));
      localStorage.setItem(`${prefix}history`, JSON.stringify(history));
      localStorage.setItem(`${prefix}shopping`, JSON.stringify(shoppingItems));
      localStorage.setItem(`${prefix}usage`, usageCount.toString());
    }
  }, [favorites, history, shoppingItems, user, usageCount, language, isLoading]);

  const handleLogin = (u: User) => {
    setUser(u);
    loadUserData(u.id);
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setFavorites([]);
    setHistory([]);
    setShoppingItems([]);
    setUsageCount(0);
    setView('login');
  };

  const handleSubscribe = () => {
    if (user) {
      setUser({ ...user, isPro: true });
    }
    setView('home');
  };

  const handleImageCapture = async (base64Image: string) => {
    if (!user) { setView('login'); return; }
    if (!user.isPro && usageCount >= FREE_LIMIT) { setView('paywall'); return; }

    setIsProcessing(true);
    setView('scanning');
    
    try {
      const ingredients = await identifyIngredientsFromImage(base64Image, language);
      
      if (ingredients.length === 0) {
        alert(language === 'no' ? "Beklager, jeg fant ingen matvarer i bildet. Prøv å ta et bilde med bedre lys eller nærmere varene." : "Sorry, I couldn't find any ingredients. Try a clearer photo with better lighting.");
        setView('home');
        return;
      }

      setDetectedIngredients(ingredients);
      setHistory(prev => [{
        date: new Date().toLocaleString(language === 'no' ? 'no-NO' : 'en-US'),
        image: base64Image,
        ingredients: ingredients
      }, ...prev]);

      const suggestedRecipes = await generateRecipes(ingredients, filters, language);
      
      if (suggestedRecipes.length === 0) {
        alert(translations[language].noRecipes);
        setView('home');
      } else {
        setRecipes(suggestedRecipes);
        setUsageCount(prev => prev + 1);
        setView('results');
      }
    } catch (error) {
      console.error("Capture handle error:", error);
      alert(language === 'no' ? "Noe gikk galt med AI-analysen. Prøv igjen!" : "Something went wrong. Please try again!");
      setView('home');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return null;

  const t = translations[language];
  const isAuthView = ['onboarding', 'login', 'paywall', 'scanning'].includes(view);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isAuthView && (
        <header className="sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b border-gray-100 safe-pt h-24 md:h-20 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex justify-between items-center">
            <button onClick={() => setView('home')} className="text-xl font-black text-emerald-600 flex items-center gap-2">
              <i className="fa-solid fa-cookie-bite"></i>
              <span>{t.appName}</span>
            </button>
            <button onClick={() => setView('profile')} className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold border-2 border-white shadow-sm overflow-hidden">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user text-sm"></i>}
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 ${isAuthView ? '' : 'max-w-6xl mx-auto px-4 md:px-8 w-full pb-24'}`}>
        {(() => {
          switch(view) {
            case 'onboarding': return <Onboarding onComplete={() => { localStorage.setItem('kk_onboarding_seen', 'true'); setView('login'); }} language={language} />;
            case 'login': return <LoginView onLogin={handleLogin} onBack={() => setView('onboarding')} onNavigate={setView} language={language} />;
            case 'paywall': return <PaywallView language={language} onSubscribe={handleSubscribe} onBack={() => setView('home')} userId={user?.id || ''} />;
            case 'home': return <Home onCapture={handleImageCapture} filters={filters} onFilterChange={setFilters} language={language} usageCount={usageCount} isPro={user?.isPro || false} />;
            case 'scanning': return <ScanningOverlay language={language} />;
            case 'results': return <Results recipes={recipes} ingredients={detectedIngredients} favorites={favorites} onToggleFavorite={(r) => setFavorites(prev => prev.some(f => f.id === r.id) ? prev.filter(f => f.id !== r.id) : [...prev, r])} onRetry={() => setView('home')} isProcessing={isProcessing} onAddToShopping={(items) => { setShoppingItems(prev => [...prev, ...items.map(text => ({ id: Math.random().toString(36).substr(2, 9), text, completed: false }))]); setView('shopping'); }} language={language} />;
            case 'favorites': return <FavoritesView favorites={favorites} onToggleFavorite={(r) => setFavorites(prev => prev.filter(f => f.id !== r.id))} onAddToShopping={(items) => { setShoppingItems(prev => [...prev, ...items.map(text => ({ id: Math.random().toString(36).substr(2, 9), text, completed: false }))]); setView('shopping'); }} language={language} />;
            case 'history': return <HistoryView history={history} language={language} />;
            case 'shopping': return <ShoppingView items={shoppingItems} onToggle={(id) => setShoppingItems(prev => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i))} onRemove={(id) => setShoppingItems(prev => prev.filter(i => i.id !== id))} onAdd={(text) => setShoppingItems(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), text, completed: false }])} language={language} />;
            case 'profile': return <ProfileView user={user} onLogout={handleLogout} onLoginClick={() => setView('login')} onNavigate={setView} historyCount={history.length} favoriteCount={favorites.length} language={language} onLanguageChange={setLanguage} isPro={user?.isPro || false} />;
            case 'privacy': return <PrivacyPolicyView onBack={() => setView('profile')} language={language} />;
            case 'terms': return <TermsView onBack={() => setView('profile')} language={language} />;
            case 'support': return <SupportView onBack={() => setView('profile')} language={language} />;
            default: return <Home onCapture={handleImageCapture} filters={filters} onFilterChange={setFilters} language={language} usageCount={usageCount} isPro={user?.isPro || false} />;
          }
        })()}
      </main>

      {!isAuthView && <Navigation currentView={view} setView={setView} language={language} />}
    </div>
  );
};

export default App;
