"use client";

import React from "react";
import { useLowSpec } from "@contexts/LowSpecContext"; // Hook pour accéder au contexte LowSpec.
import { Switch } from "@ui/switch"; // Composant Switch de shadcn/ui.
import { Label } from "@components/ui/label"; // Composant Label.
import { MonitorSmartphone, Sparkles } from "lucide-react"; // Icônes.

// Bouton pour activer/désactiver le mode "LowSpec" (affichage simplifié).
const LowSpecToggle: React.FC = () => {
  const { isLowSpec, toggleLowSpec } = useLowSpec(); // Récupère l'état et la fonction du contexte.

  return (
    // Le conteneur du toggle, positionné en bas à droite.
    <div className="fixed bottom-5 right-5 bg-white dark:bg-slate-900 p-3 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 z-50 flex items-center space-x-3 transition-all hover:shadow-blue-500/30 dark:hover:shadow-blue-400/30">
      <Label
        htmlFor="low-spec-mode"
        className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-2"
      >
        {/* Icône change en fonction du mode. */}
        {isLowSpec ? (
          <MonitorSmartphone size={18} className="text-green-500" /> // Mode Éco (LowSpec)
        ) : (
          <Sparkles size={18} className="text-yellow-500" /> // Mode Holo (Normal)
        )}
        <span>{isLowSpec ? "Mode Éco" : "Mode Holo"}</span>
      </Label>
      <Switch
        id="low-spec-mode"
        checked={!isLowSpec} // Le switch est "on" (coché) quand isLowSpec est false (Mode Holo).
        onCheckedChange={toggleLowSpec} // Appelle la fonction du contexte pour changer de mode.
        aria-label="Changer de mode d'affichage des cartes Pokémon"
        // Couleurs personnalisées pour le switch en fonction de l'état.
        className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-green-500"
      />
    </div>
  );
};

export default LowSpecToggle;
