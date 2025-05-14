# PokeNextTool - Séquence de Prompts pour Assistant IA

Ce document contient une série de prompts à fournir à un assistant IA pour développer le projet PokeNextTool, en se basant sur le "PokeNextTool - Cahier des Charges v5 (Complet et Consolidé)". Chaque prompt correspond à une tâche ou à un ensemble de tâches logiques.

**Instructions Générales pour l'Assistant (à rappeler si nécessaire) :**
* **Référence principale :** Le "PokeNextTool - Cahier des Charges v5 (Complet et Consolidé)".
* **Fichier de base pour composants :** Le fichier `docs/pokemonCardComponents.tsx` est la source pour `HoloPokemonCard`, `SimplePokemonCard`, `LowSpecContext`, `LowSpecToggle`, et `PokemonCardRenderer`. Tu devras extraire le code de ce fichier, créer les fichiers de composants individuels aux emplacements spécifiés, et ajuster les imports/exports.
* **Commits :** Après chaque tâche significative terminée et testée, effectue un commit en français en respectant la convention "Conventional Commits" (ex: `feat(ui): ...`, `fix(data): ...`).
* **Langage et Style :** Utilise TypeScript et la syntaxe ES6+. Rédige du code clair, bien commenté (en français ou en anglais pour les commentaires techniques), et des noms de variables explicites.
* **Responsivité :** La responsivité est cruciale. Utilise Tailwind CSS (`sm:`, `md:`, `lg:`, `xl:`) et teste sur différentes tailles d'écran.
* **Variables d'environnement :** Les variables pour la base de données (`PG_URI`, `PGUSER`, etc.) sont déjà définies dans `.env` et `.env.local` et doivent être utilisées.
* **Base de données :** La base de données PostgreSQL "pokedex" est active et structurée selon `pokedex.sql`.

---

## Séquence de Prompts

### Phase 1 : Configuration Initiale et Fondations

