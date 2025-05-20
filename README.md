# PokeNextTool - Pokédex Next.js

Bienvenue sur PokeNextTool, une application web moderne de type Pokédex construite avec Next.js 15, TypeScript, et Tailwind CSS. Ce projet est une refonte et une amélioration d'un projet scolaire initialement développé avec EJS et Node.js.

**Lien StackBlitz pour démonstration :** [STACKBLITZ](https://stackblitz.com/github/Anthony-Faria-dos-santos/PokeNextTool)

## À propos du projet

PokeNextTool vise à offrir une expérience utilisateur fluide et réactive pour explorer l'univers des Pokémon. Il met en œuvre des fonctionnalités modernes de développement web, une architecture robuste grâce à Next.js App Router, et une gestion des données flexible.

Initialement un projet d'école utilisant une stack EJS/Node.js, cette version a été entièrement portée et modernisée avec les technologies suivantes :

- **Framework Frontend/Backend :** Next.js 15 (App Router)
- **Langage :** TypeScript
- **Styling :** Tailwind CSS & CSS Modules (avec une touche d'effets holographiques) Dédicace au travail exceptionnel de [Simon Goellner](https://poke-holo.simey.me/)
- **Composants UI :** shadcn/ui
- **Gestion des données :**
  - PostgreSQL (source primaire)
  - Fallback sur fichier JSON (`pokedex_export.json`) pour portabilité (notamment pour StackBlitz)
- **Validation de données :** Zod
- **Gestionnaire de paquets :** pnpm (avec workspaces)
- **Linting/Formatting :** ESLint (implicite avec les configurations Next.js modernes)

## Étapes clés du développement

Le développement de PokeNextTool a suivi plusieurs phases itératives, reflétées par l'historique des commits :

1.  **Initialisation et Configuration (Commits `28efd4d`, `687ee31`)**

    - Mise en place du projet Next.js.
    - Configuration initiale de TypeScript et des outils de base.

2.  **Accès aux Données et Premières Fonctionnalités (Commits `45324f9` à `2d6cb60`)**

    - Passage de `npm` à `pnpm` pour une meilleure gestion des dépendances.
    - Implémentation des fonctions de base pour récupérer les données Pokémon depuis une base de données PostgreSQL (`fetchPokemonList`, `fetchPokemonDetail`, `fetchTypes`).
    - Intégration de Zod pour la validation des données récupérées de la base.

3.  **Développement des Composants UI React (Commits `5f57262` à `01b00ea`, `b23945d`, `cd1a12a`, `a984ed9`, `b1783f6`)**

    - Création de composants réutilisables pour afficher les informations des Pokémon : `HoloPokemonCard`, `SimplePokemonCard`, `TypeBadge`, `StatGauge`.
    - Introduction de la bibliothèque de composants `shadcn/ui` et intégration de ses éléments.
    - Mise en place d'un contexte `LowSpecContext` pour gérer les performances graphiques (notamment les effets holographiques).

4.  **Améliorations de l'Interface Utilisateur et Fonctionnalités (Commits `3506efc` à `0b38364`, `ab85ef0` à `88e871f`, `ea46290` à `5a83800`, `9ecb596`)**

    - Navigation entre la liste des Pokémon et les pages de détail.
    - Création de la page de détail responsive.
    - Implémentation du filtrage et du tri des Pokémon sur la page d'accueil.
    - Mise en place d'un sélecteur de thème (clair/sombre) avec un provider personnalisé.
    - Refactorisation et améliorations du typage.
    - Externalisation et optimisation des styles CSS.

5.  **Optimisation et Portabilité (StackBlitz) (Commits `5bab240`, `72340e9`)**

    - **Implémentation d'un fallback JSON** : C'est une étape cruciale pour assurer la consultation du projet sur des plateformes comme StackBlitz où une connexion à une base de données PostgreSQL n'est pas toujours aisée à configurer pour un simple aperçu. Si la connexion à la base de données échoue (ou si les variables d'environnement ne sont pas définies), l'application charge désormais les données depuis un fichier `pokedex_export.json` local.
    - Nettoyage du code et mise à jour des commentaires pour une meilleure lisibilité.

6.  **Maintenance et Qualité du Code (Commits `865009f`, `c02c958`, `7cffdcd`, `a565d03`, `e723f3d`, `de736d1`, `9e95650`, `00cfd36`, `dfe79d3`)**
    - Harmonisation du style des commentaires.
    - Mises à jour des dépendances et configurations (`pnpm-lock.yaml`, `tsconfig.json`).
    - Suppression de code inutile et résolution d'avertissements TypeScript.

## Fonctionnalités actuelles

- Affichage de la liste des 151 premiers Pokémon avec leurs informations de base et types.
- Page de détail pour chaque Pokémon affichant ses statistiques.
- Cartes Pokémon avec un effet holographique (simplifié).
- Filtrage des Pokémon par type et par nom.
- Tri des Pokémon par numéro, nom, PV, attaque, défense.
- Sélecteur de thème (clair/sombre).
- Mode "Low Spec" pour désactiver les effets graphiques coûteux.
- Fallback sur données JSON pour une consultation sans base de données.

## Objectif StackBlitz

Un effort particulier a été réalisé pour rendre ce projet facilement consultable sur StackBlitz. La principale mesure a été l'implémentation d'un système de **fallback pour la source de données** (commit `5bab240`). Si l'application ne parvient pas à se connecter à la base de données PostgreSQL (ce qui est le cas par défaut dans un environnement comme StackBlitz sans configuration manuelle approfondie), elle se rabat sur la lecture d'un fichier `pokedex_export.json` inclus dans le dépôt. Cela permet à quiconque d'ouvrir le projet sur StackBlitz et de voir l'application fonctionner avec un jeu de données complet sans avoir à configurer une base de données externe.

## Feuille de route et Améliorations futures

PokeNextTool est un projet en constante évolution. Voici quelques pistes d'amélioration et fonctionnalités envisagées pour l'avenir :

- **Intégration de l'API officielle des cartes Pokémon TCG :** Pour afficher les véritables illustrations des cartes.
- **Profils utilisateurs et Decks :** Permettre aux utilisateurs de créer des comptes, de sauvegarder leurs Pokémon favoris et de construire des decks.
- **Amélioration du Design Général :** Moderniser davantage l'interface utilisateur et l'expérience globale.
- **Effets Holographiques Avancés :** Explorer des techniques CSS/JS plus poussées pour un rendu holographique plus fidèle et interactif.
- **Optimisation Mobile :** Bien que responsive, une attention plus spécifique à l'expérience mobile est nécessaire.
- **Sécurité :** Audit approfondi des aspects de sécurité, notamment si des fonctionnalités de comptes utilisateurs sont ajoutées (XSS, CSRF, etc.).
- **Nouvelles Fonctionnalités :** Comparateur de Pokémon, informations sur les évolutions, localisations, etc.
- **Tests :** Implémentation de tests unitaires et d'intégration pour assurer la stabilité du code.
- **Refactoring :** (Comme noté dans `lib/data.ts`) Séparer davantage les logiques d'accès aux données (DB vs JSON) pour une meilleure modularité.

## Installation et Lancement Local

1.  **Prérequis :**

    Node.js v18.17 minimum --> Next.js 15
    - pnpm (`npm install -g pnpm`)
    - Dans l'idéal PostgreSQL (serveur installé et en cours d'exécution)
    - Au pire sans postgres vous aurez une expérience fonctionnelle mais dégradée (fallback json) au fur et à mesure de l'avancement du projet.

