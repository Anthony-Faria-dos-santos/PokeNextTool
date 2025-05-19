"use client";
import React, { useEffect, useState } from "react";
import { Progress } from "@ui/progress"; // Barre de progression de shadcn/ui.

interface StatGaugeProps {
  label: string; // Nom de la stat (PV, Attaque, etc.).
  value: number; // Valeur actuelle de la stat.
  maxValue?: number; // Valeur maximale pour cette stat (pour calculer le pourcentage).
}

// Couleurs pour chaque stat. On utilise les variables CSS du thème.
const statColors: { [key: string]: string } = {
  PV: "var(--chart-1)",
  Attaque: "var(--chart-2)",
  Défense: "var(--chart-3)",
  "Attaque Spé.": "var(--chart-4)", // Bien faire attention à la clé si on l'utilise ailleurs.
  "Défense Spé.": "var(--chart-5)",
  Vitesse: "var(--chart-1)", // Peut-être une autre couleur pour Vitesse ?
};

// Composant pour afficher une jauge de statistique.
const StatGauge: React.FC<StatGaugeProps> = ({
  label,
  value,
  maxValue = 255, // Valeur max par défaut pour les stats Pokémon.
}) => {
  const [progressValue, setProgressValue] = useState(0); // Valeur pour l'animation de la jauge.

  // Petit effet pour animer la jauge quand la valeur change.
  useEffect(() => {
    const timer = setTimeout(() => {
      const calculatedPercent = (value / maxValue) * 100;
      // On s'assure que la progression ne dépasse pas 100%.
      const finalProgressValue = Math.min(calculatedPercent, 100);
      setProgressValue(finalProgressValue);
      // console.log(
      //   `StatGauge (${label}): value=${value}, maxValue=${maxValue}, finalProgressValue=${finalProgressValue}`
      // );
    }, 100); // Petit délai pour l'effet visuel.
    return () => clearTimeout(timer); // Nettoyage du timer.
  }, [value, maxValue, label]);

  // Couleur de la jauge, ou une couleur par défaut si la stat n'est pas dans `statColors`.
  const determinedColor = statColors[label] || "var(--foreground)";
  // console.log(
  //   `StatGauge (${label}): determinedColor=${determinedColor}, progressValue (render)=${progressValue}`
  // );

  return (
    <div className="flex items-center gap-3 mb-2 last:mb-0">
      {/* Label de la stat (ex: "PV") */}
      <div className="w-24 text-right text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
        {label}
      </div>
      {/* Barre de progression */}
      <div className="flex-grow">
        <Progress
          value={progressValue}
          className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden"
          // On passe la couleur via une variable CSS pour que le composant Progress l'utilise.
          style={
            { "--indicator-color": determinedColor } as React.CSSProperties
          }
        />
      </div>
      {/* Valeur numérique de la stat */}
      <div className="w-10 text-left text-sm text-slate-600 dark:text-slate-400 font-roboto-mono shrink-0">
        {value}
      </div>
    </div>
  );
};

export default StatGauge;
