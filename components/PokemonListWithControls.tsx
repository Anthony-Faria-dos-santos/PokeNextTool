"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; // Importer les hooks de navigation
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
  DropdownMenuItem, // Import DropdownMenuItem for clear filters
} from "@/components/ui/dropdown-menu";
import { ListFilter, Search, ArrowUpDown, XCircle } from "lucide-react"; // Icônes

interface PokemonListWithControlsProps {
  initialPokemonList: PokemonData[];
  allTypes: TypeInfo[];
}

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

// Définir l'option de tri par défaut
const defaultSortOption: SortOptionValue = "numero-asc";

export default function PokemonListWithControls({
  initialPokemonList,
  allTypes,
}: PokemonListWithControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lire l'état initial depuis les paramètres d'URL
  const initialSearchTerm = searchParams.get("search") || "";
  const initialSelectedTypes = searchParams.get("types")?.split(",") || [];
  const initialSortOption =
    (searchParams.get("sort") as SortOptionValue) || defaultSortOption;

  // Utiliser useState avec les valeurs initiales des URL
  const [searchTerm, setSearchTermState] = useState(initialSearchTerm);
  const [selectedTypes, setSelectedTypesState] = useState(initialSelectedTypes);
  const [sortOption, setSortOptionState] = useState(initialSortOption);

  // Synchroniser les états locaux avec l'URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    // Synchroniser le terme de recherche
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    // Synchroniser les types sélectionnés
    if (selectedTypes.length > 0) {
      // Assurez-vous que les types sélectionnés sont des noms valides si besoin
      const validSelectedTypes = selectedTypes.filter((type) =>
        allTypes.some((t) => t.name === type)
      );
      if (validSelectedTypes.length > 0) {
        params.set("types", validSelectedTypes.join(","));
      } else {
        params.delete("types");
      }
    } else {
      params.delete("types");
    }

    // Synchroniser l'option de tri (uniquement si différente du défaut)
    if (sortOption && sortOption !== defaultSortOption) {
      params.set("sort", sortOption);
    } else {
      params.delete("sort");
    }

    // Mettre à jour l'URL sans rechargement complet de la page
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchTerm, selectedTypes, sortOption, router, searchParams, allTypes]); // allTypes ajouté car il est utilisé dans l'effet

  // Mettre à jour les états locaux ET l'URL
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermState(e.target.value);
  };

  const handleTypeChange = (typeName: string, checked: boolean) => {
    setSelectedTypesState((prev) => {
      const newTypes = checked
        ? [...prev, typeName]
        : prev.filter((t) => t !== typeName);
      // Optionnel: Triez les types sélectionnés pour une URL cohérente
      return newTypes.sort();
    });
  };

  const handleSortChange = (value: string) => {
    setSortOptionState(value as SortOptionValue);
  };

  const handleClearFilters = () => {
    setSearchTermState("");
    setSelectedTypesState([]);
    setSortOptionState(defaultSortOption);
  };

  // Logique de filtrage et de tri (intégrée dans useMemo)
  const displayedPokemonList = useMemo(() => {
    let filteredList = [...initialPokemonList];

    // 1. Filtrage par terme de recherche (Nom ou Numéro)
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredList = filteredList.filter(
        (p) =>
          p.nom.toLowerCase().includes(lowerSearchTerm) ||
          String(p.numero).includes(lowerSearchTerm) // Recherche par numéro (même si c'est un string)
      );
    }

    // 2. Filtrage par types (Doit correspondre à TOUS les types sélectionnés)
    if (selectedTypes.length > 0) {
      filteredList = filteredList.filter((pokemon) => {
        // Pour chaque type sélectionné, vérifier si le pokémon possède ce type
        return selectedTypes.every((selectedType) =>
          pokemon.types.some((pokemonType) => pokemonType.name === selectedType)
        );
      });
    }

    // 3. Tri
    const [field, order] = sortOption.split("-") as [
      keyof PokemonData | "nom",
      "asc" | "desc"
    ];

    // Créer une copie pour le tri afin de ne pas modifier l'originale
    const sortedList = [...filteredList];

    sortedList.sort((a, b) => {
      let valA: string | number | undefined;
      let valB: string | number | undefined;

      // Gérer le cas spécial du tri par nom (insensible à la casse)
      if (field === "nom") {
        valA = a.nom.toLowerCase();
        valB = b.nom.toLowerCase();
        return order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // Gérer le tri par statistiques (numérique)
      // Assurez-vous que les champs existent sur PokemonData
      if (field in a && field in b) {
        // Check if the field is one of the stat keys or 'numero'
        const statFields = [
          "numero",
          "pv",
          "attaque",
          "defense",
          "attaque_spe",
          "defense_spe",
          "vitesse",
        ];
        if (statFields.includes(field)) {
          valA =
            a[
              field as keyof Pick<
                PokemonData,
                | "numero"
                | "pv"
                | "attaque"
                | "defense"
                | "attaque_spe"
                | "defense_spe"
                | "vitesse"
              >
            ];
          valB =
            b[
              field as keyof Pick<
                PokemonData,
                | "numero"
                | "pv"
                | "attaque"
                | "defense"
                | "attaque_spe"
                | "defense_spe"
                | "vitesse"
              >
            ];
          if (typeof valA === "number" && typeof valB === "number") {
            return order === "asc" ? valA - valB : valB - valA;
          }
        }
      }

      // Fallback ou cas non géré (devrait normalement être géré par le tri par numéro par défaut si field isn't 'nom')
      // As a fallback, compare by numero if it's not the primary sort
      if (field !== "numero") {
        const numA = a.numero;
        const numB = b.numero;
        return numA - numB; // Default to numero asc if primary sort fails
      }
      return 0;
    });

    return sortedList;
  }, [initialPokemonList, searchTerm, selectedTypes, sortOption]); // Dépendances du useMemo

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Section des contrôles */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg shadow-md">
        {/* Utiliser flexbox ou grille pour un meilleur contrôle responsif des contrôles */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center md:items-end">
          {/* Barre de recherche */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            {" "}
            {/* w-full sur mobile, 1/3 sur md+ */}
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
                className="w-full pl-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={() => setSearchTermState("")} // Utiliser l'état local pour un feedback rapide
                >
                  <XCircle className="h-4 w-4" />
                  <span className="sr-only">Effacer la recherche</span>
                </Button>
              )}
            </div>
          </div>

          {/* Sélecteur de Type(s) */}
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
                      : "Filtrer par type(s)"}{" "}
                    {/* Texte adapté */}
                  </span>
                  <ListFilter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                <DropdownMenuLabel>Filtrer par Type(s)</DropdownMenuLabel>{" "}
                {/* Texte adapté */}
                <DropdownMenuSeparator />
                {allTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type.id}
                    checked={selectedTypes.includes(type.name)}
                    onCheckedChange={(checked) =>
                      handleTypeChange(type.name, checked)
                    }
                  >
                    <span className="flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2 border border-slate-400 dark:border-slate-500"
                        style={{ backgroundColor: `#${type.color}` }}
                      ></span>
                      {type.name}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
                {selectedTypes.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => setSelectedTypesState([])} // Utiliser l'état local
                      className="text-red-600 dark:text-red-400 cursor-pointer" // Ajouter cursor-pointer
                    >
                      Réinitialiser les types
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sélecteur de Tri */}
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
                <DropdownMenuLabel>Options de Tri</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortOption}
                  onValueChange={handleSortChange}
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
        {/* Bouton pour réinitialiser tous les filtres */}
        {(searchTerm ||
          selectedTypes.length > 0 ||
          sortOption !== defaultSortOption) && (
          <div className="mt-4 text-center">
            <Button variant="secondary" onClick={handleClearFilters} size="sm">
              <XCircle className="mr-2 h-4 w-4" />
              Réinitialiser tous les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Grille des Pokémon */}
      {displayedPokemonList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {displayedPokemonList.map((pokemon) => (
            // Assurez-vous que Link utilise legacyBehavior={false} dans Next.js 13+ App Router
            <Link
              key={pokemon.numero}
              href={`/pokemon/${pokemon.numero}`}
              legacyBehavior={false}
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
          {/* Afficher l'icône XCircle si des filtres sont actifs, sinon Search */}
          {searchTerm ||
          selectedTypes.length > 0 ||
          sortOption !== defaultSortOption ? (
            <XCircle className="mx-auto mt-4 h-16 w-16 text-red-400 dark:text-red-600" />
          ) : (
            <Search className="mx-auto mt-4 h-16 w-16 text-slate-300 dark:text-slate-600" />
          )}
        </div>
      )}
    </div>
  );
}
