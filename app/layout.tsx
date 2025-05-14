import type { Metadata } from "next";
// Importez les polices de Google
import { Inter, Poppins, Roboto_Mono } from "next/font/google";

// Importez le CSS global
import "@styles/globals.css";

// Importez le LowSpecProvider et LowSpecToggle
import { LowSpecProvider } from "@contexts/LowSpecContext";
import LowSpecToggle from "@components/LowSpecToggle";
// Importez le ThemeProvider de shadcn/ui (chemin basé sur votre structure)
import { ThemeProvider } from "@components/theme-provider";
// Importez le nouveau ThemeToggle
import ThemeToggle from "@components/theme-toggle"; // Ajoutez cet import

// Configurez les polices avec variables CSS
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Spécifiez les poids utilisés
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PokeNextTool",
  description: "Un Pokédex moderne construit avec Next.js",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} font-sans antialiased`}
      >
        <LowSpecProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-background text-foreground">
              {children}
            </div>
          </ThemeProvider>

          {/* LowSpecToggle est placé ici */}
          {/* Ajout du ThemeToggle à côté, potentiellement dans un flexbox ou un wrapper */}
          <div className="fixed bottom-5 left-5 z-50 flex gap-2">
            {" "}
            {/* Exemple de wrapper pour positionnement */}
            <LowSpecToggle />
            <ThemeToggle /> {/* Ajoutez le ThemeToggle ici */}
          </div>
        </LowSpecProvider>
      </body>
    </html>
  );
}
