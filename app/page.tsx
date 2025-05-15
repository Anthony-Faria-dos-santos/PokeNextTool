import React, { Suspense } from "react";
// @ts-expect-error Inhibition des erreurs 'non bloquantes' TypeScript comportant des @liases
import { fetchPokemonList, fetchTypes } from "@/lib/data";
// @ts-expect-error Inhibition des erreurs 'non bloquantes' TypeScript comportant des @liases
import LoadingSkeletonCard from "@/components/LoadingSkeletonCard";
// @ts-expect-error Inhibition des erreurs 'non bloquantes' TypeScript comportant des @liases
import PokemonListWithControls from "@/components/PokemonListWithControls";

// Définition du type pour les props de HomePage, en supposant que searchParams peut être une Promise
type HomePageProps = {
  params: object; // Les pages non dynamiques (comme la racine) ont un objet params vide
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({}:/* searchParams }:*/ HomePageProps) {
  // Si vous deviez utiliser les searchParams directement dans ce Server Component:
  // const resolvedSearchParams = searchParams ? await searchParams : {};
  // console.log("HomePage resolvedSearchParams:", resolvedSearchParams);
  // Pour l'instant, HomePage ne les utilise pas directement pour sa logique principale.
  const pokemonListPromise = fetchPokemonList();
  const typesListPromise = fetchTypes();

  // console.log("HomePage rendering, passing data promises to PokemonDataResolver");

  return (
    <main className="flex flex-col items-center justify-center p-6 md:p-10">
      <h1 className="text-4xl md:text-6xl font-poppins font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Pokédex des 151
      </h1>
      <Suspense fallback={<PokemonGridSkeleton />}>
        <PokemonDataResolver
          pokemonListPromise={pokemonListPromise}
          typesListPromise={typesListPromise}
        />
      </Suspense>
    </main>
  );
}

async function PokemonDataResolver({
  pokemonListPromise,
  typesListPromise,
}: {
  pokemonListPromise: ReturnType<typeof fetchPokemonList>;
  typesListPromise: ReturnType<typeof fetchTypes>;
}) {
  const [initialPokemonList, allTypes] = await Promise.all([
    pokemonListPromise,
    typesListPromise,
  ]);

  // console.log("PokemonDataResolver: Data fetched. Rendering PokemonListWithControls.");
  return (
    <PokemonListWithControls
      initialPokemonList={initialPokemonList}
      allTypes={allTypes}
    />
  );
}

function PokemonGridSkeleton() {
  const numberOfSkeletons = 20;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full max-w-7xl mx-auto">
      {Array.from({ length: numberOfSkeletons }).map((_, index) => (
        <LoadingSkeletonCard key={index} />
      ))}
    </div>
  );
}
