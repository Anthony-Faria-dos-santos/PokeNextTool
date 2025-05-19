"use client";

import { useTheme } from "@components/theme-provider"; // Correction: Utilise VOTRE hook useTheme
import { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme(); // Ceci devrait maintenant utiliser votre propre contexte
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Rendre un placeholder ou null côté serveur pour éviter le mismatch d'hydratation
    // Un bouton désactivé avec des dimensions fixes peut éviter les sauts de layout.
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        className="opacity-50 w-[36px] h-[36px]"
      />
    );
  }
  const toggleTheme = () => {
    let currentEffectiveTheme = theme;
    // Si le thème actuel est 'system', déterminez s'il est dark ou light
    if (theme === "system") {
      currentEffectiveTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
    }
    // Basculer entre 'dark' et 'light'
    setTheme(currentEffectiveTheme === "dark" ? "light" : "dark");
  };

  // Déterminer quel icône afficher basé sur le thème effectif
  // Cela assure que l'icône est correcte même si le thème est 'system'
  let displayDark = theme === "dark";
  if (theme === "system" && mounted) {
    // 'mounted' est important pour window.matchMedia
    displayDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={
        displayDark ? "Passer au mode clair" : "Passer au mode sombre"
      }
    >
      {displayDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
