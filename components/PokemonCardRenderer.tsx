"use client";

import React from "react";
import { useLowSpec } from "@contexts/LowSpecContext"; // Hook pour le mode d'affichage.
import { PokemonData } from "@lib/definitions"; // Interface des données Pokémon.
import HoloPokemonCard from "./HoloPokemonCard"; // Carte avec effets.
import SimplePokemonCard from "./SimplePokemonCard"; // Carte simplifiée.

// L'interface PokemonRenderer n'est plus nécessaire car on utilise PokemonData directement.
/*
interface PokemonRenderer { ... }
*/

interface PokemonCardRendererProps {
  pokemon: PokemonData; // Les données complètes du Pokémon à afficher.
}

// Ce composant choisit quelle version de la carte Pokémon afficher
// en fonction de l'état du mode "LowSpec".
const PokemonCardRenderer: React.FC<PokemonCardRendererProps> = ({
  pokemon,
}) => {
  const { isLowSpec } = useLowSpec(); // Récupère l'état actuel du mode LowSpec.

  // Si le mode LowSpec est activé, on affiche la carte simple.
  if (isLowSpec) {
    return <SimplePokemonCard pokemon={pokemon} />;
  }

  // Sinon, on affiche la carte avec les effets holographiques.
  return <HoloPokemonCard pokemon={pokemon} />;
};

export default PokemonCardRenderer;
