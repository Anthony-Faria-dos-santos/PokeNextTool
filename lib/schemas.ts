import { z } from 'zod';

// Schéma pour PokemonType, correspondant à l'interface PokemonType
export const PokemonTypeSchema = z.object({
  name: z.string().min(1, { message: "Le nom du type ne peut pas être vide." }),
  color: z.string().length(6, { message: "La couleur du type doit être un code hexadécimal de 6 caractères (sans #)." })
    .regex(/^[0-9a-fA-F]{6}$/, { message: "Format de couleur invalide." }),
});

// Schéma pour PokemonData, correspondant à l'interface PokemonData
export const PokemonDataSchema = z.object({
  id: z.number().int().positive({ message: "L'ID du Pokémon doit être un entier positif." }),
  nom: z.string().min(1, { message: "Le nom du Pokémon ne peut pas être vide." }),
  numero: z.number().int().min(1, { message: "Le numéro du Pokémon doit être un entier positif." }),
  pv: z.number().int().min(0, { message: "Les PV ne peuvent pas être négatifs." }),
  attaque: z.number().int().min(0, { message: "L'Attaque ne peut pas être négative." }),
  defense: z.number().int().min(0, { message: "La Défense ne peut pas être négative." }),
  attaque_spe: z.number().int().min(0, { message: "L'Attaque Spéciale ne peut pas être négative." }),
  defense_spe: z.number().int().min(0, { message: "La Défense Spéciale ne peut pas être négative." }),
  vitesse: z.number().int().min(0, { message: "La Vitesse ne peut pas être négative." }),
  types: z.array(PokemonTypeSchema),
});

// Schéma pour TypeInfo, correspondant à l'interface TypeInfo
export const TypeInfoSchema = z.object({
  id: z.number().int().positive({ message: "L'ID du type doit être un entier positif." }),
  name: z.string().min(1, { message: "Le nom du type ne peut pas être vide." }),
  color: z.string().length(6, { message: "La couleur du type doit être un code hexadécimal de 6 caractères (sans #)." })
    .regex(/^[0-9a-fA-F]{6}$/, { message: "Format de couleur invalide." }),
});

// Pour valider une liste de Pokémon
export const PokemonListSchema = z.array(PokemonDataSchema);

// Pour valider une liste de Types
export const TypeInfoListSchema = z.array(TypeInfoSchema);
