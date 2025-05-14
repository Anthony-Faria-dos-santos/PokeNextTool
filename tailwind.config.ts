import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: "class", // Très important pour que next-themes fonctionne avec les classes
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Ajoutez d'autres chemins si vous avez des classes Tailwind ailleurs
    // Par exemple, si vous avez un dossier src/ :
    // './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Ici, vous pourrez étendre le thème par défaut de Tailwind si besoin.
      // Par exemple, pour ajouter les polices personnalisées via des variables CSS
      // (bien que cela soit aussi géré dans globals.css avec Tailwind v4 et @apply ou @theme)
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // Police par défaut si Inter est --font-inter
        poppins: ['var(--font-poppins)'],
        'roboto-mono': ['var(--font-roboto-mono)'],
      },
      // Vous pouvez étendre les couleurs, espacements, etc.
      // colors: {
      //   'primary-blue': '#1A2A4D', // Exemple de couleur personnalisée
      // }
    },
  },
  plugins: [
    // Vous pouvez ajouter des plugins Tailwind ici si nécessaire
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
  ],
}
export default config
