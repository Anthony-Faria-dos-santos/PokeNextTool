"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLowSpec } from "./LowSpecContext";
// Si vous créez HoloPokemonCard.css, décommentez :
// import './HoloPokemonCard.css';

// Interface pour les props du composant
interface HoloPokemon {
  numero: number;
  nom: string;
  types: { name: string; color: string }[];
}

interface HoloPokemonCardProps {
  pokemon: HoloPokemon;
}

const HoloPokemonCard: React.FC<HoloPokemonCardProps> = ({ pokemon }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const { isLowSpec } = useLowSpec();

  const cardWidth = 240;
  const cardHeight = 336;

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!cardRef.current || isLowSpec) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const mouseX = (x / rect.width - 0.5) * 2;
      const mouseY = (y / rect.height - 0.5) * -2;
      const rotateY = mouseX * 15;
      const rotateX = mouseY * 15;
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      cardRef.current.style.setProperty("--mx", `${glareX}%`);
      cardRef.current.style.setProperty("--my", `${glareY}%`);
      cardRef.current.style.setProperty("--rx", `${rotateX}deg`);
      cardRef.current.style.setProperty("--ry", `${rotateY}deg`);
      cardRef.current.style.setProperty("--posx", `${glareX}%`);
      cardRef.current.style.setProperty("--posy", `${glareY}%`);
      const hyp = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      cardRef.current.style.setProperty("--hyp", `${hyp}`);
    },
    [isLowSpec]
  );
  const onMouseEnter = () => {
    if (isLowSpec) return;
    setIsInteracting(true);
    if (cardRef.current) cardRef.current.style.setProperty("--o", "1");
  };

  const onMouseLeave = () => {
    if (isLowSpec) return;
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
      if (!isLowSpec) {
        cardElement.addEventListener("mousemove", onMouseMove);
        cardElement.addEventListener("mouseenter", onMouseEnter);
        cardElement.addEventListener("mouseleave", onMouseLeave);
      }

      cardElement.style.setProperty("--mx", "50%");
      cardElement.style.setProperty("--my", "50%");
      cardElement.style.setProperty("--rx", "0deg");
      cardElement.style.setProperty("--ry", "0deg");
      cardElement.style.setProperty("--posx", `50%`);
      cardElement.style.setProperty("--posy", `50%`);
      cardElement.style.setProperty("--o", "0");
      cardElement.style.setProperty("--s", "1");
      cardElement.style.setProperty("--hyp", "0");
      cardElement.style.setProperty("--red", "#f80e7b");
      cardElement.style.setProperty("--yel", "#eedf10");
      cardElement.style.setProperty("--gre", "#21e985");
      cardElement.style.setProperty("--blu", "#0dbde9");
      cardElement.style.setProperty("--vio", "#c929f1");
      const primaryTypeColor = pokemon.types[0]?.color
        ? `#${pokemon.types[0].color}`
        : "#69d1e9";
      cardElement.style.setProperty("--glow", primaryTypeColor);
    }
    return () => {
      if (cardElement && !isLowSpec) {
        cardElement.removeEventListener("mousemove", onMouseMove);
        cardElement.removeEventListener("mouseenter", onMouseEnter);
        cardElement.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [onMouseMove, pokemon.types, isLowSpec]);

  const imagePath = `/images/pokemon/${pokemon.numero}.png`;
  const placeholderImage = "/images/pokeball_placeholder.gif";

  return (
    <div className="holo-card-container-wrapper">
      <div className="holo-card-perspective-container">
        <div
          ref={cardRef}
          className={`holo-card-element ${
            isInteracting && !isLowSpec ? "interacting" : ""
          }`}
          style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
        >
          <div className="holo-card-content">
            <div className="holo-card-image-container">
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
              {!isLowSpec && (
                <>
                  <div className="holo-card-shine-overlay"></div>
                  <div className="holo-card-glare-overlay"></div>
                </>
              )}
            </div>
            <div className="holo-card-info">
              <h3 className="holo-pokemon-name">{pokemon.nom}</h3>
              <p className="holo-pokemon-number">
                #{String(pokemon.numero).padStart(3, "0")}
              </p>
              <div className="holo-pokemon-types">
                {pokemon.types.map((type) => (
                  <span
                    key={type.name}
                    className="type-badge-custom"
                    style={{ backgroundColor: `#${type.color}` }}
                  >
                    {type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoloPokemonCard;
