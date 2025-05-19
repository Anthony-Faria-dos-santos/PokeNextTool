"use client";

import { useTheme } from "@components/theme-provider"; // On utilise notre propre hook useTheme.
import { useState, useEffect } from "react";
import { Button } from "@components/ui/button"; // Bouton de shadcn/ui.
import { Moon, Sun } from "lucide-react"; // Icônes.

// Composant pour le bouton de changement de thème (clair/sombre).
export function ThemeToggle() {
  const { theme, setTheme } = useTheme(); // Récupère le thème actuel et la fonction pour le changer.
  const [mounted, setMounted] = useState(false);

  // useEffect se lance seulement côté client.
  // Permet d'éviter les soucis d'hydratation avec le thème système.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Tant que le composant n'est pas monté côté client, on affiche un placeholder.
  // Ça évite un décalage visuel (layout shift) et des erreurs d'hydratation.
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        className="opacity-50 w-[36px] h-[36px]" // Dimensions fixes pour éviter le saut.
      />
    );
  }

  const toggleTheme = () => {
    let currentEffectiveTheme = theme;
    // Si le thème est 'system', on regarde ce que préfère l'OS.
    if (theme === "system") {
      currentEffectiveTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
    }
    // On bascule entre 'dark' et 'light'.
    setTheme(currentEffectiveTheme === "dark" ? "light" : "dark");
  };

  // Détermine l'icône à afficher (Soleil ou Lune).
  // Important de vérifier `mounted` pour window.matchMedia.
  let displayDark = theme === "dark";
  if (theme === "system" && mounted) {
    displayDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={
        displayDark ? "Passer au thème clair" : "Passer au thème sombre"
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
