
import React from 'react';

export const CUISINES = [
  'All', 'Italian', 'Asian', 'Nordic', 'Mexican', 'Indian', 'French'
];

export const DIET_OPTIONS = [
  { id: 'vegetarian' },
  { id: 'vegan' },
  { id: 'halal' },
  { id: 'lowcarb' },
  { id: 'highprotein' }
];

export const ALLERGY_OPTIONS = [
  { id: 'nuts' },
  { id: 'gluten' },
  { id: 'lactose' },
  { id: 'soy' },
  { id: 'egg' },
  { id: 'shellfish' }
];

export const ONBOARDING_STEPS = [
  {
    title: 'Scan your kitchen',
    description: 'Take a photo of your fridge or pantry. Our AI recognizes ingredients automatically.',
    icon: <i className="fa-solid fa-camera-retro text-5xl text-emerald-500"></i>
  },
  {
    title: 'Get smart suggestions',
    description: 'We suggest delicious recipes based on what you already have at home.',
    icon: <i className="fa-solid fa-utensils text-5xl text-emerald-500"></i>
  },
  {
    title: 'Save time and planet',
    description: 'Use what you have, reduce food waste and save money on unnecessary purchases.',
    icon: <i className="fa-solid fa-leaf text-5xl text-emerald-500"></i>
  }
];
