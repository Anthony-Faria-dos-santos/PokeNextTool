/* import dotenv from "dotenv"; */ //! A supprimer avant mise en prod.
import { Pool } from "pg";
import { PokemonData, PokemonType, TypeInfo } from "./definitions"; // Ajout de TypeInfo
/* dotenv.config(); */ //! A supprimer avant mise en prod.

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

    // Mapper les résultats pour correspondre à l'interface PokemonData
    const pokemonList: PokemonData[] = rows.map((row) => ({
      id: row.id,
      nom: row.nom,
      numero: row.numero,
      pv: row.pv,
      attaque: row.attaque,
      defense: row.defense,
      attaque_spe: row.attaque_spe,
      defense_spe: row.defense_spe,
      vitesse: row.vitesse,
      types: row.types as PokemonType[], // Le JSON_AGG retourne déjà le bon format
    }));

    return pokemonList;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des Pokémon:",
      error
    );
    // Dans un cas réel, vous pourriez vouloir logger l'erreur dans un service de monitoring
    // et/ou retourner une erreur plus conviviale ou un tableau vide.
    throw new Error("Impossible de récupérer la liste des Pokémon.");
  }
}

export async function fetchPokemonDetail(
  numero: number
): Promise<PokemonData | null> {
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
      WHERE p.numero = $1; -- Utilisation d'un paramètre pour le numéro
    `;
    const { rows } = await pool.query(query, [numero]);

    if (rows.length === 0) {
      return null; // Aucun Pokémon trouvé pour ce numéro
    }

    const row = rows[0];
    const pokemonDetail: PokemonData = {
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
    };

    return pokemonDetail;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du Pokémon avec le numéro ${numero}:`,
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

    // Les noms de colonnes correspondent déjà à l'interface TypeInfo
    const types: TypeInfo[] = rows;

    return types;
  } catch (error) {
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
        console.log("Types de Pikachu:", pokemonList[24].types);
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
}
// Décommentez pour tester :
testFetchTypes(); */
