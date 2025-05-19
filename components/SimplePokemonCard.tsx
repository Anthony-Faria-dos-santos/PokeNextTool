"use client";

import React from "react";
import Image from "next/image";
import { PokemonData } from "@lib/definitions"; // Interface pour les données Pokémon.
import TypeBadge from "./TypeBadge"; // Composant pour afficher les badges de type.

interface SimplePokemonCardProps {
  pokemon: PokemonData; // On attend un objet Pokémon complet.
}

// Carte Pokémon version "simple", sans effets holographiques.
// Utilisée en mode "LowSpec" ou comme fallback.
const SimplePokemonCard: React.FC<SimplePokemonCardProps> = ({ pokemon }) => {
  const imagePath = `/images/pokemon/${pokemon.numero}.png`;
  const placeholderImage = "/images/pokeball_placeholder.gif"; // Image si l'officielle ne charge pas.

  // Dimensions fixes pour la carte.
  const cardWidth = 240;
  const cardHeight = 336;

  return (
    <div
      className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col overflow-hidden group"
      style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
    >
      {/* Conteneur de l'image (70% de la hauteur de la carte) */}
      <div className="w-full h-[70%] relative bg-slate-200 dark:bg-slate-700/50 overflow-hidden">
        <Image
          src={imagePath}
          alt={pokemon.nom}
          fill // Remplit le conteneur parent.
          style={{ objectFit: "contain" }} // Assure que l'image entière est visible.
          className="group-hover:scale-105 transition-transform duration-300 ease-in-out" // Léger zoom au survol.
          onError={(e) => {
            // Si l'image principale ne charge pas, on affiche le placeholder.
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage;
          }}
          priority={pokemon.numero <= 12} // Priorise le chargement des premières images (souvent visibles au-dessus de la ligne de flottaison).
          sizes={`(max-width: 768px) 100vw, ${cardWidth}px`} // Aide Next/Image à optimiser le chargement.
        />
      </div>
      {/* Zone d'informations (nom, numéro, types) */}
      <div className="p-3 text-center flex-grow flex flex-col justify-around bg-white dark:bg-slate-800">
        <div>
          <h3 className="font-poppins font-semibold text-base text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {pokemon.nom}
          </h3>
          <p className="font-roboto-mono text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            #{String(pokemon.numero).padStart(3, "0")}{" "}
            {/* Numéro formaté sur 3 chiffres. */}
          </p>
        </div>
        <div className="flex justify-center items-center gap-1.5">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.name} name={type.name} color={type.color} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimplePokemonCard;
