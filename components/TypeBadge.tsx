import React from "react";

interface TypeBadgeProps {
  name: string; // Nom du type à afficher (ex: "Feu").
  color: string; // Code couleur hexadécimal (sans le '#') pour le fond.
}

// Petit composant pour afficher un badge de type Pokémon.
const TypeBadge: React.FC<TypeBadgeProps> = ({ name, color }) => {
  // On rajoute le '#' pour que le CSS comprenne la couleur.
  const bgColor = `#${color}`;

  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{
        backgroundColor: bgColor,
        textShadow: "1px 1px 1px rgba(0,0,0,0.2)", // Petite ombre pour la lisibilité.
      }}
    >
      {name}
    </span>
  );
};

export default TypeBadge;
