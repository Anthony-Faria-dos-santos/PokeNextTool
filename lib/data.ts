import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";
import { PokemonData, PokemonType, TypeInfo } from "./definitions"; // Ajout de TypeInfo
// Import des schémas Zod
import {
  PokemonListSchema,
  //PokemonDataSchema,
  TypeInfoListSchema,
} from "./schemas";
// Importation de dotenv pour charger les variables d'environnement

// Configuration de la connexion à la base de données
// Les variables d'environnement sont utilisées par défaut par le constructeur de Pool
// PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT
let pool: Pool;

try {
  pool = new Pool();
  console.log(
    "Connexion à la base de données PostgreSQL initialisée avec succès."
  );
} catch (error) {
  console.error(
    "Erreur lors de l'initialisation du pool de connexions PostgreSQL:",
    error
  );
  // Gérer l'erreur de manière appropriée, peut-être relancer ou utiliser un pool mock/fallback
  // Pour l'instant, on logue l'erreur. L'application pourrait ne pas fonctionner correctement sans BDD.
  throw new Error(
    "Impossible d'initialiser le pool de connexions à la base de données."
  );
}

export async function fetchPokemonList(): Promise<PokemonData[]> {
  try {
    const query = `
      SELECT
        p.id,
        p.nom,
        p.numero,
        p.pv,
        p.attaque,
        p.defense,
        p.attaque_spe,
        p.defense_spe,
        p.vitesse,
        COALESCE(
          (
            SELECT JSON_AGG(JSON_BUILD_OBJECT('name', t.name, 'color', t.color))
            FROM pokemon_type pt
            JOIN type t ON pt.type_id = t.id
            WHERE pt.pokemon_numero = p.numero
          ),
          '[]'::json
        ) AS types
      FROM pokemon p
      WHERE p.numero BETWEEN 1 AND 151 -- Pour les 151 premiers Pokémon
      ORDER BY p.numero ASC;
    `;
    const { rows } = await pool.query(query);

    // Validation avec Zod
    const validationResult = PokemonListSchema.safeParse(rows);

    if (!validationResult.success) {
      console.error(
        "Erreur de validation Zod pour fetchPokemonList:",
        validationResult.error.format()
      );
      throw new Error(
        "Les données des Pokémon reçues de la base de données sont invalides."
      );
    }
    const pokemonList: PokemonData[] = validationResult.data.map((row) => ({
      id: row.id,
      nom: row.nom,
      numero: row.numero,
      pv: row.pv,
      attaque: row.attaque,
      defense: row.defense,
      attaque_spe: row.attaque_spe,
      defense_spe: row.defense_spe,
      vitesse: row.vitesse,
      types: row.types as PokemonType[],
    }));

    return pokemonList;
  } catch (error) {
    if (error instanceof Error && error.message.includes("invalides")) {
      throw error;
    }
    console.error(
      "Erreur lors de la récupération de la liste des Pokémon:",
      error
    );
    throw new Error("Impossible de récupérer la liste des Pokémon.");
  }
}

export async function fetchPokemonDetail(
  numero: number
): Promise<PokemonData | null> {
  try {
    // Requête 1: Récupérer les détails du Pokémon
    const pokemonQuery = `
      SELECT
        id,
        nom,
        numero,
        pv,
        attaque,
        defense,
        attaque_spe,
        defense_spe,
        vitesse
      FROM pokemon
      WHERE numero = $1;
    `;
    const { rows: pokemonRows } = await pool.query(pokemonQuery, [numero]);

    if (pokemonRows.length === 0) {
      return null; // Aucun Pokémon trouvé
    }

    const pokemon = pokemonRows[0];

    // Requête 2: Récupérer les types du Pokémon
    const typesQuery = `
      SELECT
        t.name,
        t.color
      FROM pokemon_type pt
      JOIN type t ON pt.type_id = t.id
      WHERE pt.pokemon_numero = $1;
    `;
    const { rows: typesRows } = await pool.query(typesQuery, [numero]);

    // Combiner les résultats
    const pokemonDetail: PokemonData = {
      id: pokemon.id,
      nom: pokemon.nom,
      numero: pokemon.numero,
      pv: pokemon.pv,
      attaque: pokemon.attaque,
      defense: pokemon.defense,
      attaque_spe: pokemon.attaque_spe,
      defense_spe: pokemon.defense_spe,
      vitesse: pokemon.vitesse,
      types: typesRows.map((row) => ({ name: row.name, color: row.color })),
    };

    return pokemonDetail;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des détails du Pokémon #${numero}:`,
      error
    );
    throw new Error(
      `Impossible de récupérer les détails du Pokémon #${numero}.`
    );
  }
}

