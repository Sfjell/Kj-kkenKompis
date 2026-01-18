
import React, { useState, useEffect } from 'react';
import { generateRecipeImage } from '../services/geminiService';

interface RecipeImageProps {
  prompt: string;
  alt: string;
  className?: string;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ prompt, alt, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchImage() {
      setLoading(true);
      setError(false);
      try {
        // Vi legger til ekstra detaljer i prompten her for å sikre mat-fokus
        const enhancedPrompt = `High-quality gourmet food photography of ${prompt}, appetizing, delicious, 4k, studio lighting`;
        const url = await generateRecipeImage(enhancedPrompt);
        if (mounted) {
          if (url) {
            setImageUrl(url);
          } else {
            setError(true);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to generate recipe image", error);
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    }
    fetchImage();
    return () => { mounted = false; };
  }, [prompt]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-50 flex flex-col items-center justify-center p-4 border-b border-gray-100`}>
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-[10px] font-black text-emerald-600/50 uppercase tracking-[0.2em] animate-pulse">Lager AI-bilde...</p>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`${className} bg-gray-100 flex flex-col items-center justify-center p-4`}>
        <i className="fa-solid fa-utensils text-3xl text-gray-300 mb-2"></i>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center px-4">Bilde kunne ikke genereres</span>
      </div>
    );
  }

  return (
    <div className={`${className} overflow-hidden group`}>
      <img 
        src={imageUrl} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default RecipeImage;
