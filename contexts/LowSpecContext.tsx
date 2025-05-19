"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Interface pour définir la forme de notre contexte "LowSpec".
interface LowSpecContextType {
  isLowSpec: boolean; // Vrai si le mode "éco" (performances basses) est activé.
  toggleLowSpec: () => void; // Fonction pour changer de mode.
}

// Création du contexte. undefined est la valeur par défaut si on l'utilise hors Provider.
const LowSpecContext = createContext<LowSpecContextType | undefined>(undefined);

// Provider pour le contexte. C'est lui qui va "fournir" les valeurs.
export const LowSpecProvider = ({ children }: { children: ReactNode }) => {
  const [isLowSpec, setIsLowSpec] = useState(false); // Par défaut, le mode éco est désactivé.

  const toggleLowSpec = () => {
    setIsLowSpec((prev) => !prev); // Inverse la valeur actuelle.
  };

  return (
    <LowSpecContext.Provider value={{ isLowSpec, toggleLowSpec }}>
      {children} {/* Les composants enfants auront accès au contexte. */}
    </LowSpecContext.Provider>
  );
};

// Hook custom pour utiliser facilement le contexte LowSpec.
export const useLowSpec = (): LowSpecContextType => {
  const context = useContext(LowSpecContext);
  if (context === undefined) {
    // Si on essaie d'utiliser ce hook hors du LowSpecProvider, c'est une erreur.
    throw new Error(
      "useLowSpec doit être utilisé à l'intérieur d'un LowSpecProvider."
    );
  }
  return context;
};
