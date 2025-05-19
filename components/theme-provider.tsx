"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Types possibles pour le thème.
type Theme = "dark" | "light" | "system";

// Props pour le ThemeProvider.
type ThemeProviderProps = {
  children: ReactNode; // Les composants enfants qui auront accès au thème.
  defaultTheme?: Theme; // Thème par défaut si rien n'est stocké.
};

// État du provider : le thème actuel et la fonction pour le changer.
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Création du contexte pour le thème.
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "system", // Thème système par défaut.
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Au premier chargement côté client, on essaie de lire le thème depuis localStorage.
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
        return storedTheme; // On utilise le thème stocké s'il est valide.
      }
    }
    return defaultTheme; // Sinon, on prend le thème par défaut.
  });

  useEffect(() => {
    const root = window.document.documentElement; // L'élément <html>.
    root.classList.remove("light", "dark"); // On nettoie les classes précédentes.

    let effectiveTheme = theme;
    // Si le thème est "system", on détermine le vrai thème (light ou dark)
    // en fonction des préférences de l'utilisateur dans son OS.
    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    root.classList.add(effectiveTheme); // On applique la classe "light" ou "dark".

    // On met aussi à jour `color-scheme` pour que le navigateur adapte certains styles natifs.
    document.documentElement.style.colorScheme = effectiveTheme;
  }, [theme]); // Ce `useEffect` se relance si `theme` change.

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Quand on change le thème, on le sauvegarde dans localStorage.
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
      setThemeState(newTheme); // Et on met à jour l'état React.
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook custom pour utiliser facilement le contexte du thème.
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    // Erreur si on essaie de l'utiliser hors d'un ThemeProvider.
    throw new Error(
      "useTheme doit être utilisé à l'intérieur d'un ThemeProvider."
    );
  }
  return context;
};
