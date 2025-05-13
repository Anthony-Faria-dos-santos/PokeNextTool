"use client";

import React, { useEffect, useState } from "react";
import { Progress } from "../components/ui/progress"; // Assurez-vous que ce composant est installé

interface StatGaugeProps {
  label: string;
  value: number;
  maxValue?: number; // Optionnel, défaut à 255
  color: string; // Code hexadécimal avec #
}

const StatGauge: React.FC<StatGaugeProps> = ({
  label,
  value,
  maxValue = 255,
  color,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const calculatedProgress = (value / maxValue) * 100;
      setProgress(calculatedProgress > 100 ? 100 : calculatedProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [value, maxValue]);
  return (
    <div className="flex items-center gap-3 mb-2 last:mb-0">
      <div className="w-24 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </div>
      <div className="flex-grow">
        <Progress
          value={progress}
          className="h-2 rounded-full bg-slate-200 dark:bg-slate-700"
        >
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: color,
              transition: "width 1s ease-out",
            }}
            className="h-full"
          ></div>
        </Progress>
      </div>
      <div className="w-10 text-left text-sm text-slate-600 dark:text-slate-400 font-roboto-mono">
        {value}
      </div>
    </div>
  );
};

export default StatGauge;
