import React from 'react';

const LoadingSkeletonCard: React.FC = () => {
  // Utilise les mêmes dimensions de base que SimplePokemonCard pour la cohérence
  const cardWidth = 240;
  const cardHeight = 336;

  return (
    <div
      className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-md animate-pulse flex flex-col overflow-hidden"
      style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
    >
      {/* Squelette pour la zone de l'image (70% de la hauteur) */}
      <div className="w-full h-[70%] relative bg-gray-300 dark:bg-gray-600">
        {/* Optionnel : ajouter une forme simple ou une icône de placeholder */}
      </div>
      {/* Squelette pour la zone d'information (30% de la hauteur) */}
      <div className="p-3 text-center flex-grow flex flex-col justify-around bg-gray-200 dark:bg-gray-700">
        {/* Squelette pour le Nom du Pokémon */}
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
        {/* Squelette pour le Numéro du Pokémon */}
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mx-auto mb-3"></div>
        {/* Squelette pour les Types */}
        <div className="flex justify-center gap-1.5">
            <div className="h-3 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="h-3 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeletonCard;
