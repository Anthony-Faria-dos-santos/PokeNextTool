import React, { Suspense } from "react";
import Link from "next/link"; // Importez le composant Link
import { fetchPokemonList } from "@/lib/data"; // Importez la fonction de récupération des données
import { PokemonData } from "@/lib/definitions"; // Importez l'interface PokemonData
import PokemonCardRenderer from "@/components/PokemonCardRenderer"; // Importez le renderer de carte
import LoadingSkeletonCard from "@/components/LoadingSkeletonCard"; // Importez le squelette

export default async function HomePage() {
  const pokemonListPromise = fetchPokemonList();

  return (
    <main className="flex flex-col items-center justify-center p-6 md:p-10">
      {/* Titre principal */}
      <h1 className="text-4xl md:text-6xl font-poppins font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Pokédex des 151
      </h1>

      {/* Conteneur principal de la grille - utilise Suspense */}
      {/* Le fallback affiche les squelettes pendant le chargement de pokemonListPromise */}
      <Suspense fallback={<PokemonGridSkeleton />}>
        {/* Composant qui affichera la grille après la résolution de la promesse */}
        <PokemonGrid pokemonListPromise={pokemonListPromise} />
      </Suspense>
    </main>
  );
}

// Composant pour afficher la grille des Pokémon
async function PokemonGrid({
  pokemonListPromise,
}: {
  // Utilise l'interface PokemonData pour typer la promesse
  pokemonListPromise: Promise<PokemonData[]>;
}) {
  // Attend la résolution de la promesse passée depuis le Server Component parent
  const pokemonList = await pokemonListPromise;

  return (
    // Grille responsive Tailwind CSS
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {pokemonList.map((pokemon) => (
        // Enveloppez PokemonCardRenderer dans Link
        <Link key={pokemon.numero} href={`/pokemon/${pokemon.numero}`}>
          <PokemonCardRenderer pokemon={pokemon} />
        </Link>
      ))}
    </div>
  );
}

// Composant pour afficher les squelettes de chargement
function PokemonGridSkeleton() {
  // Affiche un nombre fixe de squelettes
  const numberOfSkeletons = 20;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: numberOfSkeletons }).map((_, index) => (
        <LoadingSkeletonCard key={index} />
      ))}
    </div>
  );
}
