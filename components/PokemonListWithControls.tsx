"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
} from "@/components/ui/dropdown-menu";
import { ListFilter, Search, ArrowUpDown } from "lucide-react"; // Icônes

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

export default function PokemonListWithControls({
  initialPokemonList,
  allTypes,
}: PokemonListWithControlsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOptionValue>("numero-asc");

  const displayedPokemonList = useMemo(() => {
    let filteredList = [...initialPokemonList];

    if (searchTerm) {
      filteredList = filteredList.filter(
        (p) =>
          p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(p.numero).includes(searchTerm)
      );
    }

    if (selectedTypes.length > 0) {
      filteredList = filteredList.filter((p) =>
        selectedTypes.every((st) => p.types.some((pt) => pt.name === st))
      );
    }

    const [field, order] = sortOption.split("-") as [
      keyof PokemonData | "nom",
      "asc" | "desc"
    ];
    filteredList.sort((a, b) => {
      let valA = a[field as keyof PokemonData];
      let valB = b[field as keyof PokemonData];

      if (field === "nom") {
        valA = a.nom.toLowerCase();
        valB = b.nom.toLowerCase();
      }

      if (valA === undefined || valB === undefined) return 0;

      if (typeof valA === "string" && typeof valB === "string") {
        return order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return order === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });

    return filteredList;
  }, [initialPokemonList, searchTerm, selectedTypes, sortOption]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Section des contrôles */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Barre de recherche */}
          <div className="md:col-span-1">
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>

          {/* Sélecteur de Type(s) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Types
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    {selectedTypes.length > 0
                      ? `${selectedTypes.length} type(s) sélectionné(s)`
                      : "Sélectionner type(s)"}
                  </span>
                  <ListFilter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                <DropdownMenuLabel>Filtrer par Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type.id}
                    checked={selectedTypes.includes(type.name)}
                    onCheckedChange={(checked) => {
                      setSelectedTypes((prev) =>
                        checked
                          ? [...prev, type.name]
                          : prev.filter((t) => t !== type.name)
                      );
                    }}
                  >
                    <span className="flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2 border border-slate-400"
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
                      onSelect={() => setSelectedTypes([])}
                      className="text-red-600 dark:text-red-400"
                    >
                      Réinitialiser les types
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sélecteur de Tri */}
          <div>
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
                <DropdownMenuRadioGroup
                  value={sortOption}
                  onValueChange={(value) =>
                    setSortOption(value as SortOptionValue)
                  }
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
      </div>

      {/* Grille des Pokémon */}
      {displayedPokemonList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {displayedPokemonList.map((pokemon) => (
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
          <Search className="mx-auto mt-4 h-16 w-16 text-slate-300 dark:text-slate-600" />
        </div>
      )}
    </div>
  );
}
