"use client";

import React from "react";
Based on the requested edit, I'll rewrite the import section and update the interface to use `PokemonData` from the central definitions file.

```tsx
"use client";

import React from "react";
import { useLowSpec } from "@/contexts/LowSpecContext"; // Import correct du contexte
import { PokemonData } from '@/lib/definitions'; // Import de l'interface centrale
import HoloPokemonCard from "./HoloPokemonCard"; // Import relatif
import SimplePokemonCard from "./SimplePokemonCard"; // Import relatif (nom corrigé)

// Interface pour les props du composant PokemonCardRenderer
// Reprise de l'interface PokemonRenderer de docs/pokemonCardComponents.tsx
// Assurez-vous qu'elle est compatible avec PokemonData de lib/definitions.ts
interface PokemonRenderer {
  numero: number;
  nom: string;
  types: { name: string; color: string }[];
  // Si HoloPokemonCard ou SimplePokemonCard ont besoin de plus de props, ajoutez-les ici
  // Exemple : pv, attaque, etc. si affichés sur la carte simple
  pv?: number;
  attaque?: number;
  defense?: number;
  attaque_spe?: number;
  defense_spe?: number;
  vitesse?: number;
}

interface PokemonCardRendererProps {
  pokemon: PokemonRenderer;
}

const PokemonCardRenderer: React.FC<PokemonCardRendererProps> = ({
  pokemon,
}) => {
  const { isLowSpec } = useLowSpec();

  if (isLowSpec) {
    // Passe les props nécessaires à SimplePokemonCard
    // S'il a besoin des stats, assurez-vous de les passer ici.
    return <SimplePokemonCard pokemon={pokemon} />;
  }

  // Passe les props nécessaires à HoloPokemonCard
  // S'il a besoin des stats, assurez-vous de les passer ici.
  return <HoloPokemonCard pokemon={pokemon} />;
};

export default PokemonCardRenderer;
