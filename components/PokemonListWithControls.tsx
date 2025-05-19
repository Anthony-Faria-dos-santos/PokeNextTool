"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PokemonData, TypeInfo } from "@/lib/definitions";
import PokemonCardRenderer from "@/components/PokemonCardRenderer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";
import { ListFilter, Search, ArrowUpDown, XCircle } from "lucide-react"; // Icônes utiles.

interface PokemonListWithControlsProps {
  initialPokemonList: PokemonData[]; // La liste de base des Pokémon.
  allTypes: TypeInfo[]; // Tous les types existants pour le filtre.
}

// Options de tri possibles pour la liste.
type SortOptionValue =
  | "numero-asc"
  | "numero-desc"
  | "nom-asc"
  | "nom-desc"
  | "pv-asc"
  | "pv-desc"
  | "attaque-asc"
  | "attaque-desc"
  | "defense-asc"
  | "defense-desc"
  | "attaque_spe-asc"
  | "attaque_spe-desc"
  | "defense_spe-asc"
  | "defense_spe-desc"
  | "vitesse-asc"
  | "vitesse-desc";

// Labels pour les options de tri dans le dropdown.
const sortOptions: { value: SortOptionValue; label: string }[] = [
  { value: "numero-asc", label: "Numéro (Croissant)" },
  { value: "numero-desc", label: "Numéro (Décroissant)" },
  { value: "nom-asc", label: "Nom (A-Z)" },
  { value: "nom-desc", label: "Nom (Z-A)" },
  { value: "pv-desc", label: "PV (Décroissant)" },
  { value: "pv-asc", label: "PV (Croissant)" },
  { value: "attaque-desc", label: "Attaque (Décroissant)" },
  { value: "attaque-asc", label: "Attaque (Croissant)" },
  { value: "defense-desc", label: "Défense (Décroissant)" },
  { value: "defense-asc", label: "Défense (Croissant)" },
  { value: "attaque_spe-desc", label: "Att. Spé. (Décroissant)" },
  { value: "attaque_spe-asc", label: "Att. Spé. (Croissant)" },
  { value: "defense_spe-desc", label: "Déf. Spé. (Décroissant)" },
  { value: "defense_spe-asc", label: "Déf. Spé. (Croissant)" },
  { value: "vitesse-desc", label: "Vitesse (Décroissant)" },
  { value: "vitesse-asc", label: "Vitesse (Croissant)" },
];

const defaultSortOption: SortOptionValue = "numero-asc"; // Tri par défaut.

