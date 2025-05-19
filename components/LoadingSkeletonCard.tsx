import React from "react";

// Carte de chargement "squelette".
// Affiche une version simplifiée de la carte pendant que les données chargent.
const LoadingSkeletonCard: React.FC = () => {
  // On reprend les dimensions de la SimplePokemonCard pour la cohérence visuelle.
  const cardWidth = 240;
  const cardHeight = 336;

  return (
    <div
      className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-md animate-pulse flex flex-col overflow-hidden"
      style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
    >
      {/* Espace réservé pour l'image (environ 70% de la hauteur). */}
      <div className="w-full h-[70%] relative bg-gray-300 dark:bg-gray-600">
        {/* On pourrait mettre une icône de chargement simple ici si on voulait. */}
      </div>
      {/* Espace réservé pour les informations. */}
      <div className="p-3 text-center flex-grow flex flex-col justify-around bg-gray-200 dark:bg-gray-700">
        {/* Squelette pour le nom du Pokémon. */}
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
        {/* Squelette pour le numéro. */}
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mx-auto mb-3"></div>
        {/* Squelette pour les badges de type. */}
        <div className="flex justify-center gap-1.5">
          <div className="h-3 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="h-3 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeletonCard;
