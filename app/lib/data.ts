import { sql } from "@vercel/postgres";
import { Pokemon, Type, PokemonType, PokedexData } from "./definitions";
import fs from "fs";
import path from "path";

// Chemin vers votre fichier JSON
const JSON_DATA_PATH = path.join(process.cwd(), "pokedex_export.json");

// Interface for the raw type structure in JSON if 'nom' is used instead of 'name'
interface RawType {
  id: number;
  nom: string; // 'nom' as it appears in the JSON
  color: string;
}

// Interface for the raw Pokedex data structure as read from JSON
interface RawPokedexData {
  pokemon: Pokemon[];
  type: RawType[]; // Uses RawType for the type array
  pokemon_type: PokemonType[];
}

async function fetchPokedexDataFromDb(): Promise<PokedexData | null> {
  try {
    console.log("Fetching data from database...");
    const pokemonData =
      await sql<Pokemon>`SELECT * FROM pokemon ORDER BY numero;`;
    const typeData =
      await sql<Type>`SELECT id, nom as name, color FROM type ORDER BY id;`; // Assurez-vous que 'nom' est aliasé en 'name'
    const pokemonTypeData =
      await sql<PokemonType>`SELECT * FROM pokemon_type ORDER BY id;`;

    // Simule une erreur si aucune donnée n'est retournée pour tester le fallback
    if (pokemonData.rows.length === 0) {
      console.warn("No data returned from DB, attempting fallback to JSON.");
      return null;
    }

    return {
      pokemon: pokemonData.rows,
      type: typeData.rows,
      pokemon_type: pokemonTypeData.rows,
    };
  } catch (error) {
    console.error("Database fetch failed:", error);
    return null; // Retourne null pour indiquer qu'il faut utiliser le fallback
  }
}

async function fetchPokedexDataFromJson(): Promise<PokedexData | null> {
  // Modifié pour retourner PokedexData | null
  try {
    console.log("Fetching data from JSON file...");
    const fileContents = fs.readFileSync(JSON_DATA_PATH, "utf8");
    const rawData = JSON.parse(fileContents) as RawPokedexData;

    const mappedTypes: Type[] = rawData.type.map((t) => ({
      id: t.id,
      name: t.nom,
      color: t.color,
    }));

    return {
      pokemon: rawData.pokemon,
      type: mappedTypes,
      pokemon_type: rawData.pokemon_type,
    };
  } catch (error) {
    console.error("JSON data fetch failed:", error);
    // En cas d'échec de lecture du JSON, nous n'avons plus de fallback.
    // Il faut décider quoi faire : lancer l'erreur ou retourner null/un objet vide.
    // Pour Stackblitz, si le JSON est la seule source, une erreur ici est critique.
    // Renvoyer null ici signifie que getPokedexData pourrait retourner null.
    return null;
  }
}

export async function getPokedexData(): Promise<PokedexData> {
  // La signature reste Promise<PokedexData> pour l'instant
  let data = await fetchPokedexDataFromDb();
  if (!data) {
    console.log(
      "Failed to fetch from DB or DB is empty, falling back to JSON."
    );
    data = await fetchPokedexDataFromJson();
  }
  // Si data est toujours null ici (DB et JSON ont échoué), que faire ?
  // Pour l'instant, on suppose qu'au moins une source fonctionne.
  // Si le JSON est critique pour StackBlitz, et qu'il échoue, l'application ne peut pas fonctionner.
  if (!data) {
    // C'est un cas critique. Soit le JSON est manquant/corrompu.
    // Il est préférable de lancer une erreur claire ici pour le débogage.
    throw new Error(
      "Failed to fetch data from both database and JSON fallback. JSON file might be missing or corrupted."
    );
  }
  return data;
}

// Fonctions spécifiques pour obtenir des parties des données si nécessaire

export async function getAllPokemon(): Promise<Pokemon[]> {
  const data = await getPokedexData();
  return data.pokemon;
}

export async function getAllTypes(): Promise<Type[]> {
  const data = await getPokedexData();
  // Le mappage est maintenant fait dans fetchPokedexDataFromJson si le fallback est utilisé
  // et par l'alias SQL si la base de données est utilisée.
  return data.type;
}

export async function getPokemonTypes(): Promise<PokemonType[]> {
  const data = await getPokedexData();
  return data.pokemon_type;
}

// Exemple d'une fonction qui récupère un Pokémon spécifique par son numéro
export async function getPokemonByNumero(
  numero: number
): Promise<Pokemon | undefined> {
  const allPokemon = await getAllPokemon();
  return allPokemon.find((p) => p.numero === numero);
}

// Exemple d'une fonction qui récupère les types d'un Pokémon
export async function getTypesForPokemon(
  pokemonNumero: number
): Promise<Type[]> {
  const allTypes = await getAllTypes();
  const pokemonTypeEntries = await getPokemonTypes();

  const typeIdsForPokemon = pokemonTypeEntries
    .filter((pt) => pt.pokemon_numero === pokemonNumero)
    .map((pt) => pt.type_id);

  return allTypes.filter((t) => typeIdsForPokemon.includes(t.id));
}
