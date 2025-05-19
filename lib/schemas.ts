import { z } from "zod";

// Schéma Zod pour valider un type de Pokémon.
// Doit correspondre à l'interface PokemonType.
export const PokemonTypeSchema = z.object({
  name: z.string().min(1, { message: "Le nom du type est requis." }),
  // Couleur hexa sur 6 caractères, sans le '#'.
  color: z
    .string()
    .length(6, { message: "La couleur doit être un code hexa de 6 chiffres." })
    .regex(/^[0-9a-fA-F]{6}$/, {
      message: "Format de couleur invalide (ex: FF0000).",
    }),
});

// Schéma Zod pour valider les données d'un Pokémon.
// Correspond à l'interface PokemonData.
export const PokemonDataSchema = z.object({
  id: z
    .number()
    .int()
    .positive({ message: "L'ID doit être un nombre positif." }),
  nom: z.string().min(1, { message: "Le nom du Pokémon est requis." }),
  numero: z
    .number()
    .int()
    .min(1, { message: "Le numéro du Pokémon doit être positif." }),
  pv: z
    .number()
    .int()
    .min(0, { message: "Les PV ne peuvent pas être négatifs." }),
  attaque: z
    .number()
    .int()
    .min(0, { message: "L'Attaque ne peut pas être négative." }),
  defense: z
    .number()
    .int()
    .min(0, { message: "La Défense ne peut pas être négative." }),
  attaque_spe: z
    .number()
    .int()
    .min(0, { message: "L'Attaque Spéciale ne peut pas être négative." }),
  defense_spe: z
    .number()
    .int()
    .min(0, { message: "La Défense Spéciale ne peut pas être négative." }),
  vitesse: z
    .number()
    .int()
    .min(0, { message: "La Vitesse ne peut pas être négative." }),
  types: z.array(PokemonTypeSchema), // Un Pokémon peut avoir plusieurs types.
});

// Schéma Zod pour valider les infos d'un type (utilisé pour la liste des types).
// Correspond à l'interface TypeInfo.
export const TypeInfoSchema = z.object({
  id: z.number().int().positive({ message: "L'ID du type doit être positif." }),
  name: z.string().min(1, { message: "Le nom du type est requis." }),
  color: z
    .string()
    .length(6, { message: "La couleur doit être un code hexa de 6 chiffres." })
    .regex(/^[0-9a-fA-F]{6}$/, { message: "Format de couleur invalide." }),
});

// Schéma pour valider une liste de Pokémon (un tableau de PokemonData).
export const PokemonListSchema = z.array(PokemonDataSchema);

// Schéma pour valider une liste de types (un tableau de TypeInfo).
export const TypeInfoListSchema = z.array(TypeInfoSchema);
