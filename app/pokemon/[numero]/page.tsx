import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchPokemonDetail } from "@/lib/data";
import TypeBadge from "@/components/TypeBadge";
import StatGauge from "@/components/StatGauge";
import Link from "next/link";

// Note: La variable statColors a été retirée car elle n'est plus utilisée ici.

interface PokemonDetailPageProps {
  params: Promise<{
    numero: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}
// Typage des props pour la page, directement dans la signature.
export default async function PokemonDetailPage({
  params,
}: PokemonDetailPageProps) {
  // On récupère les paramètres de la page après résolution de la Promise.
  const resolvedParams = await params;
  const numeroParam = resolvedParams.numero;
  const pokemonNumero = parseInt(numeroParam, 10);

  if (isNaN(pokemonNumero) || pokemonNumero < 1 || pokemonNumero > 151) {
    notFound();
  }

  const pokemon = await fetchPokemonDetail(pokemonNumero);

  if (!pokemon) {
    notFound();
  }
  const primaryTypeColor = pokemon.types[0]?.color
    ? `#${pokemon.types[0].color}`
    : "#A0AEC0"; // Couleur par défaut si pas de type.
  return (
    <main className="container mx-auto p-6 md:p-10">
      {/* Section en-tête : affiche le nom et le numéro du Pokémon. */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-800 dark:text-gray-100 mb-2">
          {pokemon.nom}
        </h1>
        <p className="text-xl md:text-2xl font-roboto-mono text-gray-600 dark:text-gray-300">
          #{String(pokemon.numero).padStart(3, "0")}
        </p>
        <div className="flex justify-center gap-2 mt-4">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.name} name={type.name} color={type.color} />
          ))}
        </div>
      </div>

      {/* Section principale : contient l'image et les statistiques du Pokémon. */}
      <section
        className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 md:p-8 shadow-lg"
        style={{
          backgroundColor: primaryTypeColor
            ? `${primaryTypeColor}20` // Applique une couleur de fond basée sur le type primaire.
            : undefined,
          backgroundImage: primaryTypeColor
            ? `radial-gradient(circle at 50% 50%, ${primaryTypeColor}30, transparent 60%)` // Effet radial subtil.
            : undefined,
          transition: "background-color 0.5s ease, background-image 0.5s ease",
        }}
      >
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="w-full md:w-1/2 flex justify-center items-center relative aspect-square">
            <Image
              src={`/images/pokemon/${pokemon.numero}.png`}
              alt={pokemon.nom}
              fill={true}
              priority
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-poppins font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Statistiques
            </h2>
            <div className="space-y-3">
              <StatGauge label="PV" value={pokemon.pv} />
              <StatGauge label="Attaque" value={pokemon.attaque} />
              <StatGauge label="Défense" value={pokemon.defense} />
              <StatGauge label="Attaque Spé." value={pokemon.attaque_spe} />
              <StatGauge label="Défense Spé." value={pokemon.defense_spe} />
              <StatGauge label="Vitesse" value={pokemon.vitesse} />
            </div>
          </div>
        </div>
      </section>

      <div className="text-center mt-8">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 transition-colors text-lg font-medium"
        >
          ← Retour à la liste
        </Link>
      </div>
    </main>
  );
}
