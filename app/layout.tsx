import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google"; // Garder une seule fois
import "@styles/globals.css";
import "@styles/components/HoloPokemonCard.css"; // CSS pour HoloPokemonCard
// @ts-expect-error Inhibition des erreurs 'non bloquantes' TypeScript comportant des @liases
import { LowSpecProvider } from "@contexts/LowSpecContext";
// @ts-expect-error Inhibition des erreurs 'non bloquantes' TypeScript comportant des @liases
import LowSpecToggle from "@components/LowSpecToggle";
// @ts-expect-error Inhibition des erreurs 'non bloquantes' TypeScript comportant des @liases
import { ThemeProvider } from "@components/theme-provider";
// @ts-expect-error Inhibition des erreurs 'non bloquantes' TypeScript comportant des @liases
import { ThemeToggle } from "@components/theme-toggle"; // Assurez-vous que l'export est correct

// Configuration des polices (une seule fois)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

// Metadata (une seule fois)
export const metadata: Metadata = {
  title: "PokeNextTool",
  description: "Un Pokédex moderne construit avec Next.js",
};

// Viewport (une seule fois)
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme;

    if (storedTheme && storedTheme !== 'system') {
      currentTheme = storedTheme;
    } else if (storedTheme === 'system' || !storedTheme) {
      currentTheme = systemPrefersDark ? 'dark' : 'light';
    }
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    }
  } catch (e) {}
})();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} font-sans antialiased`}
      >
        <ThemeProvider defaultTheme="system">
          <LowSpecProvider>
            <div className="min-h-screen bg-background text-foreground">
              {children}
            </div>
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
