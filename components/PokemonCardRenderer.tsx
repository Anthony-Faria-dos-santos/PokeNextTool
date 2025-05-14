"use client";

import React from "react";
import { useLowSpec } from "@contexts/LowSpecContext"; // Import correct du contexte
import { PokemonData } from "@lib/definitions"; // Import de l'interface centrale
import HoloPokemonCard from "./HoloPokemonCard"; // Import relatif
import SimplePokemonCard from "./SimplePokemonCard"; // Import relatif (nom corrigé)

// Retirer l'interface PokemonRenderer
/*
interface PokemonRenderer {
  numero: number;
  nom: string;
  types: { name: string; color: string }[];
  pv?: number;
  attaque?: number;
  defense?: number;
  attaque_spe?: number;
  defense_spe?: number;
  vitesse?: number;
}
*/

interface PokemonCardRendererProps {
  pokemon: PokemonData; // Utilise PokemonData ici
}

const PokemonCardRenderer: React.FC<PokemonCardRendererProps> = ({
  pokemon,
}) => {
  const { isLowSpec } = useLowSpec();

  if (isLowSpec) {
    return <SimplePokemonCard pokemon={pokemon} />;
  }

  return <HoloPokemonCard pokemon={pokemon} />;
};

export default PokemonCardRenderer;
