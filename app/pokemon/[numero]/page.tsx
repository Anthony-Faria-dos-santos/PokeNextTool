import React from "react";
import { notFound } from "next/navigation"; // Pour gérer le cas où le Pokémon n'est pas trouvé
import Image from "next/image"; // Pour l'image du Pokémon
import { fetchPokemonDetail } from "@/lib/data"; // Fonction de récupération des détails
//import { PokemonData } from "@/lib/definitions"; // Interface des données
import TypeBadge from "@/components/TypeBadge"; // Composant pour les types
import StatGauge from "@/components/StatGauge"; // Composant pour les statistiques
// Les imports useLowSpec et HoloPokemonCard ne sont pas utilisés directement ici, on peut les retirer
// import { useLowSpec } from '@/contexts/LowSpecContext';
// import HoloPokemonCard from '@/components/HoloPokemonCard';
import Link from "next/link"; // Importez le composant Link
// Couleurs des jauges selon la charte graphique
const statColors: { [key: string]: string } = {
  hp: "#48BB78", // Vert
  attack: "#F56565", // Rouge/Corail
  defense: "#4299E1", // Bleu
  special_attack: "#9F7AEA", // Violet
  special_defense: "#38B2AC", // Cyan/Turquoise
  speed: "#ECC94B", // Jaune
};

// Définir les props de la page dynamique
interface PokemonDetailPageProps {
  params: {
    numero: string; // Le numéro du Pokémon vient de l'URL
  };
}

// La page est un Server Component asynchrone
export default async function PokemonDetailPage({
  params,
}: PokemonDetailPageProps) {
  // Accéder à params.numero ici, directement dans la fonction async
  const numeroParam = params.numero;
  const pokemonNumero = parseInt(numeroParam, 10); // Convertir le numéro de string en nombre

  // Vérifier si le numéro est valide (entre 1 et 151)
  if (isNaN(pokemonNumero) || pokemonNumero < 1 || pokemonNumero > 151) {
    notFound(); // Afficher la page 404 de Next.js si le numéro est invalide
  }

  // Récupérer les détails du Pokémon
  const pokemon = await fetchPokemonDetail(pokemonNumero);

  // Si le Pokémon n'est pas trouvé, afficher 404
  if (!pokemon) {
    notFound();
  }

  // Déterminer la couleur de fond basée sur le type principal
  const primaryTypeColor = pokemon.types[0]?.color
    ? `#${pokemon.types[0].color}`
    : "#A0AEC0"; // Gris si pas de type
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
        {/* Affichage des types */}
        <div className="flex justify-center gap-2 mt-4">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.name} name={type.name} color={type.color} />
          ))}
        </div>
      </div>

      {/* Section principale avec image et statistiques */}
      {/* Application d'un fond subtil basé sur le type */}
      <section
        className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 md:p-8 shadow-lg"
        style={{
          backgroundColor: primaryTypeColor
            ? `${primaryTypeColor}20`
            : undefined, // Couleur avec opacité
          backgroundImage: primaryTypeColor
            ? `radial-gradient(circle at 50% 50%, ${primaryTypeColor}30, transparent 60%)`
            : undefined, // Dégradé radial subtil
          transition: "background-color 0.5s ease, background-image 0.5s ease",
        }}
      >
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Colonne de l'image */}
          {/* Ajouter une classe de hauteur ou d'aspect ratio ici */}
          <div className="w-full md:w-1/2 flex justify-center items-center relative aspect-square">
            {" "}
            {/* Ajout de aspect-square */}
            {/* Remplacer layout="intrinsic" par fill={true} */}
            <Image
              src={`/images/pokemon/${pokemon.numero}.png`}
              alt={pokemon.nom}
              fill={true}
              priority
            />
          </div>

          {/* Colonne des statistiques */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-poppins font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Statistiques
            </h2>
            <div className="space-y-3">
              {/* Utilisation de StatGauge pour chaque statistique */}
              <StatGauge label="PV" value={pokemon.pv} color={statColors.hp} />
              <StatGauge
                label="Attaque"
                value={pokemon.attaque}
                color={statColors.attack}
              />
              <StatGauge
                label="Défense"
                value={pokemon.defense}
                color={statColors.defense}
              />
              <StatGauge
                label="Attaque Spé."
                value={pokemon.attaque_spe}
                color={statColors.special_attack}
              />
              <StatGauge
                label="Défense Spé."
                value={pokemon.defense_spe}
                color={statColors.special_defense}
              />
              <StatGauge
                label="Vitesse"
                value={pokemon.vitesse}
                color={statColors.speed}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lien de retour à la liste */}
      <div className="text-center mt-8">
        {/* Décommenter et styliser le Link */}
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

// Pour que `notFound()` fonctionne, vous devez avoir un fichier app/not-found.tsx
// qui gère l'affichage de la page 404.
