"use client";

import React from "react";
import Image from "next/image";
import { PokemonData } from "@lib/definitions"; //
import TypeBadge from "./TypeBadge"; // Importez le nouveau composant

interface SimplePokemonCardProps {
  pokemon: PokemonData; // Utilise l'interface partagée
}

const SimplePokemonCard: React.FC<SimplePokemonCardProps> = ({ pokemon }) => {
  const imagePath = `/images/pokemon/${pokemon.numero}.png`;
  const placeholderImage = "/images/pokeball_placeholder.gif";

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
          style={{ objectFit: "contain" }}
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
            #{String(pokemon.numero).padStart(3, "0")}
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
