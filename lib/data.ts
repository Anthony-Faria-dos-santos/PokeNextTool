import dotenv from "dotenv";
dotenv.config(); // Charge les variables d'environnement du .env
import { Pool } from "pg";
import { PokemonData, PokemonType, TypeInfo } from "./definitions"; // Nos types de données.
// Import des schémas Zod pour la validation.
import {
  PokemonListSchema,
  // PokemonDataSchema, // Pas utilisé directement ici, PokemonListSchema l'utilise.
  TypeInfoListSchema,
} from "./schemas";
// Configuration du pool de connexions à la base de données PostgreSQL.
// `Pool` utilise automatiquement les variables d'env PGUSER, PGHOST, etc.
let pool: Pool;

try {
  pool = new Pool();
  console.log("Pool de connexions PostgreSQL initialisé.");
} catch (error) {
  console.error(
    "Erreur : Impossible d'initialiser le pool PostgreSQL :",
    error
  );
  // Si la BDD n'est pas là, l'appli ne marchera pas bien.
  // On pourrait avoir un mode dégradé, mais pour l'instant, on arrête.
  throw new Error("Connexion à la base de données échouée.");
}

// Récupère la liste des 151 premiers Pokémon.
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
            SELECT JSON_AGG(JSON_BUILD_OBJECT('name', t.name::text, 'color', t.color::text)) -- Ajout de ::text ici
            FROM pokemon_type pt
            JOIN type t ON pt.type_id = t.id
            WHERE pt.pokemon_numero = p.numero
          ),
          '[]'::json /* Valeur par défaut si la sous-requête ne retourne rien. */
        ) AS types
      FROM pokemon p
      WHERE p.numero BETWEEN 1 AND 151 -- On veut les 151 classiques.
      ORDER BY p.numero ASC;
    `;
    const { rows } = await pool.query(query);

    // On vérifie que les données de la BDD correspondent à ce qu'on attend.
    const validationResult = PokemonListSchema.safeParse(rows);

    if (!validationResult.success) {
      console.error(
        "Erreur Zod (fetchPokemonList): Les données de la BDD sont invalides.",
        validationResult.error.format()
      );
      // Ça veut dire que la BDD a renvoyé un truc pas normal.
      throw new Error(
        "Format de données Pokémon incorrect depuis la base de données."
      );
    }

    // Map pour s'assurer que le type `types` est bien PokemonType[.
    // Zod valide la structure, mais TypeScript peut être plus précis ici.
    const pokemonList: PokemonData[] = validationResult.data.map((row) => ({
      ...row, // On garde toutes les propriétés validées par Zod.
      types: row.types as PokemonType[], // On certifie le type ici après validation.
    }));

    return pokemonList;
  } catch (error) {
    // Si c'est une erreur de validation Zod, on la relance telle quelle.
    if (
      error instanceof Error &&
      error.message.includes("incorrect depuis la base de données")
    ) {
      throw error;
    }
    console.error("Erreur pendant fetchPokemonList:", error);
    throw new Error("Impossible de récupérer la liste des Pokémon.");
  }
}

// Récupère les détails d'un Pokémon spécifique par son numéro.
export async function fetchPokemonDetail(
  numero: number
): Promise<PokemonData | null> {
  try {
    // Requête pour les infos principales du Pokémon.
    const pokemonQuery = `
      SELECT
        id, nom, numero, pv, attaque, defense, attaque_spe, defense_spe, vitesse
      FROM pokemon
      WHERE numero = $1;
    `;
    const { rows: pokemonRows } = await pool.query(pokemonQuery, [numero]);

    if (pokemonRows.length === 0) {
      return null; // Pas de Pokémon trouvé avec ce numéro.
    }
    const pokemon = pokemonRows[0];

    // Requête pour récupérer les types du Pokémon.
    const typesQuery = `
      SELECT t.name, t.color
      FROM pokemon_type pt
      JOIN type t ON pt.type_id = t.id
      WHERE pt.pokemon_numero = $1;
    `;
    const { rows: typesRows } = await pool.query(typesQuery, [numero]);

    // On combine les résultats des deux requêtes.
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
      types: typesRows.map((row) => ({ name: row.name, color: row.color })), // Formatage des types.
    };

    // TODO: Ajouter une validation Zod avec PokemonDataSchema ici aussi pour être sûr.
    return pokemonDetail;
  } catch (error) {
    console.error(`Erreur pendant fetchPokemonDetail pour #${numero}:`, error);
    throw new Error(
      `Impossible de récupérer les détails pour le Pokémon #${numero}.`
    );
  }
}

// Récupère la liste de tous les types de Pokémon.
export async function fetchTypes(): Promise<TypeInfo[]> {
  try {
    const query = `
      SELECT id, name, color
      FROM type
      ORDER BY name ASC;
    `;
    const { rows } = await pool.query(query);

    // Validation Zod pour la liste des types.
    const validationResult = TypeInfoListSchema.safeParse(rows);

    if (!validationResult.success) {
      console.error(
        "Erreur Zod (fetchTypes): Les données des types sont invalides.",
        validationResult.error.format()
      );
      throw new Error(
        "Format de données des types incorrect depuis la base de données."
      );
    }

    const types: TypeInfo[] = validationResult.data;
    return types;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("incorrect depuis la base de données")
    ) {
      throw error;
    }
    console.error("Erreur pendant fetchTypes:", error);
    throw new Error("Impossible de récupérer les types de Pokémon.");
  }
}

// Section pour tester les fonctions. Peut être retirée en prod.
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

  console.log("\n--- Test fetchPokemonDetail (MissingNo) ---");
  const missing = await fetchPokemonDetail(999);
  if (missing) console.log("Pokémon 999:", missing);
  else console.log("Pokémon 999 non trouvé (attendu).");

  console.log("\n--- Test fetchTypes ---");
    const types = await fetchTypes();
  console.log(`Trouvé ${types.length} types.`);
  if (types.length > 0) console.log("Quelques types:", types.slice(0,3));

  await pool.end(); // Important de fermer le pool après les tests.
    }

// testAll(); // Décommenter pour lancer les tests.
*/