**Prompt 1.1 : Vérification et Structure des Dossiers**
"Bonjour ! Nous démarrons le projet PokeNextTool.
1.  Vérifie que le projet Next.js (avec App Router) et Tailwind CSS sont correctement initialisés.
2.  Assure-toi que la structure de dossiers suivante existe à la racine du projet. Si des dossiers manquent, crée-les :
    * `app/`
    * `components/`
    * `contexts/`
    * `lib/`
    * `styles/` (ce dossier contiendra `globals.css` et potentiellement d'autres fichiers CSS spécifiques plus tard)
    * `docs/` (ce dossier contient déjà `pokemonCardComponents.tsx`)
    * `public/images/pokemon/` (contient déjà les images des Pokémon)
    * `public/images/` (contient déjà `pokeball_placeholder.gif`)"

**Prompt 1.2 : Installation des Dépendances**
"Installe les dépendances suivantes si elles ne sont pas déjà présentes dans le projet :
1.  `pg` (pour l'interaction avec la base de données PostgreSQL).
2.  `lucide-react` (pour les icônes).
Génère la commande npm ou yarn pour cela.
Ensuite, effectue un commit : `chore: installation des dépendances (pg, lucide-react)`"

---

### Phase 2 : Modélisation des Données et Accès aux Données

**Prompt 2.1 : Création de `lib/data.ts` et `fetchPokemonList()`**
"Crée le fichier `lib/data.ts`. Dans ce fichier :
1.  Importe le client `pg` pour te connecter à la base de données PostgreSQL. Utilise les variables d'environnement (`PGUSER`, `PGHOST`, `PGDATABASE`, `PGPASSWORD`, `PGPORT`) pour la configuration de la connexion.
2.  Implémente une fonction asynchrone `fetchPokemonList()`.
    * Cette fonction doit récupérer les informations des 151 premiers Pokémon.
    * Pour chaque Pokémon, elle doit retourner : `id` (de la table pokemon), `nom`, `numero`, `pv`, `attaque`, `defense`, `attaque_spe`, `defense_spe`, `vitesse`.
    * Elle doit effectuer les jointures SQL nécessaires avec les tables `pokemon_type` et `type` pour récupérer également un tableau `types` pour chaque Pokémon. Chaque élément de ce tableau `types` doit être un objet `{ name: string, color: string }` (où `color` est le code hexadécimal sans le `#`).
    * La fonction doit retourner une promesse résolue avec un tableau d'objets `PokemonData`. Définis l'interface `PokemonData` comme suit au début du fichier ou dans `lib/definitions.ts` (préférable) :
        ```typescript
        // Dans lib/definitions.ts (ou lib/data.ts)
        export interface PokemonType {
          name: string;
          color: string;
        }

        export interface PokemonData {
          id: number;
          nom: string;
          numero: number;
          pv: number;
          attaque: number;
          defense: number;
          attaque_spe: number;
          defense_spe: number;
          vitesse: number;
          types: PokemonType[];
        }
        ```
    * Assure-toi de bien gérer les erreurs de connexion ou de requête.
Après avoir implémenté et testé cette fonction, effectue un commit : `feat(data): implémentation de fetchPokemonList pour récupérer les Pokémon avec leurs types`"

**Prompt 2.2 : Implémentation de `fetchPokemonDetail()`**
"Dans `lib/data.ts`, implémente une fonction asynchrone `fetchPokemonDetail(numero: number)`.
* Cette fonction doit récupérer les détails d'un Pokémon spécifique en utilisant son `numero` (qui correspond au champ `numero` de la table `pokemon`).
* Elle doit retourner toutes les informations de l'interface `PokemonData` (définie précédemment) pour ce Pokémon.
* Gère le cas où aucun Pokémon n'est trouvé pour le numéro donné (par exemple, en retournant `null` ou en levant une erreur).
Après avoir implémenté et testé, commit : `feat(data): implémentation de fetchPokemonDetail pour un Pokémon spécifique`"

**Prompt 2.3 : Implémentation de `fetchTypes()`**
"Dans `lib/data.ts`, implémente une fonction asynchrone `fetchTypes()`.
* Cette fonction doit récupérer la liste de tous les types de Pokémon distincts depuis la table `type`.
* Pour chaque type, elle doit retourner son `id`, `name` et `color`.
* La fonction doit retourner une promesse résolue avec un tableau d'objets `{ id: number, name: string, color: string }`.
Après avoir implémenté et testé, commit : `feat(data): implémentation de fetchTypes pour lister les types`"

**Prompt 2.4 : Validation Zod**
"Ajouter une validation des données avec Zod :
1.  Installe Zod (`npm install zod` ou `yarn add zod`).
2.  Dans `lib/definitions.ts` (ou un nouveau fichier `lib/schemas.ts`), définis les schémas Zod pour `PokemonData` et `PokemonType`.
3.  Utilise ces schémas pour valider les données récupérées par les fonctions dans `lib/data.ts`.
Commit : `feat(data): ajout de la validation Zod pour les données Pokémon`"

---

### Phase 3 : Composants React

**Prompt 3.1 : Création des Composants à partir de `docs/pokemonCardComponents.tsx`**
"Le fichier `docs/pokemonCardComponents.tsx` contient le code source pour plusieurs composants React. Ta tâche est de :
1.  Créer le fichier `contexts/LowSpecContext.tsx` et y placer le code correspondant à `LowSpecProvider` et `useLowSpec` depuis `docs/pokemonCardComponents.tsx`. Assure-toi que les exports sont corrects.
2.  Créer le fichier `components/HoloPokemonCard.tsx` et y placer le code correspondant depuis `docs/pokemonCardComponents.tsx`. Ajuste les imports (ex: `Image` de `next/image`, `useLowSpec` si besoin, etc.). Assure-toi que le composant est exporté par défaut.
3.  Créer le fichier `components/SimplePokemonCard.tsx` et y placer le code correspondant. Ajuste les imports et exporte le composant.
4.  Créer le fichier `components/LowSpecToggle.tsx` et y placer le code correspondant. Ajuste les imports (notamment `useLowSpec` depuis `../contexts/LowSpecContext`, `Switch` et `Label` de `@/components/ui/switch` et `@/components/ui/label`, et les icônes de `lucide-react`). Exporte le composant.
5.  Créer le fichier `components/PokemonCardRenderer.tsx` et y placer le code correspondant. Ajuste les imports (`useLowSpec`, `HoloPokemonCard`, `SimplePokemonCard`). Exporte le composant.
Vérifie attentivement tous les chemins d'importation et les noms d'interface pour éviter les conflits (ex: si `Pokemon` est défini plusieurs fois, utilise des alias ou assure-toi que les scopes sont corrects).
Commit : `feat(ui): création des composants HoloPokemonCard, SimplePokemonCard, LowSpecContext, LowSpecToggle, PokemonCardRenderer à partir de la base fournie`"

**Prompt 3.2 : Création de `components/TypeBadge.tsx`**
"Crée le composant `components/TypeBadge.tsx`.
* Il doit accepter les props : `name: string` et `color: string` (code hexadécimal sans `#`).
* Il doit afficher un badge (une `span` ou un `div`) avec le nom du type.
* Le style du badge doit être conforme à la charte graphique :
    * Couleur de fond définie par la prop `color`.
    * Texte blanc avec une légère ombre portée pour la lisibilité (ex: `text-white text-shadow-sm`).
    * Coins arrondis (ex: `rounded-full`).
    * Padding approprié (ex: `px-3 py-1 text-xs font-medium`).
* Utilise Tailwind CSS pour le style.
Commit : `feat(ui): création du composant TypeBadge`"

**Prompt 3.3 : Création de `components/StatGauge.tsx`**
"Crée le composant `components/StatGauge.tsx`.
* Il doit accepter les props : `label: string`, `value: number`, `maxValue: number` (défaut à 255), `color: string` (code hexadécimal avec `#` pour la couleur de la barre).
* Utilise le composant `Progress` de `shadcn/ui` (`@/components/ui/progress`).
* Affiche le `label` et la `value` numérique à côté ou au-dessus de la jauge.
* La couleur de la barre de progression doit être définie par la prop `color`.
* Implémente une animation de remplissage de la jauge lors de son apparition (ex: transition CSS sur la largeur ou utilisation d'une bibliothèque d'animation légère si nécessaire, mais une transition CSS est préférable).
* Assure-toi que le style est propre et s'intègre bien à la charte.
Commit : `feat(ui): création du composant StatGauge avec animation`"

**Prompt 3.4 : Vérification et Adaptation des Cartes Pokémon**
"Revois les composants `components/HoloPokemonCard.tsx` et `components/SimplePokemonCard.tsx`.
1.  Assure-toi qu'ils utilisent le composant `TypeBadge.tsx` (ou un style interne équivalent s'il a été implémenté directement dans le fichier `pokemonCardComponents.tsx`) pour afficher les types du Pokémon. L'utilisation de `TypeBadge.tsx` est préférable.
2.  Vérifie que leurs dimensions de base (`cardWidth`, `cardHeight`) sont cohérentes pour éviter des sauts de layout lors du changement de mode via `LowSpecToggle`.
3.  Pour `HoloPokemonCard.tsx` :
    * Le wrapper `holo-card-container-wrapper` (ou un nom similaire) doit être présent pour gérer le padding/centrage si la carte est utilisée individuellement, ou la carte doit être conçue pour être directement stylée par une grille parente. Le but est que la carte soit autonome et réutilisable.
    * Peaufine l'effet holographique pour qu'il s'applique correctement et esthétiquement aux images des Pokémon (qui sont au format PNG et ont des transparences). La zone de l'effet (`.holo-card-shine-overlay`, `.holo-card-glare-overlay`) doit bien correspondre à la zone de l'image du Pokémon.
    * La variable CSS `--glow` pour l'ombre de la carte active doit utiliser la couleur du premier type du Pokémon.
4.  Assure-toi que les deux types de cartes sont responsives et que leur contenu (image, nom, numéro, types) s'affiche correctement.
Commit : `refactor(ui): ajustement de SimplePokemonCard et HoloPokemonCard pour cohérence, responsivité et utilisation de TypeBadge`"

---

### Phase 4 : Pages Principales et Navigation (Responsive)

**Prompt 4.1 : Configuration de `app/layout.tsx`**
"Modifie le fichier `app/layout.tsx` :
1.  Importe et utilise `LowSpecProvider` pour envelopper `{children}` afin de rendre le contexte accessible globalement.
2.  Importe et ajoute le composant `LowSpecToggle` pour qu'il soit visible sur toutes les pages (par exemple, en position fixe en bas à droite).
3.  Configure les polices Inter, Poppins, et Roboto Mono en utilisant `next/font/google` et assigne-les via des variables CSS comme décrit dans la charte graphique (ex: `--font-inter`, `--font-poppins`, `--font-roboto-mono`). Applique la police `Inter` par défaut au `body`.
4.  Intègre le `ThemeProvider` de shadcn/ui (si ce n'est pas déjà fait) pour la gestion du thème clair/sombre.
5.  Assure-toi que la balise `<meta name="viewport" content="width=device-width, initial-scale=1.0">` est présente dans le `<head>`.
Commit : `feat(app): configuration du RootLayout avec LowSpecProvider, LowSpecToggle, polices et viewport`"

**Prompt 4.2 : Développement de la Page d'Accueil (`app/page.tsx`)**
"Développe la page d'accueil `app/page.tsx`. Cette page doit être un Server Component.
1.  Utilise la fonction `fetchPokemonList()` de `lib/data.ts` pour récupérer la liste des Pokémon.
2.  Affiche un titre principal pour le Pokédex.
3.  Affiche les Pokémon dans une grille responsive. Utilise Tailwind CSS pour la grille (ex: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6`).
4.  Pour chaque Pokémon dans la liste, utilise le composant `PokemonCardRenderer` pour l'afficher. Passe les données du Pokémon en props.
5.  Implémente le streaming pour l'affichage de la grille de Pokémon :
    * Utilise `React.Suspense`.
    * Crée un composant `components/LoadingSkeletonCard.tsx`. Ce squelette doit avoir des dimensions et une structure visuelle (ex: rectangles gris) similaires à `SimplePokemonCard.tsx` pour simuler le chargement d'une carte.
    * Affiche une grille de plusieurs `LoadingSkeletonCard.tsx` comme fallback pour `Suspense`.
Commit pour la structure de base et l'affichage : `feat(page): création de la page d'accueil responsive avec affichage des Pokémon`
Commit pour le streaming : `feat(ux): ajout du streaming et des squelettes de chargement sur la page d'accueil`"

**Prompt 4.3 : Développement de la Page de Détail (`app/pokemon/[numero]/page.tsx`)**
"Crée la page de détail dynamique `app/pokemon/[numero]/page.tsx`. Cette page doit être un Server Component.
1.  Elle doit accepter `params` (contenant `numero`) comme prop.
2.  Utilise la fonction `fetchPokemonDetail(params.numero)` de `lib/data.ts` pour récupérer les informations du Pokémon. Gère le cas où le Pokémon n'est pas trouvé (ex: afficher un message "Pokémon non trouvé" ou rediriger).
3.  Affiche les informations du Pokémon de manière responsive :
    * Nom du Pokémon (grand titre).
    * Numéro du Pokémon.
    * Image du Pokémon en grand format. Tu peux envisager d'utiliser `HoloPokemonCard` ici aussi (ou une version adaptée pour grand format) si le mode low-spec n'est pas actif, ou simplement une grande image statique.
    * Types du Pokémon (en utilisant `TypeBadge.tsx`).
    * Statistiques de base (PV, Attaque, Défense, Attaque Spéciale, Défense Spéciale, Vitesse) en utilisant `StatGauge.tsx` pour chaque statistique. Utilise les couleurs définies dans la charte graphique pour chaque jauge.
    * Applique des effets visuels subtils sur la page (ex: un fond de section légèrement teinté avec la couleur principale du type du Pokémon) conformément à la charte graphique.
4.  Assure une bonne mise en page responsive pour tous ces éléments.
Commit : `feat(page): création de la page de détail responsive d'un Pokémon`"

**Prompt 4.4 : Implémentation de la Navigation**
"Modifie le composant `PokemonCardRenderer.tsx` (ou les cartes qu'il rend, `HoloPokemonCard.tsx` et `SimplePokemonCard.tsx`) :
1.  Chaque carte affichée sur la page d'accueil doit être cliquable.
2.  Au clic, l'utilisateur doit être redirigé vers la page de détail du Pokémon correspondant (ex: `/pokemon/25` pour Pikachu).
3.  Utilise le composant `Link` de `next/link` pour cette navigation.
Ajoute également un lien "Retour à la liste" ou un fil d'Ariane sur la page de détail pour revenir facilement à la page d'accueil.
Commit : `feat(nav): implémentation de la navigation de la liste vers les détails Pokémon`"

---

### Phase 5 : Fonctionnalités de Filtrage et de Tri

**Prompt 5.1 : Ajout des Contrôles UI pour Filtre/Tri sur `app/page.tsx`**
"Sur la page d'accueil (`app/page.tsx`), au-dessus de la grille des Pokémon, ajoute les contrôles d'interface utilisateur suivants. Ces contrôles devront être dans un ou plusieurs Client Components.
1.  **Barre de Recherche :** Un champ `Input` (de shadcn/ui) pour permettre à l'utilisateur de rechercher un Pokémon par son nom ou son numéro.
2.  **Sélecteur de Type(s) :** Un composant `Select` ou un groupe de `Checkbox` (de shadcn/ui) pour filtrer par un ou plusieurs types. Peuple les options de type en utilisant la fonction `fetchTypes()` de `lib/data.ts`.
3.  **Sélecteur de Tri :** Un composant `Select` (de shadcn/ui) pour trier la liste des Pokémon selon :
    * Numéro (Croissant / Décroissant)
    * Nom (Alphabétique A-Z / Z-A)
    * PV (Croissant / Décroissant)
    * Attaque (Croissant / Décroissant)
    * Défense (Croissant / Décroissant)
    * Attaque Spéciale (Croissant / Décroissant)
    * Défense Spéciale (Croissant / Décroissant)
    * Vitesse (Croissant / Décroissant)
Assure-toi que ces contrôles sont responsives et bien présentés, notamment sur mobile (ils pourraient être regroupés ou cachés derrière un bouton "Filtres & Tri" sur petits écrans).
Commit : `feat(ui): ajout des contrôles de filtrage et de tri responsives sur la page d'accueil`"

**Prompt 5.2 : Implémentation de la Logique de Filtre/Tri**
"Implémente la logique de filtrage et de tri pour la page d'accueil (`app/page.tsx`). Cette logique sera gérée côté client (dans les Client Components contenant les contrôles).
1.  Utilise des états React (`useState`) pour gérer les valeurs actuelles des filtres (terme de recherche, types sélectionnés) et l'option de tri active.
2.  Lorsque l'utilisateur modifie un filtre ou une option de tri, la liste des Pokémon affichée doit se mettre à jour dynamiquement.
3.  Les filtres doivent pouvoir se combiner (ex: rechercher "pika" ET type "Électrik").
4.  Pour la persistance des filtres dans l'URL et la possibilité de partager des vues filtrées, utilise le hook `useSearchParams` de `next/navigation` pour lire et écrire les paramètres de filtre/tri dans l'URL.
5.  La liste des Pokémon (initialement récupérée par le Server Component `app/page.tsx`) sera passée en prop aux Client Components qui gèrent les filtres et l'affichage de la grille filtrée/triée.
Commit : `feat(feature): implémentation de la logique de filtrage et de tri des Pokémon`"

---

### Phase 6 : Effets Visuels et Animations Avancées (Peaufinage)

**Prompt 6.1 : Peaufinage des Effets et Animations**
"Revois les aspects visuels et les animations :
1.  **`HoloPokemonCard.tsx` :** Assure-toi que l'effet holographique est fluide, réactif et visuellement plaisant. Vérifie qu'il n'y a pas de problèmes de performance notables sur des configurations moyennes.
2.  **`StatGauge.tsx` :** Confirme que l'animation de remplissage est bien visible et fluide.
3.  **(Optionnel)** Si tu souhaites ajouter des transitions plus élaborées pour les changements de page ou l'apparition d'éléments, tu peux utiliser Framer Motion. Installe-le (`npm install framer-motion`) et applique des transitions subtiles.
Commit : `style(ux): peaufinage des animations et transitions`"

---

### Phase 8 : Optimisation et Validation Finale de la Responsivité

**Prompt 8.1 : Optimisation des Images**
"Vérifie que toutes les images du projet (Pokémon, placeholders) sont correctement optimisées en utilisant le composant `next/image`.
* Assure-toi que les props `width` et `height` (ou `fill`) sont correctement définies.
* Utilise la prop `priority` pour les images importantes au-dessus de la ligne de flottaison (ex: les premiers Pokémon de la liste, l'image principale sur la page de détail).
* Fournis la prop `sizes` lorsque pertinent, surtout pour les images responsives dans des grilles.
Commit : `perf: optimisation du chargement des images avec next/image`"

**Prompt 8.2 : Audit des Performances BDD/API (Conceptuel)**
"Bien que nous n'ayons pas d'API complexes ici (les données sont récupérées côté serveur), garde à l'esprit les bonnes pratiques pour les requêtes à la base de données :
* Sélectionne uniquement les colonnes nécessaires.
* Utilise des index appropriés dans la base de données (le fichier `pokedex.sql` devrait déjà en avoir, mais c'est un rappel).
* Évite les requêtes N+1.
(Pas de code à générer ici, juste une note pour de futurs développements ou si `lib/data.ts` devient plus complexe).
Commit (si des modifs sont faites à `lib/data.ts` suite à un audit) : `perf: audit et optimisation des requêtes de base de données`"

**Prompt 8.3 : Validation Finale de la Responsivité et Comportement Mobile**
"Effectue une validation finale et complète de la responsivité de l'application :
1.  Teste l'affichage et l'interactivité sur une gamme de largeurs d'écran (simulateur mobile de navigateur, redimensionnement manuel, et si possible sur de vrais appareils).
2.  Vérifie qu'il n'y a aucun débordement de contenu horizontal.
3.  Assure-toi que tous les textes sont lisibles et que les éléments interactifs (boutons, liens, contrôles de formulaire) ont des cibles tactiles suffisamment grandes et espacées sur mobile.
4.  **Comportement de `HoloPokemonCard` sur mobile :** L'effet de suivi de la souris ne fonctionnera pas.
    * Option 1 (Préférée pour la simplicité) : Sur les écrans tactiles (détectable via JS ou via des media queries CSS qui s'appliquent aux petites tailles), l'effet de rotation 3D basé sur la souris doit être désactivé. La carte peut rester statique ou avoir une animation de survol très simple (non dépendante de la souris). L'effet de brillance peut être statique ou cyclique de manière subtile.
    * Option 2 (Plus complexe) : Explorer l'utilisation du gyroscope de l'appareil (`DeviceOrientationEvent`) pour un effet 3D interactif sur mobile. Cela est optionnel et plus avancé.
    * Pour l'instant, concentre-toi sur une dégradation gracieuse de l'effet sur mobile : pas d'erreur, et la carte reste esthétique.
5.  Vérifie que `LowSpecToggle` est bien positionné, accessible et ne masque pas de contenu important sur les petits écrans.
Commit : `style(responsive): validation et peaufinage final de la responsivité sur mobile, tablette et bureau`"

---
**Fin de la Séquence de Prompts Initiale.**
L'assistant devrait maintenant avoir une application fonctionnelle et responsive. Les phases suivantes (IA, déploiement, tests plus poussés) peuvent faire l'objet de prompts ultérieurs.

