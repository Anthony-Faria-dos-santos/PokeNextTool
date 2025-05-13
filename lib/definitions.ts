export interface PokemonType {
  name: string;
  color: string;
}

export interface PokemonData {
  id: number; // id de la table pokemon
  nom: string;
  numero: number; // numero du pokémon (pour l'ordre et les images)
  pv: number;
  attaque: number;
  defense: number;
  attaque_spe: number;
  defense_spe: number;
  vitesse: number;
  types: PokemonType[];
}

export interface TypeInfo {
  id: number;
  name: string;
  color: string;
}
