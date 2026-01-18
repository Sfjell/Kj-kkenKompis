
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

  useEffect(() => {
    let mounted = true;
    async function fetchImage() {
      try {
        const url = await generateRecipeImage(prompt);
        if (mounted) {
          setImageUrl(url);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to generate recipe image", error);
        if (mounted) setLoading(false);
      }
    }
    fetchImage();
    return () => { mounted = false; };
  }, [prompt]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-2">
           <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Genererer AI bilde...</span>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <img 
        src={`https://picsum.photos/seed/${prompt}/800/600`} 
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <img src={imageUrl} alt={alt} className={className} />
  );
};

export default RecipeImage;
