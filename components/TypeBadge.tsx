import React from "react";

interface TypeBadgeProps {
  name: string;
  color: string; // Code hexadécimal sans le #
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ name, color }) => {
  // Ajoutez le '#' à la couleur hexadécimale pour l'utiliser dans le style inline
  const bgColor = `#${color}`;

  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{
        backgroundColor: bgColor,
        textShadow: "1px 1px 1px rgba(0,0,0,0.2)",
      }}
    >
      {name}
    </span>
  );
};

export default TypeBadge;
