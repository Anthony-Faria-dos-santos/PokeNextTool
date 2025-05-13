// components/HoloPokemonCard.tsx
'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
// Vous utiliserez probablement votre propre composant TypeBadge ou des styles directs ici
// import { Badge } from '@/components/ui/badge'; 

// Interface pour les props du composant PokemonCard
interface Pokemon {
  numero: number;
  nom: string;
  types: { name: string; color: string }[];
  // Ajoutez d'autres champs si nécessaire
}

interface HoloPokemonCardProps {
  pokemon: Pokemon;
}

const HoloPokemonCard: React.FC<HoloPokemonCardProps> = ({ pokemon }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const cardWidth = 240; 
  const cardHeight = 336; 

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mouseX = (x / rect.width - 0.5) * 2; 
    const mouseY = (y / rect.height - 0.5) * -2; 

    const rotateY = mouseX * 15; 
    const rotateX = mouseY * 15; 

    const glareX = x / rect.width * 100; 
    const glareY = y / rect.height * 100;

    cardRef.current.style.setProperty('--mx', `${glareX}%`);
    cardRef.current.style.setProperty('--my', `${glareY}%`);
    cardRef.current.style.setProperty('--rx', `${rotateX}deg`);
    cardRef.current.style.setProperty('--ry', `${rotateY}deg`);
    cardRef.current.style.setProperty('--posx', `${glareX}%`);
    cardRef.current.style.setProperty('--posy', `${glareY}%`);

    const hyp = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    cardRef.current.style.setProperty('--hyp', `${hyp}`);
  }, []);

  const onMouseEnter = () => {
    setIsInteracting(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--o', '1'); 
    }
  };

  const onMouseLeave = () => {
    setIsInteracting(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--rx', '0deg');
      cardRef.current.style.setProperty('--ry', '0deg');
      cardRef.current.style.setProperty('--mx', '50%');
      cardRef.current.style.setProperty('--my', '50%');
      cardRef.current.style.setProperty('--posx', `50%`);
      cardRef.current.style.setProperty('--posy', `50%`);
      cardRef.current.style.setProperty('--o', '0');
      cardRef.current.style.setProperty('--hyp', '0');
    }
  };

  useEffect(() => {
    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.addEventListener('mousemove', onMouseMove);
      cardElement.addEventListener('mouseenter', onMouseEnter);
      cardElement.addEventListener('mouseleave', onMouseLeave);

      cardElement.style.setProperty('--mx', '50%');
      cardElement.style.setProperty('--my', '50%');
      cardElement.style.setProperty('--rx', '0deg');
      cardElement.style.setProperty('--ry', '0deg');
      cardElement.style.setProperty('--posx', `50%`);
      cardElement.style.setProperty('--posy', `50%`);
      cardElement.style.setProperty('--o', '0');
      cardElement.style.setProperty('--s', '1'); 
      cardElement.style.setProperty('--hyp', '0');

      cardElement.style.setProperty('--red', '#f80e7b');
      cardElement.style.setProperty('--yel', '#eedf10');
      cardElement.style.setProperty('--gre', '#21e985');
      cardElement.style.setProperty('--blu', '#0dbde9');
      cardElement.style.setProperty('--vio', '#c929f1');
      // Définir une couleur de "glow" par défaut ou basée sur le type principal du Pokémon
      const primaryTypeColor = pokemon.types[0]?.color ? `#${pokemon.types[0].color}` : '#69d1e9';
      cardElement.style.setProperty('--glow', primaryTypeColor);

    }

    return () => {
      if (cardElement) {
        cardElement.removeEventListener('mousemove', onMouseMove);
        cardElement.removeEventListener('mouseenter', onMouseEnter);
        cardElement.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [onMouseMove, pokemon.types]);

  const imagePath = `/images/pokemon/${pokemon.numero}.png`;
  const placeholderImage = '/images/pokeball_placeholder.gif';

  return (
    <>
      <style jsx global>{`
        /* Styles pour HoloPokemonCard. Pour une meilleure organisation, 
           ce CSS devrait être dans un fichier .css séparé. */

        .holo-card-container-wrapper { /* Nouveau wrapper pour la perspective et le padding */
          padding: 0.5rem; /* Espace autour de la carte */
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .holo-card-perspective-container { /* Gère la perspective */
          perspective: 1000px;
        }
        
        .holo-card-element {
          width: ${cardWidth}px;
          height: ${cardHeight}px;
          border-radius: 15px;
          transform-style: preserve-3d;
          will-change: transform;
          transition: transform 0.05s ease-out, box-shadow 0.2s ease-out; /* Transition plus rapide pour la réactivité */
          position: relative;
          overflow: hidden; 
          box-shadow: 0px 8px 16px -4px rgba(0,0,0,0.3);
          transform: rotateY(var(--ry)) rotateX(var(--rx)) scale(var(--s));
          background-color: #2d3748; /* Fond Gris Anthracite de la charte */
        }

        .holo-card-element.interacting {
          box-shadow: 0px 15px 30px -5px rgba(0,0,0,0.5), 
                      0 0 12px 2px var(--glow), 
                      0 0 24px 4px var(--glow, #69d1e980); /* Utilisation de la variable --glow */
        }
        
        .holo-card-content {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          display: flex;
          flex-direction: column;
          justify-content: flex-start; 
          align-items: center;
          border-radius: inherit;
        }

        .holo-card-image-container {
          width: 100%;
          height: 70%; 
          position: relative;
          overflow: hidden;
           border-top-left-radius: inherit;
           border-top-right-radius: inherit;
           background-color: #4a5568; /* Fond pour l'image si elle est transparente ou plus petite */
        }
        
        .holo-card-image-container img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain; /* 'contain' pour voir tout le Pokémon */
            border-top-left-radius: inherit;
            border-top-right-radius: inherit;
            transform: translateZ(20px); /* Léger effet 3D pour l'image elle-même */
        }

        .holo-card-shine-overlay, .holo-card-glare-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%; 
          border-radius: inherit; 
          pointer-events: none; 
          z-index: 1;
          opacity: var(--o); 
          transition: opacity 0.2s ease-out;
          transform: translateZ(10px); /* Positionner les effets au-dessus de l'image */
        }

        .holo-card-shine-overlay {
          --space: 2px;
          --h: 21;
          --s-hsl: 70%; 
          --l-hsl: 50%; 
          
          clip-path: inset(0); 

          background-image: 
            repeating-linear-gradient(
              90deg,
              hsl(calc(var(--h) * 0), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 0), hsl(calc(var(--h) * 0), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 1),
              transparent calc(var(--space) * 1.001), transparent calc(var(--space) * 1.999), /* transparent au lieu de black */
              hsl(calc(var(--h) * 1), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 2), hsl(calc(var(--h) * 1), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 3),
              transparent calc(var(--space) * 3.001), transparent calc(var(--space) * 3.999),
              hsl(calc(var(--h) * 2), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 4), hsl(calc(var(--h) * 2), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 5),
              transparent calc(var(--space) * 5.001), transparent calc(var(--space) * 5.999),
              hsl(calc(var(--h) * 3), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 6), hsl(calc(var(--h) * 3), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 7),
              transparent calc(var(--space) * 7.001), transparent calc(var(--space) * 7.999),
              hsl(calc(var(--h) * 4), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 8), hsl(calc(var(--h) * 4), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 9),
              transparent calc(var(--space) * 9.001), transparent calc(var(--space) * 9.999),
              hsl(calc(var(--h) * 5), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 10), hsl(calc(var(--h) * 5), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 11),
              transparent calc(var(--space) * 11.001), transparent calc(var(--space) * 11.999),
              hsl(calc(var(--h) * 6), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 12), hsl(calc(var(--h) * 6), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 13),
              transparent calc(var(--space) * 13.001), transparent calc(var(--space) * 13.999),
              hsl(calc(var(--h) * 7), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 14), hsl(calc(var(--h) * 7), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 15),
              transparent calc(var(--space) * 15.001), transparent calc(var(--space) * 15.999),
              hsl(calc(var(--h) * 8), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 16), hsl(calc(var(--h) * 8), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 17),
              transparent calc(var(--space) * 17.001), transparent calc(var(--space) * 17.999),
              hsl(calc(var(--h) * 9), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 18), hsl(calc(var(--h) * 9), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 19),
              transparent calc(var(--space) * 19.001), transparent calc(var(--space) * 19.999),
              hsl(calc(var(--h) * 10), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 20), hsl(calc(var(--h) * 10), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 21),
              transparent calc(var(--space) * 21.001), transparent calc(var(--space) * 21.999),
              hsl(calc(var(--h) * 11), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 22), hsl(calc(var(--h) * 11), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 23),
              transparent calc(var(--space) * 23.001), transparent calc(var(--space) * 23.999),
              hsl(calc(var(--h) * 12), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 24), hsl(calc(var(--h) * 12), var(--s-hsl), var(--l-hsl)) calc(var(--space) * 25)
            ),
            radial-gradient(
              farthest-corner circle at var(--mx) var(--my),
              rgba(255, 255, 255, 0.8) 0%, /* Blanc plus prononcé */
              rgba(255, 255, 255, 0.3) 30%, /* Diffusion plus large */
              rgba(0,0,0,0.3) 90% /* Moins de noir opaque */
            );
          background-blend-mode: overlay, overlay; 
          background-position: center, var(--posx) var(--posy); 
          background-size: 100% 100%, 220% 220%; /* Augmenté pour un effet plus large */
          filter: brightness(calc((var(--hyp) + 0.8) * 0.8)) contrast(1.8) saturate(1.2); /* Ajusté pour plus de vivacité */
          mix-blend-mode: color-dodge; 
        }

        .holo-card-glare-overlay {
          background-image: radial-gradient(
            farthest-corner circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.5) 5%, 
            rgba(255, 255, 255, 0.2) 20%, 
            rgba(0, 0, 0, 0.6) 130% 
          );
          mix-blend-mode: overlay; 
          opacity: calc(var(--o) * (var(--hyp) + 0.2)); 
        }
        
        .holo-card-info {
          padding: 0.75rem; 
          text-align: center;
          width: 100%;
          background-color: rgba(23, 37, 64, 0.85); /* Bleu Nuit Profond semi-transparent */
          border-bottom-left-radius: inherit;
          border-bottom-right-radius: inherit;
          color: #F7FAFC; /* Gris Perle pour le texte sur fond sombre */
          margin-top: auto; 
          z-index: 2; 
          position: relative; 
          transform: translateZ(5px); /* Léger décalage pour les infos */
        }

        .holo-pokemon-name {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 1.1rem; /* Un peu plus petit pour s'adapter */
          margin-bottom: 0.1rem; 
          color: #EDF2F7; /* Blanc cassé */
        }

        .holo-pokemon-number {
          font-family: 'Roboto Mono', monospace;
          font-size: 0.8rem; 
          color: #A0AEC0; /* Gris plus clair pour contraste */
          margin-bottom: 0.3rem; 
        }
        
        .holo-pokemon-types {
          display: flex;
          justify-content: center;
          gap: 0.4rem; 
        }
        .holo-pokemon-types .type-badge-custom { /* Assurez-vous que cette classe est unique ou préfixée */
          padding: 0.2rem 0.6rem; 
          border-radius: 9999px; 
          font-size: 0.7rem; 
          font-weight: 500;
          color: white; 
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.2);
        }
      `}</style>

      <div className="holo-card-container-wrapper">
        <div className="holo-card-perspective-container">
          <div
            ref={cardRef}
            className={`holo-card-element ${isInteracting ? 'interacting' : ''}`}
          >
            <div className="holo-card-content">
              <div className="holo-card-image-container">
                <Image
                  src={imagePath}
                  alt={pokemon.nom}
                  width={cardWidth} 
                  height={Math.floor(cardHeight * 0.7)} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = placeholderImage;
                   }}
                  priority={pokemon.numero <= 12}
                />
                <div className="holo-card-shine-overlay"></div>
                <div className="holo-card-glare-overlay"></div>
              </div>

              <div className="holo-card-info">
                <h3 className="holo-pokemon-name">{pokemon.nom}</h3>
                <p className="holo-pokemon-number">#{String(pokemon.numero).padStart(3, '0')}</p>
                <div className="holo-pokemon-types">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.name}
                      className="type-badge-custom" 
                      style={{ backgroundColor: `#${type.color}` }}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HoloPokemonCard;

