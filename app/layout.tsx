import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google"; // Polices Google.
import "@styles/globals.css"; // Styles globaux.
import "@styles/components/HoloPokemonCard.css"; // Styles spécifiques pour la carte Holo.
import { LowSpecProvider } from "@contexts/LowSpecContext"; // Provider pour le mode LowSpec.
import LowSpecToggle from "@components/LowSpecToggle"; // Bouton pour changer de mode.
import { ThemeProvider } from "@components/theme-provider"; // Provider pour le thème (dark/light).
import { ThemeToggle } from "@components/theme-toggle"; // Bouton pour changer de thème.

// Configuration des polices.
// On les charge ici pour qu'elles soient dispo dans toute l'app.
const inter = Inter({
  variable: "--font-inter", // Variable CSS pour l'utiliser facilement.
  subsets: ["latin"],
  display: "swap", // Améliore le chargement perçu.
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Poids de police nécessaires.
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

// Métadonnées pour le SEO et l'affichage dans les onglets/partages.
export const metadata: Metadata = {
  title: "PokeNextTool",
  description: "Un Pokédex moderne construit avec Next.js et la Gen 1.",
};

// Configuration du viewport pour la responsivité.
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

// Layout racine de l'application.
// Tous les enfants de ce layout hériteront des providers et styles définis ici.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `suppressHydrationWarning` est utile car on modifie `<html>` avec le script de thème.

    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Script pour appliquer le thème (dark/light) avant le rendu côté client. */}
        {/* Ça évite le flash de contenu (FOUT - Flash Of Unstyled Theming). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme;

    if (storedTheme && storedTheme !== 'system') {
      currentTheme = storedTheme; // Thème stocké prioritaire.
    } else { // Si 'system' ou pas de thème stocké.
      currentTheme = systemPrefersDark ? 'dark' : 'light'; // On se base sur la préférence OS.
    }

    const el = document.documentElement;
    // Applique la classe et le style \`color-scheme\` directement sur <html>.
    if (currentTheme === 'dark') {
      el.classList.remove('light'); // S'assurer que 'light' n'est pas présent.
      el.classList.add('dark');
      el.style.colorScheme = 'dark';
    } else {
      el.classList.remove('dark'); // S'assurer que 'dark' n'est pas présent.
      el.classList.add('light');   // Ajouter explicitement 'light'.
      el.style.colorScheme = 'light';
    }
  } catch (e) { /* On ignore les erreurs au cas où localStorage ou matchMedia ne sont pas dispo. */ }
})();
            `,
          }}
        />
      </head>
      <body
        // Applique les classes des polices au body.
        className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} font-sans antialiased`}
      >
        {/* ThemeProvider englobe tout pour gérer le thème dark/light. */}
        <ThemeProvider defaultTheme="system">
          {/* LowSpecProvider pour gérer le mode d'affichage (Holo vs Simple). */}
          <LowSpecProvider>
            <div className="min-h-screen bg-background text-foreground">
              {children}{" "}
              {/* C'est ici que les pages de l'application seront rendues. */}
            </div>
            {/* Les boutons de toggle sont en position fixe. */}
            <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
              <ThemeToggle />
              <LowSpecToggle />
            </div>
          </LowSpecProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