// Ce composant gère l'affichage de la liste des Pokémon
// avec les contrôles de recherche, filtre par type et tri.
export default function PokemonListWithControls({
  initialPokemonList,
  allTypes,
}: PokemonListWithControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // Pour lire les paramètres de l'URL.

  // Initialisation des états à partir des paramètres de l'URL (si présents).
  const initialSearchTerm = searchParams.get("search") || "";
  const initialSelectedTypes = searchParams.get("types")?.split(",") || [];
  const initialSortOption =
    (searchParams.get("sort") as SortOptionValue) || defaultSortOption;

  const [searchTerm, setSearchTermState] = useState(initialSearchTerm);
  const [selectedTypes, setSelectedTypesState] = useState(initialSelectedTypes);
  const [sortOption, setSortOptionState] = useState(initialSortOption);

  // Synchronise les états (recherche, types, tri) avec les paramètres de l'URL.
  // Quand un état change, on met à jour l'URL.
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (searchTerm) newParams.set("search", searchTerm);
    if (selectedTypes.length > 0) {
      // Trier les types sélectionnés garantit une URL stable et cohérente.
      newParams.set("types", [...selectedTypes].sort().join(","));
    }
    if (sortOption && sortOption !== defaultSortOption) {
      newParams.set("sort", sortOption);
    }

    const newParamsString = newParams.toString();
    // On compare avec les params actuels pour éviter un push inutile.
    // `window.location.search` inclut le '?'.
    const currentParamsString = window.location.search.substring(1);

    if (newParamsString !== currentParamsString) {
      router.push(`?${newParamsString}`, { scroll: false }); // scroll: false évite de remonter en haut de page.
    }
    // Dépendances : router n'est pas nécessaire car stable.
    // searchParams est retiré pour éviter des re-renders si son instance change.
  }, [searchTerm, selectedTypes, sortOption]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermState(e.target.value);
  };

  const handleTypeChange = (typeName: string, checked: boolean) => {
    setSelectedTypesState((prev) => {
      const newTypes = checked
        ? [...prev, typeName]
        : prev.filter((t) => t !== typeName);
      return newTypes.sort(); // Toujours trier pour la cohérence de l'URL.
    });
  };

  const handleSortChange = (value: string) => {
    setSortOptionState(value as SortOptionValue);
  };

  // Réinitialise tous les filtres et le tri.
  const handleClearFilters = () => {
    setSearchTermState("");
    setSelectedTypesState([]);
    setSortOptionState(defaultSortOption);
  };

  // `useMemo` pour calculer la liste des Pokémon à afficher.
  // Ce calcul est refait seulement si les dépendances (liste initiale, filtres, tri) changent.
  const displayedPokemonList = useMemo(() => {
    let filteredList = [...initialPokemonList];

    // Filtre par terme de recherche (nom ou numéro).
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredList = filteredList.filter(
        (p) =>
          p.nom.toLowerCase().includes(lowerSearchTerm) ||
          String(p.numero).includes(lowerSearchTerm)
      );
    }

    // Filtre par types sélectionnés (AND).
    if (selectedTypes.length > 0) {
      filteredList = filteredList.filter((pokemon) =>
        selectedTypes.every(
          (
            selectedType // `every` = tous les types doivent correspondre.
          ) =>
            pokemon.types.some(
              (pokemonType) => pokemonType.name === selectedType
            )
        )
      );
    }

    // Tri de la liste.
    const [field, order] = sortOption.split("-") as [
      keyof PokemonData | "nom", // Le champ sur lequel trier.
      "asc" | "desc" // L'ordre de tri.
    ];

    const sortedList = [...filteredList]; // Copie pour ne pas muter `filteredList`.

    sortedList.sort((a, b) => {
      let valA: string | number | undefined;
      let valB: string | number | undefined;

      if (field === "nom") {
        // Tri alphabétique pour le nom.
        valA = a.nom.toLowerCase();
        valB = b.nom.toLowerCase();
        return order === "asc"
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }

      // Tri numérique pour les stats et le numéro.
      const statFields: (keyof PokemonData)[] = [
        // Champs numériques.
        "numero",
        "pv",
        "attaque",
        "defense",
        "attaque_spe",
        "defense_spe",
        "vitesse",
      ];

      if (statFields.includes(field as keyof PokemonData)) {
        valA = a[field as keyof Omit<PokemonData, "types" | "id" | "nom">]; // TypeScript aime la précision.
        valB = b[field as keyof Omit<PokemonData, "types" | "id" | "nom">];

        if (typeof valA === "number" && typeof valB === "number") {
          return order === "asc" ? valA - valB : valB - valA;
        }
      }
      // Si le tri principal ne départage pas, on trie par numéro (stable sort).
      // (Ce fallback n'est plus explicitement ici, mais le tri initial par numéro aide).
      // Note: Pour un vrai "stable sort" sur plusieurs critères, la logique serait plus complexe.
      return 0;
    });

    return sortedList;
  }, [initialPokemonList, searchTerm, selectedTypes, sortOption]);

  const hasActiveFilters =
    searchTerm || selectedTypes.length > 0 || sortOption !== defaultSortOption;

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Section des contrôles : recherche, filtres, tri. */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center md:items-end">
          {/* Champ de recherche */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Rechercher (Nom/Numéro)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="search"
                type="text"
                placeholder="Pikachu, 25..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10" // Padding pour l'icône.
              />
              {searchTerm && ( // Bouton pour effacer la recherche.
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={() => setSearchTermState("")}
                  aria-label="Effacer la recherche"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Dropdown pour filtrer par type(s). */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Types
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    {selectedTypes.length > 0
                      ? `${selectedTypes.length} type(s) sélectionné(s)`
                      : "Filtrer par type(s)"}
                  </span>
                  <ListFilter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                {" "}
                {/* scroll si trop de types */}
                <DropdownMenuLabel>Filtrer par Type(s)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type.id}
                    checked={selectedTypes.includes(type.name)}
                    onCheckedChange={(
                      checked // `checked` est un boolean ici.
                    ) => handleTypeChange(type.name, Boolean(checked))}
                  >
                    <span className="flex items-center">
                      <span // Petite pastille de couleur.
                        className="w-3 h-3 rounded-full mr-2 border border-slate-400 dark:border-slate-500"
                        style={{ backgroundColor: `#${type.color}` }}
                      ></span>
                      {type.name}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
                {selectedTypes.length > 0 && ( // Option pour réinitialiser les types.
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => setSelectedTypesState([])} // `onSelect` pour les items non-checkbox/radio.
                      className="text-red-600 dark:text-red-400 cursor-pointer"
                    >
                      Réinitialiser les types
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Dropdown pour trier la liste. */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Trier par
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    {sortOptions.find((opt) => opt.value === sortOption)
                      ?.label || "Trier par"}
                  </span>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-72 overflow-y-auto">
                {" "}
                {/* scroll si trop d'options */}
                <DropdownMenuLabel>Options de Tri</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortOption}
                  onValueChange={handleSortChange} // `onValueChange` pour les groupes radio.
                >
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Bouton pour réinitialiser tous les filtres si au moins un est actif. */}
        {hasActiveFilters && (
          <div className="mt-4 text-center">
            <Button variant="secondary" onClick={handleClearFilters} size="sm">
              <XCircle className="mr-2 h-4 w-4" />
              Réinitialiser tous les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Affichage de la liste des Pokémon ou d'un message si aucun résultat. */}
      {displayedPokemonList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {displayedPokemonList.map((pokemon) => (
            <Link
              key={pokemon.numero}
              href={`/pokemon/${pokemon.numero}`}
              legacyBehavior={false} // Recommandé pour les nouveaux projets Next.js.
            >
              <PokemonCardRenderer pokemon={pokemon} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Aucun Pokémon ne correspond à vos critères.
          </p>
          {/* Icône différente si des filtres sont actifs ou non. */}
          {hasActiveFilters ? (
            <XCircle className="mx-auto mt-4 h-16 w-16 text-red-400 dark:text-red-600" />
          ) : (
            <Search className="mx-auto mt-4 h-16 w-16 text-slate-300 dark:text-slate-600" />
          )}
        </div>
      )}
    </div>
  );
}