// ---------------------------------------------------------------------------------
// contexts/LowSpecContext.tsx
// (Le code de LowSpecContext.tsx est identique à celui fourni dans l'artefact "low-spec-components")
// ---------------------------------------------------------------------------------
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LowSpecContextType {
  isLowSpec: boolean;
  toggleLowSpec: () => void;
}

const LowSpecContext = createContext<LowSpecContextType | undefined>(undefined);

export const LowSpecProvider = ({ children }: { children: ReactNode }) => {
  const [isLowSpec, setIsLowSpec] = useState(false);

  const toggleLowSpec = () => {
    setIsLowSpec(prev => !prev);
  };

  return (
    <LowSpecContext.Provider value={{ isLowSpec, toggleLowSpec }}>
      {children}
    </LowSpecContext.Provider>
  );
};

export const useLowSpec = (): LowSpecContextType => {
  const context = useContext(LowSpecContext);
  if (context === undefined) {
    throw new Error('useLowSpec must be used within a LowSpecProvider');
  }
  return context;
};


// ---------------------------------------------------------------------------------
// components/SimplePokemonCard.tsx
// (Le code de SimplePokemonCard.tsx est identique à celui fourni dans l'artefact "low-spec-components")
// ---------------------------------------------------------------------------------
'use client';

import React from 'react';
import Image from 'next/image';
// Assurez-vous que le chemin vers Badge est correct si vous l'utilisez
// import { Badge } from '@/components/ui/badge'; 

