"use client";
import React, { useEffect, useState } from "react";
import { Progress } from "@ui/progress";

interface StatGaugeProps {
  label: string;
  value: number;
  maxValue?: number;
}

// Modifiez statColors pour utiliser directement var()
const statColors: { [key: string]: string } = {
  PV: "var(--chart-1)",
  Attaque: "var(--chart-2)",
  Défense: "var(--chart-3)",
  "Attaque Spé.": "var(--chart-4)", // Notez la différence avec "Sp. Atk" si vous utilisez cette clé ailleurs
  "Défense Spé.": "var(--chart-5)", // Notez la différence avec "Sp. Def"
  Vitesse: "var(--chart-1)", // ou une autre couleur
};

const StatGauge: React.FC<StatGaugeProps> = ({
  label,
  value,
  maxValue = 255,
}) => {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const calculatedPercent = (value / maxValue) * 100;
      const finalProgressValue =
        calculatedPercent > 100 ? 100 : calculatedPercent;
      setProgressValue(finalProgressValue);
      console.log(
        `StatGauge (${label}): value=${value}, maxValue=${maxValue}, calculatedPercent=${calculatedPercent}, finalProgressValue=${finalProgressValue}`
      );
    }, 100);
    return () => clearTimeout(timer);
  }, [value, maxValue, label]);

  const determinedColor = statColors[label] || "var(--foreground)"; // Fallback à var(--foreground)
  console.log(
    `StatGauge (${label}): determinedColor=${determinedColor}, progressValue (render)=${progressValue}`
  );

  return (
    <div className="flex items-center gap-3 mb-2 last:mb-0">
      <div className="w-24 text-right text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
        {label}
      </div>
      <div className="flex-grow">
        <Progress
          value={progressValue}
          className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden"
          style={
            { "--indicator-color": determinedColor } as React.CSSProperties
          }
        />
      </div>
      <div className="w-10 text-left text-sm text-slate-600 dark:text-slate-400 font-roboto-mono shrink-0">
        {value}
      </div>
    </div>
  );
};

export default StatGauge;