export async function fetchTypes(): Promise<TypeInfo[]> {
  try {
    const query = `
      SELECT
        id,
        name,
        color
      FROM type
      ORDER BY name ASC;
    `;
    const { rows } = await pool.query(query);

    const validationResult = TypeInfoListSchema.safeParse(rows);

    if (!validationResult.success) {
      console.error(
        "Erreur de validation Zod pour fetchTypes:",
        validationResult.error.format()
      );
      throw new Error(
        "Les données des types reçues de la base de données sont invalides."
      );
    }

    const types: TypeInfo[] = validationResult.data;
    return types;
  } catch (error) {
    if (error instanceof Error && error.message.includes("invalides")) {
      throw error;
    }
    console.error(
      "Erreur lors de la récupération des types de Pokémon:",
      error
    );
    throw new Error("Impossible de récupérer les types de Pokémon.");
  }
}

// Exemple d'utilisation (pour tester, peut être retiré plus tard)
/* async function testFetch() {
  try {
    console.log("Tentative de récupération des Pokémon...");
    const pokemonList = await fetchPokemonList();
    console.log(`Nombre de Pokémon récupérés: ${pokemonList.length}`);
    if (pokemonList.length > 0) {
      console.log("Premier Pokémon:", pokemonList[0]);
      console.log("Types du premier Pokémon:", pokemonList[0.types);
      if (pokemonList.length > 24) {
        console.log("25ème Pokémon (Pikachu?):", pokemonList[24]);
        console.log("Types de Pikachu:", pokemonList[24.types);
      }
    }
  } catch (error) {
    console.error("Erreur lors du test de fetchPokemonList:", error);
  } finally {
    // Fermer le pool de connexion si ce script est exécuté de manière autonome
    // Dans une application Next.js, le pool est généralement géré différemment (reste ouvert)
    await pool.end();
  }
}

testFetch(); */

// Pour tester cette nouvelle fonction, vous pourriez ajouter quelque chose comme :

/* async function testFetchDetail() {
  try {
    const pikachuNumero = 25;
    console.log(`Tentative de récupération du Pokémon #${pikachuNumero}...`);
    const pikachu = await fetchPokemonDetail(pikachuNumero);
    if (pikachu) {
      console.log("Détails de Pikachu:", pikachu);
      console.log("Types de Pikachu:", pikachu.types);
    } else {
      console.log(`Pokémon #${pikachuNumero} non trouvé.`);
    }

    const missingNumero = 999;
    console.log(`Tentative de récupération du Pokémon #${missingNumero}...`);
    const missingPokemon = await fetchPokemonDetail(missingNumero);
    if (missingPokemon) {
      console.log("Détails du Pokémon manquant:", missingPokemon);
    } else {
      console.log(`Pokémon #${missingNumero} non trouvé (ce qui est attendu).`);
    }
  } catch (error) {
    console.error("Erreur lors du test de fetchPokemonDetail:", error);
  } finally {
    // await pool.end(); // Seulement si exécuté de manière autonome
  }
}
// Décommentez pour tester :
testFetchDetail();
 */

// Pour tester cette nouvelle fonction :

/* async function testFetchTypes() {
  try {
    console.log("Tentative de récupération de tous les types...");
    const types = await fetchTypes();
    console.log(`Nombre de types récupérés: ${types.length}`);
    if (types.length > 0) {
      console.log("Quelques types:", types.slice(0, 5));
    }
  } catch (error) {
    console.error("Erreur lors du test de fetchTypes:", error);
  } finally {
    // await pool.end(); // Seulement si exécuté de manière autonome
  }
},
// Décommentez pour tester :
testFetchTypes(); */
