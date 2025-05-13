'use client';

import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress'; // Assurez-vous que ce composant est installé

interface StatGaugeProps {
  label: string;
  value: number;
  maxValue?: number; // Optionnel, défaut à 255
  color: string; // Code hexadécimal avec #
}

const StatGauge: React.FC<StatGaugeProps> = ({ label, value, maxValue = 255, color }) => {
  const [progress, setProgress] = useState(0);

  // Animation au montage du composant
  useEffect(() => {
    // Simuler une animation de remplissage
    const timer = setTimeout(() => {
      const calculatedProgress = (value / maxValue) * 100;
      setProgress(calculatedProgress > 100 ? 100 : calculatedProgress); // Limite à 100%
    }, 100); // Petit délai pour que l'animation soit visible

    return () => clearTimeout(timer);
  }, [value, maxValue]); // Déclenche l'animation si value ou maxValue changent

  // Détermine la couleur de la barre en utilisant des styles inline et la prop color
  const progressBarStyle = {
    width: `${progress}%`,
    backgroundColor: color,
    transition: 'width 1s ease-out', // Animation de 1 seconde
  };

  return (
    <div className="flex items-center gap-3 mb-2 last:mb-0">
      <div className="w-24 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </div>
      <div className="flex-grow">
        {/* Le composant Progress de shadcn/ui */}
        <Progress value={progress} className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
            {/* La barre de progression réelle est gérée par le composant Progress interne,
                 mais on peut styliser la barre intérieure si shadcn/ui le permet.
                 Ici, on utilise le style inline pour override la couleur si besoin.
                 Note: Shadcn/ui applique la couleur via CSS variables ou classes,
                 le style inline direct peut parfois être moins intégré.
                 On va tenter de passer la couleur via une variable CSS ou une classe Tailwind dynamique si possible,
                 mais le style inline direct est une solution simple.
            */}
             {/* Voici comment shadcn/ui gère la couleur, on va adapter : */}
             <div
               style={{
                width: `${progress}%`,
                backgroundColor: color, // Applique la couleur via style inline
                transition: 'width 1s ease-out',
               }}
               className="h-full" // Assurez-vous que cela prend toute la hauteur
             ></div>
        </Progress>
      </div>
      <div className="w-10 text-left text-sm text-slate-600 dark:text-slate-400 font-roboto-mono">
        {value}
      </div>
    </div>
  );
};

export default StatGauge;