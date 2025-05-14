# PokeNextTool - Cahier des Charges & Charte Graphique (v5 - Complet et Consolidé)

## 1. Cahier des Charges

### 1.1. Introduction

Le projet "PokeNextTool" vise à développer un Pokédex de nouvelle génération, offrant une expérience utilisateur moderne, fluide, et interactive. Il se concentrera sur les 151 premiers Pokémon. Ce document sert de guide exhaustif pour l'assistant IA chargé du développement.
**Objectif pour l'assistant :** Implémenter les fonctionnalités décrites en utilisant les composants et la structure spécifiés, en portant une attention particulière à la charte graphique, à la responsivité, et aux bonnes pratiques de développement.

### 1.2. Objectifs du Projet

- **Informatif et Complet :** Afficher les informations essentielles (statistiques, types) des 151 premiers Pokémon.
- **Moderne et Fluide :** Proposer une interface utilisateur épurée, rapide et agréable à naviguer, avec des effets de chargement et des animations soignées, ciblant un public adulte.
- **Interactif :** Permettre aux utilisateurs de filtrer, trier et explorer les Pokémon de manière dynamique.
- **Visuellement Attrayant :** Mettre en valeur les Pokémon avec des images de haute qualité et des effets visuels contextuels, notamment un effet holographique interactif sur les cartes.
- **Performant et Accessible :** Offrir un mode "basse spécification" (low spec) optionnel pour les utilisateurs ayant des configurations matérielles moins puissantes, désactivant les effets gourmands en ressources.
- **Entièrement Responsive :** Garantir une expérience utilisateur optimale sur mobile, tablette et bureau.
- **Techniquement Solide :** Utiliser un stack technologique moderne et des bonnes pratiques de développement, incluant une gestion de version rigoureuse.

### 1.3. Technologies et Éléments Fournis