// Interface pour les props du composant PokemonCard (identique à HoloPokemonCard)
interface PokemonSimple { // Renommé pour éviter conflit si ce fichier est parsé globalement
  numero: number;
  nom: string;
  types: { name: string; color: string }[];
}

interface SimplePokemonCardProps {
  pokemon: PokemonSimple; // Utilise l'interface renommée
}

const SimplePokemonCard: React.FC<SimplePokemonCardProps> = ({ pokemon }) => {
  const imagePath = `/images/pokemon/${pokemon.numero}.png`;
  const placeholderImage = '/images/pokeball_placeholder.gif';

  const cardWidth = 240;
  const cardHeight = 336;

  return (
    <div 
      className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col overflow-hidden group"
      style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
    >
      <div className="w-full h-[70%] relative bg-slate-200 dark:bg-slate-700/50 overflow-hidden">
        <Image
          src={imagePath}
          alt={pokemon.nom}
          fill 
          style={{ objectFit: 'contain' }} 
          className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage;
          }}
          priority={pokemon.numero <= 12} 
          sizes={`(max-width: 768px) 100vw, ${cardWidth}px`} 
        />
      </div>
      <div className="p-3 text-center flex-grow flex flex-col justify-around bg-white dark:bg-slate-800">
        <div>
          <h3 className="font-poppins font-semibold text-base text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {pokemon.nom}
          </h3>
          <p className="font-roboto-mono text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            #{String(pokemon.numero).padStart(3, '0')}
          </p>
        </div>
        <div className="flex justify-center items-center gap-1.5">
          {pokemon.types.map((type) => (
            <span
              key={type.name}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: `#${type.color}`, textShadow: '1px 1px 1px rgba(0,0,0,0.2)' }}
            >
              {type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimplePokemonCard;

// ---------------------------------------------------------------------------------
// components/LowSpecToggle.tsx
// (Le code de LowSpecToggle.tsx est identique à celui fourni dans l'artefact "low-spec-components")
// ---------------------------------------------------------------------------------
'use client';

import React from 'react';
import { useLowSpec } from '../contexts/LowSpecContext'; 
import { Switch } from '@/components/ui/switch'; 
import { Label } from '@/components/ui/label';   
import { MonitorSmartphone, Sparkles } from 'lucide-react'; // Ajout d'icônes

const LowSpecToggle: React.FC = () => {
  const { isLowSpec, toggleLowSpec } = useLowSpec();

  return (
    <div className="fixed bottom-5 right-5 bg-white dark:bg-slate-900 p-3 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 z-50 flex items-center space-x-3 transition-all hover:shadow-blue-500/30 dark:hover:shadow-blue-400/30">
      <Label htmlFor="low-spec-mode" className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-2">
        {isLowSpec ? (
            <MonitorSmartphone size={18} className="text-green-500"/>
        ) : (
            <Sparkles size={18} className="text-yellow-500" />
        )}
        <span>{isLowSpec ? 'Mode Éco' : 'Mode Holo'}</span>
      </Label>
      <Switch
        id="low-spec-mode"
        checked={!isLowSpec} // Inversé pour que "on" soit le mode Holo
        onCheckedChange={toggleLowSpec}
        aria-label="Changer de mode d'affichage"
        className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-green-500"
      />
    </div>
  );
};

export default LowSpecToggle;


// ---------------------------------------------------------------------------------
// components/PokemonCardRenderer.tsx
// (Le code de PokemonCardRenderer.tsx est identique à celui fourni dans l'artefact "low-spec-components")
// ---------------------------------------------------------------------------------
'use client';

import React from 'react';
import { useLowSpec } from '../contexts/LowSpecContext'; 
import HoloPokemonCard from './HoloPokemonCard';         
import SimplePokemonCard from './SimplePokemonCard';     

interface PokemonRenderer { // Renommé pour éviter conflit
  numero: number;
  nom: string;
  types: { name: string; color: string }[];
}

interface PokemonCardRendererProps {
  pokemon: PokemonRenderer; // Utilise l'interface renommée
}

const PokemonCardRenderer: React.FC<PokemonCardRendererProps> = ({ pokemon }) => {
  const { isLowSpec } = useLowSpec();

  if (isLowSpec) {
    return <SimplePokemonCard pokemon={pokemon} />;
  }

  return <HoloPokemonCard pokemon={pokemon} />;
};

export default PokemonCardRenderer;

