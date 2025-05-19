import dotenv from "dotenv";
dotenv.config(); // Charge les variables d'environnement depuis .env

import { Pool } from "pg";
import fs from "fs";
import path from "path";

// Types de données de l'application
import {
  PokemonData,
  PokemonType as PokemonTypeDefinition,
  TypeInfo,
} from "./definitions";
// Schémas de validation Zod
import { PokemonListSchema, TypeInfoListSchema } from "./schemas";

// --- Types pour la structure du fichier pokedex_export.json ---
// Note : Ces types pourraient être centralisés dans ./definitions.ts
type JsonPokemon = {
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

type JsonType = {
  id: number;
  name: string;
  color: string;
};

type JsonPokemonTypeLink = {
  id: number;
  pokemon_numero: number;
  type_id: number;
};

// Structure globale attendue du fichier JSON
type PokedexJsonStructure = {
  pokemon: JsonPokemon[];
  type: JsonType[];
  pokemon_type: JsonPokemonTypeLink[];
};
// --- Fin des types JSON ---

// Chemin vers le fichier de données JSON (fallback)
const JSON_DATA_PATH = path.join(process.cwd(), "pokedex_export.json");

// Pool de connexions PostgreSQL (peut rester undefined si la connexion échoue)
let pool: Pool | undefined;

// Tentative d'initialisation du pool de connexions PostgreSQL
try {
  // Initialiser uniquement si les variables d'environnement essentielles sont présentes
  if (process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE) {
    pool = new Pool();
    console.log("PostgreSQL: Pool de connexions initialisé.");
  } else {
    console.warn(
      "PostgreSQL: Variables d'environnement manquantes. Passage au fallback JSON."
    );
    // pool reste undefined
  }
} catch (error) {
  console.warn(
    "PostgreSQL: Erreur d'initialisation du pool. Utilisation du fallback JSON.",
    error
  );
  // pool reste undefined
}

// Cache pour les données lues depuis le fichier JSON
let cachedJsonData: PokedexJsonStructure | null = null;
let jsonReadAttempted = false; // Indicateur pour éviter les lectures multiples

/**
 * Lit et parse les données depuis le fichier JSON `pokedex_export.json`.
 * Met en cache le résultat pour les appels suivants.
 * @returns {PokedexJsonStructure | null} Les données parsées ou null en cas d'erreur.
 */
function getJsonDataFromFile(): PokedexJsonStructure | null {
  if (jsonReadAttempted) {
    return cachedJsonData; // Utilise le cache si disponible
  }
  jsonReadAttempted = true;

  try {
    console.log("JSON Fallback: Lecture depuis:", JSON_DATA_PATH);
    const fileContents = fs.readFileSync(JSON_DATA_PATH, "utf8");
    console.log("JSON Fallback: Fichier lu.");
    const parsedData = JSON.parse(fileContents) as PokedexJsonStructure;
    console.log("JSON Fallback: Données parsées.");

    // Vérification minimale de la structure du JSON
    if (
      !parsedData ||
      !parsedData.pokemon ||
      !parsedData.type ||
      !parsedData.pokemon_type
    ) {
      console.error(
        "JSON Fallback: Structure invalide (clés pokemon, type, pokemon_type manquantes)."
      );
      cachedJsonData = null;
    } else {
      cachedJsonData = parsedData;
    }
    return cachedJsonData;
  } catch (error) {
    console.error(
      "JSON Fallback: ERREUR de lecture/parsage. Chemin:",
      JSON_DATA_PATH,
      "Détails:",
      error
    );
    cachedJsonData = null;
    return null;
  }
}

/**
 * Récupère la liste des 151 premiers Pokémon.
 * Tente d'abord via PostgreSQL, puis utilise le fichier JSON en fallback.
 * @returns {Promise<PokemonData[]>} La liste des Pokémon.
 * @throws Error si les données ne peuvent être récupérées ni de la DB ni du JSON.
 */
export async function fetchPokemonList(): Promise<PokemonData[]> {
  // Tentative de récupération via la base de données
  if (pool) {
    try {
      console.log("fetchPokemonList: Source DB.");
      const query = `
        SELECT
          p.id, p.nom, p.numero, p.pv, p.attaque, p.defense, p.attaque_spe, p.defense_spe, p.vitesse,
          COALESCE(
            (
              SELECT JSON_AGG(JSON_BUILD_OBJECT('name', t.name::text, 'color', t.color::text))
              FROM pokemon_type pt
              JOIN type t ON pt.type_id = t.id
              WHERE pt.pokemon_numero = p.numero
            ),
            '[]'::json
          ) AS types
        FROM pokemon p
        WHERE p.numero BETWEEN 1 AND 151
        ORDER BY p.numero ASC;
      `;
      const { rows } = await pool.query(query);
      const validationResult = PokemonListSchema.safeParse(rows);

      if (!validationResult.success) {
        console.error(
          "Zod Error (fetchPokemonList DB):",
          validationResult.error.format()
        );
        throw new Error("DB: Format de données Pokémon invalide.");
      }
      const pokemonListFromDb: PokemonData[] = validationResult.data.map(
        (row) => ({
          ...row,
          types: row.types as PokemonTypeDefinition[],
        })
      );
      console.log("fetchPokemonList: Données DB récupérées.");
      return pokemonListFromDb;
    } catch (dbError) {
      console.warn("fetchPokemonList: Erreur DB. Fallback JSON.", dbError);
    }
  }

  // Fallback JSON
  console.log("fetchPokemonList: Source JSON.");
  const jsonData = getJsonDataFromFile();
  if (!jsonData) {
    throw new Error("fetchPokemonList: DB et JSON indisponibles.");
  }

  const {
    pokemon: jsonPokemons,
    type: jsonTypes,
    pokemon_type: jsonPokemonTypeLinks,
  } = jsonData;

  const pokemonListFromJSON: PokemonData[] = jsonPokemons
    .filter((p) => p.numero >= 1 && p.numero <= 151)
    .map((p) => {
      const typesForThisPokemon: PokemonTypeDefinition[] = jsonPokemonTypeLinks
        .filter((link) => link.pokemon_numero === p.numero)
        .map((link) => {
          const typeInfo = jsonTypes.find((t) => t.id === link.type_id);
          return {
            name: typeInfo?.name || "Inconnu",
            color: typeInfo?.color || "#000000",
          };
        });
      return {
        id: p.id,
        nom: p.nom,
        numero: p.numero,
        pv: p.pv,
        attaque: p.attaque,
        defense: p.defense,
        attaque_spe: p.attaque_spe,
        defense_spe: p.defense_spe,
        vitesse: p.vitesse,
        types: typesForThisPokemon,
      };
    })
    .sort((a, b) => a.numero - b.numero);

  console.log(
    `fetchPokemonList: ${pokemonListFromJSON.length} Pokémon depuis JSON.`
  );
  return pokemonListFromJSON;
}

/**
 * Récupère les détails d'un Pokémon par son numéro.
 * Tente d'abord via PostgreSQL, puis utilise le fichier JSON en fallback.
 * @param {number} numero - Le numéro du Pokémon à récupérer.
 * @returns {Promise<PokemonData | null>} Les détails du Pokémon ou null s'il n'est pas trouvé.
 * @throws Error si les données ne peuvent être récupérées (DB et JSON défaillants).
 */
export async function fetchPokemonDetail(
  numero: number
): Promise<PokemonData | null> {
  // Tentative DB
  if (pool) {
    try {
      console.log(`fetchPokemonDetail: Source DB pour #${numero}.`);
      const query = `
          SELECT
            p.id, p.nom, p.numero, p.pv, p.attaque, p.defense, p.attaque_spe, p.defense_spe, p.vitesse,
            COALESCE(
              (
                SELECT JSON_AGG(JSON_BUILD_OBJECT('name', t.name::text, 'color', t.color::text))
                FROM pokemon_type pt
                JOIN type t ON pt.type_id = t.id
                WHERE pt.pokemon_numero = p.numero
              ),
              '[]'::json
            ) AS types
          FROM pokemon p
          WHERE p.numero = $1;
        `;
      const { rows } = await pool.query(query, [numero]);
      if (rows.length === 0) return null;

      const pokemonDb = rows[0];
      // TODO: Valider pokemonDb avec un schéma Zod pour PokemonData individuel
      const pokemonDetailFromDb: PokemonData = {
        id: pokemonDb.id,
        nom: pokemonDb.nom,
        numero: pokemonDb.numero,
        pv: pokemonDb.pv,
        attaque: pokemonDb.attaque,
        defense: pokemonDb.defense,
        attaque_spe: pokemonDb.attaque_spe,
        defense_spe: pokemonDb.defense_spe,
        vitesse: pokemonDb.vitesse,
        types: pokemonDb.types as PokemonTypeDefinition[],
      };
      console.log(`fetchPokemonDetail: Données DB pour #${numero} récupérées.`);
      return pokemonDetailFromDb;
    } catch (dbError) {
      console.warn(
        `fetchPokemonDetail: Erreur DB pour #${numero}. Fallback JSON.`,
        dbError
      );
    }
  }

  // Fallback JSON
  console.log(`fetchPokemonDetail: Source JSON pour #${numero}.`);
  const jsonData = getJsonDataFromFile();
  if (!jsonData) {
    throw new Error(
      `fetchPokemonDetail: DB et JSON indisponibles pour #${numero}.`
    );
  }
  const {
    pokemon: jsonPokemons,
    type: jsonTypes,
    pokemon_type: jsonPokemonTypeLinks,
  } = jsonData;

  const p = jsonPokemons.find((pk) => pk.numero === numero);
  if (!p) return null;

  const typesForThisPokemon: PokemonTypeDefinition[] = jsonPokemonTypeLinks
    .filter((link) => link.pokemon_numero === p.numero)
    .map((link) => {
      const typeInfo = jsonTypes.find((t) => t.id === link.type_id);
      return {
        name: typeInfo?.name || "Inconnu",
        color: typeInfo?.color || "#000000",
      };
    });

  const pokemonDetailFromJson: PokemonData = {
    id: p.id,
    nom: p.nom,
    numero: p.numero,
    pv: p.pv,
    attaque: p.attaque,
    defense: p.defense,
    attaque_spe: p.attaque_spe,
    defense_spe: p.defense_spe,
    vitesse: p.vitesse,
    types: typesForThisPokemon,
  };
  // TODO: Valider pokemonDetailFromJson avec un schéma Zod pour PokemonData individuel
  console.log(`fetchPokemonDetail: Données JSON pour #${numero} récupérées.`);
  return pokemonDetailFromJson;
}

/**
 * Récupère la liste de tous les types de Pokémon.
 * Tente d'abord via PostgreSQL, puis utilise le fichier JSON en fallback.
 * @returns {Promise<TypeInfo[>} La liste des types.
 * @throws Error si les données ne peuvent être récupérées (DB et JSON défaillants).
 */
export async function fetchTypes(): Promise<TypeInfo[]> {
  // Tentative DB
  if (pool) {
    try {
      console.log("fetchTypes: Source DB.");
      const query = `SELECT id, name, color FROM type ORDER BY name ASC;`;
      const { rows } = await pool.query(query);
      const validationResult = TypeInfoListSchema.safeParse(rows);

      if (!validationResult.success) {
        console.error(
          "Zod Error (fetchTypes DB):",
          validationResult.error.format()
        );
        throw new Error("DB: Format de données des types invalide.");
      }
      console.log("fetchTypes: Données DB récupérées.");
      return validationResult.data as TypeInfo[];
    } catch (dbError) {
      console.warn("fetchTypes: Erreur DB. Fallback JSON.", dbError);
    }
  }

  // Fallback JSON
  console.log("fetchTypes: Source JSON.");
  const jsonData = getJsonDataFromFile();
  if (!jsonData || !jsonData.type) {
    throw new Error("fetchTypes: DB et JSON (types) indisponibles.");
  }

  const typesFromJSON: TypeInfo[] = jsonData.type
    .map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  console.log(`fetchTypes: ${typesFromJSON.length} types depuis JSON.`);
  return typesFromJSON;
}

// TODO REFACTORING: Ce fichier contient la logique d'accès aux données pour la DB et le fallback JSON.
// Envisager de séparer davantage ces logiques, peut-être en utilisant un pattern Repository
// ou en créant des adaptateurs de source de données distincts pour améliorer la modularité
// et la testabilité à long terme.

// Section de test (A conserver)
/*
async function testAll() {
  console.log("--- Test fetchPokemonList ---");
  const list = await fetchPokemonList();
  console.log(`Trouvé ${list.length} Pokémon.`);
  if (list.length > 0) console.log("Premier Pokémon:", list[0]);

  console.log("\n--- Test fetchPokemonDetail (Pikachu) ---");
  const pikachu = await fetchPokemonDetail(25);
  if (pikachu) console.log("Pikachu:", pikachu);
  else console.log("Pikachu non trouvé.");

  console.log("\n--- Test fetchTypes ---");
    const types = await fetchTypes();
  console.log(`Trouvé ${types.length} types.`);
  if (types.length > 0) console.log("Quelques types:", types.slice(0,3));

  if (pool) {
    await pool.end(); // Fermer le pool si initialisé
    console.log("PostgreSQL: Pool de connexions fermé.")
  }
}
// Pour exécuter les tests: décommenter la ligne ci-dessous et exécuter `node lib/data.js` (nécessite ts-node ou compilation préalable)
// testAll().catch(console.error);
*/