2.  **Cloner le dépôt :**

    ```bash
    git clone [URL_DU_DEPOT_GIT]
    cd [Votre_Dossier_favori]
    # Le clonage du dépôt créera automatiquement un dossier pokenexttool.
    ```

3.  **Installer les dépendances du projet :**

    ```bash
    pnpm install
    ```

4.  **Configuration de la base de données PostgreSQL :**

    - **Accéder à `psql` :** Ouvrez votre terminal et connectez-vous à PostgreSQL. Selon votre configuration, cela peut être simplement `psql` ou nécessiter des options pour l'utilisateur et l'hôte. Par exemple :

      ```bash
      psql -U postgres
      # Ou pour un utilisateur spécifique : psql -U votre_utilisateur -d postgres
      ```

    - **Créer la base de données :** Une fois dans l'interface `psql`, créez la base de données (par exemple, nommée `pokedex_db`).

      ```sql
      CREATE DATABASE pokedex_db;
      ```

      Quittez `psql` pour le moment (`\q`).

    - **Importer les données (Seeding) :** Assurez-vous que le fichier `pokedex.sql` (contenant la structure des tables et les données initiales) se trouve bien à la racine du projet cloné. Exécutez la commande suivante depuis la racine de votre projet dans votre terminal (pas dans `psql`) pour peupler la base de données que vous venez de créer. Remplacez `pokedex_db` par le nom de votre base de données si différent, et `postgres` par votre nom d'utilisateur PostgreSQL.
      ```bash
      psql -U postgres -d pokedex_db -f pokedex.sql
      # S'il demande un mot de passe, saisissez-le.
      # Si votre utilisateur est différent, utilisez : psql -U votre_utilisateur -d pokedex_db -f pokedex.sql
      ```
      Cette commande exécute le script SQL contenu dans `pokedex.sql` sur la base de données `pokedex_db`.

5.  **Configuration de l'environnement :**

    - À la racine de votre projet, créez un fichier `.env.local` (s'il n'existe pas déjà, vous pouvez copier le `.env.example` fourni, le renommer et le compléter).
    - Ajoutez et configurez les variables d'environnement pour la connexion à votre base de données PostgreSQL. Par exemple :
      ```plaintext
      PGHOST=localhost
      PGUSER=postgres # Ou votre nom d'utilisateur PostgreSQL
      PGPASSWORD=votre_mot_de_passe # Le mot de passe de votre utilisateur PostgreSQL
      PGDATABASE=pokedex_db # Le nom de la base de données que vous avez créée
      PGPORT=5432 # Le port par défaut de PostgreSQL
      ```
    - **Note :** Si ces variables ne sont pas définies ou si la connexion échoue, l'application utilisera automatiquement le fallback JSON (`pokedex_export.json`), permettant un fonctionnement sans base de données.

6.  **Lancer le serveur de développement :**
    ```bash
    pnpm dev
    ```
    Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur. L'application devrait maintenant se connecter à votre base de données PostgreSQL locale si configurée, sinon elle utilisera les données JSON.

---

Merci d'avoir exploré PokeNextTool et n'hésitez pas à repasser de temps en temps pour suivre son évolution !
