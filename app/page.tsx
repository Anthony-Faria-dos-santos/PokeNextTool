import React, { Suspense } from "react";
import { fetchPokemonList, fetchTypes } from "@/lib/data"; // Fonctions pour récupérer les données.
import LoadingSkeletonCard from "@/components/LoadingSkeletonCard"; // Squelette de chargement.
import PokemonListWithControls from "@/components/PokemonListWithControls"; // Le composant principal de la page.

// Props pour la page d'accueil.
// `searchParams` pourraient être utilisés si on voulait lire l'URL côté serveur ici,
// mais la logique est gérée côté client dans PokemonListWithControls.
type HomePageProps = {
  params: object; // Vide pour une page racine.
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // Optionnel.
};

// Page d'accueil de l'application (Server Component).
export default async function HomePage({}: HomePageProps) {
  // On lance les fetches des données en parallèle.
  const pokemonListPromise = fetchPokemonList();
  const typesListPromise = fetchTypes();

  // Le `console.log` pour le debug peut être retiré.
  // console.log("HomePage: Passage des promesses de données à PokemonDataResolver.");

  return (
    <main className="flex flex-col items-center justify-center p-6 md:p-10">
      <h1 className="text-4xl md:text-6xl font-poppins font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Pokédex des 151
      </h1>
      {/* Suspense gère l'affichage du fallback (PokemonGridSkeleton) 
          pendant que PokemonDataResolver charge ses données. */}
      <Suspense fallback={<PokemonGridSkeleton />}>
        <PokemonDataResolver
          pokemonListPromise={pokemonListPromise}
          typesListPromise={typesListPromise}
        />
      </Suspense>
    </main>
  );
}

// Composant (Server Component) qui attend la résolution des promesses de données.
// Permet de découpler le fetch de données de leur utilisation.
async function PokemonDataResolver({
  pokemonListPromise,
  typesListPromise,
}: {
  pokemonListPromise: ReturnType<typeof fetchPokemonList>;
  typesListPromise: ReturnType<typeof fetchTypes>;
}) {
  // Attend que les deux promesses soient résolues.
  const [initialPokemonList, allTypes] = await Promise.all([
    pokemonListPromise,
    typesListPromise,
  ]);

  // console.log("PokemonDataResolver: Données récupérées. Affichage de PokemonListWithControls.");

  // Une fois les données prêtes, on rend le composant client qui les utilise.
  return (
    <PokemonListWithControls
      initialPokemonList={initialPokemonList}
      allTypes={allTypes}
    />
  );
}

// Squelette d'affichage pour la grille de Pokémon pendant le chargement.
function PokemonGridSkeleton() {
  const numberOfSkeletons = 20; // Nombre de cartes squelettes à afficher.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full max-w-7xl mx-auto">
      {Array.from({ length: numberOfSkeletons }).map((_, index) => (
        <LoadingSkeletonCard key={index} />
      ))}
    </div>
  );
}
