import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchPokemonDetail } from "@/lib/data";
import TypeBadge from "@/components/TypeBadge";
import StatGauge from "@/components/StatGauge";
import Link from "next/link";

// La variable statColors a été supprimée car elle n'était plus utilisée.

interface PokemonDetailPageProps {
  params: Promise<{
    numero: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}
// Props de la page directement typées dans la signature de la fonction
export default async function PokemonDetailPage({
  params,
}: PokemonDetailPageProps) {
  // Attendez la résolution de la Promise params
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
    : "#A0AEC0";
  return (
    <main className="container mx-auto p-6 md:p-10">
      {/* Section d'en-tête avec nom et numéro */}
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

      {/* Section principale avec image et statistiques */}
      <section
        className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 md:p-8 shadow-lg"
        style={{
          backgroundColor: primaryTypeColor
            ? `${primaryTypeColor}20`
            : undefined,
          backgroundImage: primaryTypeColor
            ? `radial-gradient(circle at 50% 50%, ${primaryTypeColor}30, transparent 60%)`
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
