export type Pokemon = {
  id: number;
  nom: string;
  pv: number;
  attaque: number;
  defense: number;
  attaque_spe: number;
  defense_spe: number;
  vitesse: number;
  numero: number;
};

export type Type = {
  id: number;
  name: string; // 'nom' dans votre JSON, mais 'name' est plus courant en anglais/TS
  color: string;
};

export type PokemonType = {
  id: number;
  pokemon_numero: number;
  type_id: number;
};

// Structure globale du fichier JSON
export type PokedexData = {
  pokemon: Pokemon[];
  type: Type[];
  pokemon_type: PokemonType[];
};