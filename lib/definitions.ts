// Définit la structure d'un type de Pokémon.
export interface PokemonType {
  name: string; // Nom du type, ex: "Feu", "Eau".
  color: string; // Code couleur hexa (sans '#') associé au type.
}

// Définit la structure des données complètes d'un Pokémon.
export interface PokemonData {
  id: number; // ID unique du Pokémon dans la base de données.
  nom: string; // Nom du Pokémon, ex: "Pikachu".
  numero: number; // Numéro officiel du Pokémon dans le Pokédex (pour l'ordre et les images).
  pv: number; // Points de Vie.
  attaque: number; // Statistique d'Attaque.
  defense: number; // Statistique de Défense.
  attaque_spe: number; // Statistique d'Attaque Spéciale.
  defense_spe: number; // Statistique de Défense Spéciale.
  vitesse: number; // Statistique de Vitesse.
  types: PokemonType[]; // Liste des types du Pokémon.
}

// Définit la structure pour les informations de base d'un type.
// Utilisé par exemple pour lister tous les types disponibles.
export interface TypeInfo {
  id: number; // ID unique du type.
  name: string; // Nom du type.
  color: string; // Code couleur hexa (sans '#').
}