- **Framework Frontend :** Next.js (App Router)
- **Bibliothèque UI :** React (avec Context API pour la gestion d'état simple)
- **Styling :** Tailwind CSS, CSS personnalisé pour effets spécifiques.
- **Composants UI :** shadcn/ui
- **Validation de Données :** Zod
- **Base de Données :** PostgreSQL. Les identifiants de connexion sont configurés via les variables d'environnement dans `.env` et `.env.local`. Le schéma est défini dans `pokedex.sql`. La base de données `pokedex` est considérée comme active et peuplée.
- **Images :**
  - Pokémon : `public/images/pokemon/1.png` à `public/images/pokemon/151.png`.
  - Placeholder : `public/images/pokeball_placeholder.gif`.
- **Fichier de Base pour Composants :**
  - **`docs/pokemonCardComponents.tsx` :** Ce fichier contient le code source TypeScript/React regroupé pour `HoloPokemonCard`, `SimplePokemonCard`, `LowSpecContext`, `LowSpecToggle`, et `PokemonCardRenderer`. **L'assistant DOIT utiliser ce fichier comme référence principale pour créer chaque composant individuel dans son emplacement correct (voir section "Structure du Projet et Étapes de Développement"), ajuster les imports/exports et s'assurer de leur bon fonctionnement.**
- **Variables d'environnement (déjà configurées) :**
  - `PORT=3000`
  - `PG_URI="postgres://postgres:postgres@localhost/pokedex"`
  - `PGUSER="postgres"`
  - `PGHOST="localhost"`
  - `PGDATABASE="pokedex"`
  - `PGPASSWORD="postgres"`
  - `PGPORT="5432"`
  - `NEXT_PUBLIC_API_URL="http://localhost:3000"`
- **Déploiement Cible (informatif) :** Heroku (ou Vercel)
- **Fonctionnalités IA (Optionnel) :** Vercel AI SDK
- **Runtime Edge (Optionnel pour optimisations) :** Vercel Edge Runtime

### 1.4. Structure de la Base de Données (Rappel)

- **Table `pokemon`**: `id`, `nom`, `pv`, `attaque`, `defense`, `attaque_spe`, `defense_spe`, `vitesse`, `numero`.
- **Table `type`**: `id`, `name`, `color` (hex sans `#`).
- **Table `pokemon_type`**: `id`, `pokemon_numero`, `type_id`.
  L'assistant devra créer les requêtes SQL nécessaires, notamment avec des jointures, pour récupérer toutes les informations.

### 1.5. Fonctionnalités Principales à Implémenter

1.  **Affichage de la Liste des Pokémon (Page d'Accueil) :**

    - Grille responsive affichant les 151 Pokémon.
    - Chaque Pokémon est rendu via `PokemonCardRenderer` (choix entre `HoloPokemonCard` ou `SimplePokemonCard`).
    - Effets de streaming (Squelettes de chargement `LoadingSkeletonCard.tsx`) pendant la récupération des données.
    - Pagination ou défilement infini pour la navigation.

2.  **Page de Détail du Pokémon :**

    - Accessible en cliquant sur un Pokémon.
    - Affichage responsive de l'image du Pokémon (potentiellement avec effet holographique si mode normal).
    - Informations complètes : Nom, Numéro, Types (avec `TypeBadge.tsx`), Statistiques (PV, Attaque, Défense, Attaque Spéciale, Défense Spéciale, Vitesse) affichées avec des `StatGauge.tsx` animées.
    - Effets visuels sur la page en fonction du/des type(s) du Pokémon (voir Charte Graphique).

3.  **Système de Filtrage et de Tri (sur la Page d'Accueil) :**

    - **Filtrage (combinable) :**
      - Par type(s) : Sélection multiple.
      - Par nom/numéro : Barre de recherche.
    - **Tri (combinable) :**
      - Par numéro (croissant/décroissant).
      - Par nom (alphabétique A-Z / Z-A).
      - Par statistique (PV, Attaque, etc., croissant/décroissant).
    - Mise à jour dynamique de la liste. Contrôles UI responsives.

4.  **Mode Basse Spécification (Low Spec Mode) :**

    - Bouton de bascule `LowSpecToggle.tsx` (accessible globalement).
    - Gestion d'état via `LowSpecContext.tsx`.
    - Rendu conditionnel des cartes Pokémon via `PokemonCardRenderer.tsx`.

5.  **Effets Visuels et Animations Générales :**
    - Transitions fluides entre les pages et lors de l'affichage de nouveaux contenus.
    - Micro-interactions sur les éléments cliquables (boutons, etc.).
    - Effets de survol (en complément de l'effet holographique).

### 1.6. Structure du Projet et Étapes de Développement (Guide pour l'Assistant)

**Phase 1 : Configuration Initiale et Fondations**

- **Tâches :**
  1.  Vérifier la configuration Next.js/Tailwind.
  2.  Créer/Vérifier la structure des dossiers : `app/`, `components/`, `contexts/`, `lib/`, `styles/` (pour CSS global/spécifique si besoin).
  3.  Installer les dépendances : `pg` (pour PostgreSQL), `lucide-react` (pour icônes).
      - _Commit : `chore: installation des dépendances (pg, lucide-react)`_

**Phase 2 : Modélisation des Données et Accès aux Données**

- **Tâches :**
  1.  Créer `lib/data.ts` :
      - `fetchPokemonList()`: Récupère tous les Pokémon avec leurs types/couleurs. Structure de retour attendue :
        ```typescript
        interface PokemonData {
          id: number;
          nom: string;
          numero: number;
          pv: number;
          attaque: number;
          defense: number;
          attaque_spe: number;
          defense_spe: number;
          vitesse: number;
          types: { name: string; color: string }[];
        }
        ```
      - `fetchPokemonDetail(numero: number)`: Détails d'un Pokémon.
      - `fetchTypes()`: Liste des types distincts (nom, couleur).
      - _Commits : `feat(data): implémentation de fetchPokemonList pour récupérer les Pokémon avec leurs types`, `feat(data): implémentation de fetchPokemonDetail pour un Pokémon spécifique`, `feat(data): implémentation de fetchTypes pour lister les types`_
  2.  (Optionnel) Définir les schémas Zod dans `lib/definitions.ts` ou `lib/data.ts`.
      - _Commit : `feat(data): ajout de la validation Zod pour les données Pokémon`_

**Phase 3 : Composants React (Utilisation de `docs/pokemonCardComponents.tsx` et Création)**

- **Tâches :**
  1.  **Créer les composants à partir de `docs/pokemonCardComponents.tsx` :**
      - Placer `HoloPokemonCard.tsx` dans `components/`.
      - Placer `SimplePokemonCard.tsx` dans `components/`.
      - Placer `LowSpecContext.tsx` dans `contexts/`.
      - Placer `LowSpecToggle.tsx` dans `components/`.
      - Placer `PokemonCardRenderer.tsx` dans `components/`.
      - Ajuster tous les imports/exports internes et externes.
      - _Commit : `feat(ui): création des composants HoloPokemonCard, SimplePokemonCard, LowSpecContext, LowSpecToggle, PokemonCardRenderer à partir de la base fournie`_
  2.  Créer `components/TypeBadge.tsx` (Props: `name`, `color`).
      - _Commit : `feat(ui): création du composant TypeBadge`_
  3.  Créer `components/StatGauge.tsx` (Props: `label`, `value`, `maxValue`, `color`). Utiliser `Progress` de shadcn/ui, animer.
      - _Commit : `feat(ui): création du composant StatGauge avec animation`_
  4.  Vérifier/Adapter `SimplePokemonCard.tsx` et `HoloPokemonCard.tsx` :
      - Doivent utiliser `TypeBadge.tsx` (ou style équivalent).
      - Cohérence des dimensions. `HoloPokemonCard.tsx` doit être autonome pour la grille.
      - _Commit : `refactor(ui): ajustement de SimplePokemonCard et HoloPokemonCard pour cohérence et responsivité`_

**Phase 4 : Pages Principales et Navigation (Responsive)**

- **Tâches :**
  1.  Mettre à jour `app/layout.tsx` :
      - Intégrer `LowSpecProvider`, `LowSpecToggle` (global), polices (Inter, Poppins, Roboto Mono via `next/font/google`), `ThemeProvider` (shadcn/ui).
      - Assurer la présence de `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
      - _Commit : `feat(app): configuration du RootLayout avec LowSpecProvider, LowSpecToggle, polices et viewport`_
  2.  Développer `app/page.tsx` (Page d'accueil responsive) :
      - Utiliser `fetchPokemonList()`.
      - Grille responsive (ex: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6`) utilisant `PokemonCardRenderer`.
      - Streaming avec `React.Suspense` et `LoadingSkeletonCard.tsx` (à créer, dimensions similaires aux cartes).
      - _Commit : `feat(page): création de la page d'accueil responsive avec affichage des Pokémon`_
      - _Commit : `feat(ux): ajout du streaming et des squelettes de chargement sur la page d'accueil`_
  3.  Développer `app/pokemon/[numero]/page.tsx` (Page de détail responsive) :
      - Utiliser `fetchPokemonDetail()`.
      - Affichage responsive des informations.
      - _Commit : `feat(page): création de la page de détail responsive d'un Pokémon`_
  4.  Navigation avec `next/link` depuis les cartes vers les détails.
      - _Commit : `feat(nav): implémentation de la navigation de la liste vers les détails Pokémon`_

**Phase 5 : Fonctionnalités de Filtrage et de Tri (Responsive sur `app/page.tsx`)**

- **Tâches :**
  1.  Ajouter les contrôles UI responsives (shadcn/ui `Input`, `Select`, `Checkbox`).
      - _Commit : `feat(ui): ajout des contrôles de filtrage et de tri responsives`_
  2.  Implémenter la logique de filtrage/tri (client-side pour 151 Pokémon est acceptable, ou Server Actions). Gérer l'état avec `useState`/`useSearchParams`.
      - _Commit : `feat(feature): implémentation de la logique de filtrage et de tri des Pokémon`_

**Phase 6 : Effets Visuels et Animations Avancées (Peaufinage)**

- **Tâches :**
  1.  Peaufiner `HoloPokemonCard.tsx`.
  2.  Vérifier animation `StatGauge.tsx`.
  3.  (Optionnel) Transitions de page CSS/Framer Motion.
      - _Commit : `style(ux): peaufinage des animations et transitions`_

**Phase 7 : Intégration Vercel AI SDK (Optionnel - Basse Priorité)**

**Phase 8 : Optimisation et Validation Finale de la Responsivité**

- **Tâches :**
  1.  Optimiser les images (`next/image` avec `priority`, `sizes`).
      - _Commit : `perf: optimisation du chargement des images avec next/image`_
  2.  Vérifier et optimiser les requêtes BDD/API.
      - _Commit : `perf: audit et optimisation des requêtes de base de données`_
  3.  **Validation Finale de la Responsivité :**
      - Tester intensivement sur mobile, tablette, bureau.
      - Pas de débordement, lisibilité, cibles tactiles adéquates.
      - Comportement de `HoloPokemonCard` sur mobile (désactivation du suivi souris si non géré, ou effet simplifié).
      - Accessibilité et positionnement de `LowSpecToggle` sur petits écrans.
      - _Commit : `style(responsive): validation et peaufinage final de la responsivité sur mobile, tablette et bureau`_

**Phase 9 : Déploiement et Maintenance (Informatif)**

- Préparer pour la production.
- Mettre à jour `README.md`.

## 2. Charte Graphique

### 2.1. Objectif

Créer une identité visuelle moderne, mature, et engageante, mettant en valeur les Pokémon pour un public adulte. L'interactivité (transitions, animations subtiles, effet holographique) est clé.

### 2.2. Palette de Couleurs

- **Couleur Primaire (Navigation, Accents Majeurs) :**
  - Bleu Nuit Profond : `#1A2A4D` (Pour en-têtes, pieds de page, éléments de navigation)
  - Alternative : Gris Anthracite : `#2D3748`
- **Couleur Secondaire (Fonds de Carte, Sections Claires) :**
  - Gris Perle : `#F7FAFC` (Pour fonds des cartes Pokémon en mode simple, sections de contenu)
  - Blanc Cassé : `#EDF2F7`
- **Couleurs d'Accent (Boutons d'Action, Éléments Interactifs) :**
  - Orange Corail : `#F56565` (Pour boutons "Voir Détails", actions importantes)
  - Ambre Foncé : `#DD6B20`
- **Couleurs des Types Pokémon :** Issues de la BDD (colonne `color` table `type`), préfixées par `#`. Utilisées pour badges, lueurs, etc.
- **Couleurs de Texte :**
  - Texte Principal : `#2D3748` (Gris très foncé)
  - Titres : `#1A202C` (Noir doux)
  - Texte Secondaire/Placeholder : `#718096` (Gris moyen)
- **Couleurs pour Jauges de Statistiques (`StatGauge.tsx`) :**
  - PV : `#48BB78` (Vert)
  - Attaque : `#F56565` (Rouge/Corail)
  - Défense : `#4299E1` (Bleu)
  - Attaque Spéciale : `#9F7AEA` (Violet)
  - Défense Spéciale : `#38B2AC` (Cyan/Turquoise)
  - Vitesse : `#ECC94B` (Jaune)
- **Couleurs pour Effet Holographique (`HoloPokemonCard.tsx`) :**
  - Les reflets s'inspireront des couleurs spectrales (variables `--red`, `--yel`, etc. dans le CSS de base) ou métalliques, avec une intensité et une saturation ajustées pour un rendu mature.
  - La variable `--glow` (utilisée pour l'ombre de la carte active) peut être dynamiquement liée à la couleur principale du type du Pokémon.

### 2.3. Typographie

L'objectif est une typographie lisible, moderne, avec une touche stylisée rappelant l'univers Pokémon, mais adaptée à un public adulte. Des effets de transition subtils sur le texte (ex: couleur au survol) peuvent améliorer l'interactivité.

- **Police pour les Titres (Noms de Pokémon, Titres de Section) :**
  - **Poppins** (Google Font) : Graisses SemiBold (600), Bold (700).
  - Effets : Léger `letter-spacing: 0.025em;`. Transition douce sur la couleur au survol pour les titres interactifs.
- **Police pour le Corps de Texte (Descriptions, Labels, Statistiques) :**
  - **Inter** (Google Font) : Graisses Regular (400), Medium (500).
  - Effets : Apparition en fondu (`opacity`, `transform: translateY(3px)`) pour les blocs de texte lors du chargement.
- **Police pour les Numéros de Pokémon / Données Chiffrées :**
  - **Roboto Mono** (Google Font) : Pour un aspect "data" clair.

### 2.4. Styles des Composants (shadcn/ui comme base, personnalisation via Tailwind/CSS)

- **Boutons (`Button` de shadcn/ui) :**
  - **Primaire :** Fond `Orange Corail (#F56565)`, texte blanc, coins `rounded-md`, légère ombre et `transform: scale(0.97)` au clic/actif, transition douce.
  - **Secondaire :** Fond `Gris Perle (#F7FAFC)` ou transparent, bordure `Bleu Nuit Profond (#1A2A4D)`, texte `Bleu Nuit Profond`. Au survol, fond `Bleu Nuit Profond` et texte blanc.
- **Cartes Pokémon (`HoloPokemonCard.tsx`, `SimplePokemonCard.tsx`) :**
  - **`SimplePokemonCard.tsx` :** Fond `Gris Perle (#F7FAFC)`. Bordure `1px solid #E2E8F0`. Ombre `shadow-md`, augmentant à `shadow-lg` au survol. Image avec léger zoom au survol. Infos (nom, numéro, types) lisibles.
  - **`HoloPokemonCard.tsx` :** Structure et effets définis dans `docs/pokemonCardComponents.tsx`. La carte doit être visuellement impactante, avec des reflets holographiques réagissant à la souris. Les dimensions doivent être cohérentes avec `SimplePokemonCard`.
  - **Contenu Textuel sur Cartes :** Positionné de manière lisible, en utilisant les polices et couleurs définies.
- **Jauges de Statistiques (`StatGauge.tsx` avec `Progress` de shadcn/ui) :**
  - Fond de jauge : `Gris Clair (#E2E8F0)`. Barre de progression avec couleurs spécifiques (voir palette). Animation de remplissage fluide.
- **Inputs et Selects (shadcn/ui) :**
  - Style par défaut de shadcn/ui, avec couleurs de bordure/focus alignées sur la palette (ex: `Bleu Nuit Profond` pour le focus).

### 2.5. Effets Visuels Spécifiques par Type de Pokémon (sur Page de Détail principalement)

Ces effets utiliseront la couleur hexadécimale de la table `type`.

- **Arrière-plan de la section image (Page Détail) :** Dégradé radial/linéaire très subtil utilisant la/les couleur(s) du/des type(s).
- **Titres de section (Page Détail) :** Le nom du type dans un titre pourrait être coloré avec la couleur du type.
- **Badges de Type (`TypeBadge.tsx`) :** Fond utilisant la couleur du type, texte contrastant.

## 3. Conseils pour le Développement avec un Assistant IA (Rappel Exhaustif)

- **Source des Composants :** **Utiliser impérativement `docs/pokemonCardComponents.tsx` comme point de départ pour `HoloPokemonCard`, `SimplePokemonCard`, `LowSpecContext`, `LowSpecToggle`, `PokemonCardRenderer`.** L'assistant doit séparer ce code en fichiers individuels, les placer correctement, et gérer les imports/exports.
- **Commentaires Clairs et Précis pour l'IA :**
  - Exemple : `// IA: Génère la logique JavaScript pour l'effet holographique basé sur la position de la souris, mettant à jour les variables CSS --mx, --my, --rx, --ry.`
  - Exemple : `// IA: Adapte ce CSS pour que le clip-path de .holo-card-shine-overlay corresponde à la zone de l'image du Pokémon.`
- **Diviser en Petites Tâches :** Demander à l'IA de réaliser des tâches spécifiques et gérables.
- **Demander des Snippets de Code :** Pour des fonctionnalités spécifiques ou des algorithmes.
- **Utiliser l'IA pour le Débogage :** Coller des extraits de code problématiques et demander de l'aide.
- **Optimisation :** Demander des suggestions d'optimisation.
- **Commits Conventionnels :** **Très important : Réaliser chaque commit au fur et à mesure, en français, selon la règle des "Conventional Commits" (`feat:`, `fix:`, `style:`, `refactor:`, `chore:`, `docs:`, `test:`, `perf:`), avec des descriptions claires et concises.**
- **Syntaxe ES6+ / TypeScript :** Utiliser la syntaxe JavaScript/TypeScript moderne pour tout le projet.
- **Rédaction Réaliste :** La rédaction du code, des commentaires et des messages de commit doit être réaliste et ne jamais donner l'impression d'avoir été faite par une IA (noms de variables clairs, commentaires expliquant le "pourquoi" et pas seulement le "comment").
- **Priorité des Tâches :** Données -> Affichage Liste/Détail (Responsive) -> Filtres/Tris (Responsive) -> Peaufinage Visuel.
- **Responsivité :** La responsivité est un critère clé à chaque étape. Utiliser les classes responsives de Tailwind CSS (`sm:`, `md:`, `lg:`, `xl:`) abondamment. Tester fréquemment.
