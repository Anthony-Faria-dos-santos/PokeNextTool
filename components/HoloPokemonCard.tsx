"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PokemonData } from "@lib/definitions";
import TypeBadge from "./TypeBadge"; // Importez le nouveau composant

interface HoloPokemonCardProps {
  pokemon: PokemonData;
}

const HoloPokemonCard: React.FC<HoloPokemonCardProps> = ({ pokemon }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const cardWidth = 240; // Dimensions de base
  const cardHeight = 336; // Dimensions de base

  // Ajuster onMouseMove pour calculer les positions relatives au conteneur d'image si les overlays sont déplacés
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mouseX = (x / rect.width - 0.5) * 2;
    const mouseY = (y / rect.height - 0.5) * -2;

    const rotateY = mouseX * 15;
    const rotateX = mouseY * 15;

    // !! NOUVEAU: Calculer les positions de reflet/glare par rapport au conteneur de l'image
    const imageContainer = cardRef.current.querySelector(
      ".holo-card-image-container"
    );
    let glareX = 50; // Default to center if container not found or during touch
    let glareY = 50;
    if (imageContainer) {
      const imgRect = imageContainer.getBoundingClientRect();
      const imgX = e.clientX - imgRect.left;
      const imgY = e.clientY - imgRect.top;
      glareX = (imgX / imgRect.width) * 100;
      glareY = (imgY / imgRect.height) * 100;
    }

    cardRef.current.style.setProperty("--rx", `${rotateX}deg`);
    cardRef.current.style.setProperty("--ry", `${rotateY}deg`);

    // Appliquer les positions de reflet/glare sur la carte principale
    // Ces variables seront utilisées par les overlays
    cardRef.current.style.setProperty("--mx", `${glareX}%`);
    cardRef.current.style.setProperty("--my", `${glareY}%`);
    cardRef.current.style.setProperty("--posx", `${glareX}%`); // Variables alternatives
    cardRef.current.style.setProperty("--posy", `${glareY}%`);

    const hyp = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    cardRef.current.style.setProperty("--hyp", `${hyp}`);
  }, []); // Dependencies don't change
  const onMouseEnter = () => {
    setIsInteracting(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty("--o", "1");
    }
  };

  const onMouseLeave = () => {
    setIsInteracting(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty("--rx", "0deg");
      cardRef.current.style.setProperty("--ry", "0deg");
      cardRef.current.style.setProperty("--mx", "50%");
      cardRef.current.style.setProperty("--my", "50%");
      cardRef.current.style.setProperty("--posx", `50%`);
      cardRef.current.style.setProperty("--posy", `50%`);
      cardRef.current.style.setProperty("--o", "0");
      cardRef.current.style.setProperty("--hyp", "0");
    }
  };

  useEffect(() => {
    const cardElement = cardRef.current;
    if (cardElement) {
      // !! NOUVEAU: Détection d'appareil tactile
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (!isTouchDevice) {
        cardElement.addEventListener("mousemove", onMouseMove);
        cardElement.addEventListener("mouseenter", onMouseEnter);
        cardElement.addEventListener("mouseleave", onMouseLeave);
      } else {
        // Optionnel: appliquer un style statique ou une animation simple sur mobile
        cardElement.style.setProperty("--o", "0.5"); // Garder une légère brillance statique
        // Les rotations restent à 0deg (par défaut)
      }

      // Reset styles
      cardElement.style.setProperty("--mx", "50%");
      cardElement.style.setProperty("--my", "50%");
      cardElement.style.setProperty("--rx", "0deg");
      cardElement.style.setProperty("--ry", "0deg");
      cardElement.style.setProperty("--posx", `50%`);
      cardElement.style.setProperty("--posy", `50%`);
      cardElement.style.setProperty("--o", "0"); // Commence sans brillance
      cardElement.style.setProperty("--s", "1");
      cardElement.style.setProperty("--hyp", "0");

      // Set color variables
      cardElement.style.setProperty("--red", "#f80e7b");
      cardElement.style.setProperty("--yel", "#eedf10");
      cardElement.style.setProperty("--gre", "#21e985");
      cardElement.style.setProperty("--blu", "#0dbde9");
      cardElement.style.setProperty("--vio", "#c929f1");
      const primaryTypeColor = pokemon.types[0]?.color
        ? `#${pokemon.types[0].color}`
        : "#69d1e9";
      cardElement.style.setProperty("--glow", primaryTypeColor);

      // Nettoyage des écouteurs
      return () => {
        if (!isTouchDevice && cardElement) {
          cardElement.removeEventListener("mousemove", onMouseMove);
          cardElement.removeEventListener("mouseenter", onMouseEnter);
          cardElement.removeEventListener("mouseleave", onMouseLeave);
        }
      };
    }

    // Nettoyage si le composant est démonté avant que l'effet ne s'exécute
    return () => {}; // Pas de nettoyage spécifique si pas d'écouteurs ajoutés
  }, [onMouseMove, pokemon.types]); // Dépendances pour useEffect

  const imagePath = `/images/pokemon/${pokemon.numero}.png`;
  const placeholderImage = "/images/pokeball_placeholder.gif";

  return (
    <>
      {" "}
      {/* Fragment React */}
      <div className="holo-card-container-wrapper">
        <div className="holo-card-perspective-container">
          <div
            ref={cardRef}
            className={`holo-card-element ${
              isInteracting ? "interacting" : ""
            }`}
          >
            <div className="holo-card-content">
              {/* Overlays moved INSIDE holo-card-image-container */}
              <div className="holo-card-image-container">
                {" "}
                {/* Parent en position: relative */}
                <Image
                  src={imagePath}
                  alt={pokemon.nom}
                  width={cardWidth}
                  height={Math.floor(cardHeight * 0.7)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = placeholderImage;
                  }}
                  priority={pokemon.numero <= 12}
                />
                <div className="holo-card-shine-overlay"></div>
                <div className="holo-card-glare-overlay"></div>
              </div>

              <div className="holo-card-info">
                <h3 className="holo-pokemon-name">{pokemon.nom}</h3>
                <p className="holo-pokemon-number">
                  #{String(pokemon.numero).padStart(3, "0")}
                </p>
                <div className="holo-pokemon-types">
                  {pokemon.types.map((type) => (
                    <TypeBadge
                      key={type.name}
                      name={type.name}
                      color={type.color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </> // Fin du fragment React
  );
};

export default HoloPokemonCard;
