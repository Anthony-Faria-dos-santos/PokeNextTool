"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
// @ts-expect-error Inhibition des erreurs 'non bloquantes' TypeScript comportant des @liases
import { PokemonData } from "@lib/definitions";
// @ts-expect-error Inhibition des erreurs 'non bloquantes' TypeScript comportant des @liases
import TypeBadge from "@components/TypeBadge";
// PAS D'IMPORT DE MODULE CSS ICI

interface HoloPokemonCardProps {
  pokemon: PokemonData;
}

const HoloPokemonCard: React.FC<HoloPokemonCardProps> = ({ pokemon }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const mouseX = (x / rect.width - 0.5) * 2;
    const mouseY = (y / rect.height - 0.5) * -2;
    const rotateY = mouseX * 15;
    const rotateX = mouseY * 15;
    const imageContainer = cardRef.current.querySelector(
      ".holo-card-image-container"
    );
    let glareX = 50;
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
    cardRef.current.style.setProperty("--mx", `${glareX}%`);
    cardRef.current.style.setProperty("--my", `${glareY}%`);
    cardRef.current.style.setProperty("--posx", `${glareX}%`);
    cardRef.current.style.setProperty("--posy", `${glareY}%`);
    const hyp = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    cardRef.current.style.setProperty("--hyp", `${hyp}`);
  }, []);

  const onMouseEnter = () => {
    setIsInteracting(true);
    if (cardRef.current) cardRef.current.style.setProperty("--o", "1");
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
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (!isTouchDevice) {
        cardElement.addEventListener("mousemove", onMouseMove);
        cardElement.addEventListener("mouseenter", onMouseEnter);
        cardElement.addEventListener("mouseleave", onMouseLeave);
      } else {
        cardElement.style.setProperty("--o", "0.3");
      }
      cardElement.style.setProperty("--mx", "50%");
      cardElement.style.setProperty("--my", "50%");
      cardElement.style.setProperty("--rx", "0deg");
      cardElement.style.setProperty("--ry", "0deg");
      cardElement.style.setProperty("--posx", "50%");
      cardElement.style.setProperty("--posy", "50%");
      if (!isTouchDevice) cardElement.style.setProperty("--o", "0");
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

      return () => {
        if (!isTouchDevice && cardElement) {
          cardElement.removeEventListener("mousemove", onMouseMove);
          cardElement.removeEventListener("mouseenter", onMouseEnter);
          cardElement.removeEventListener("mouseleave", onMouseLeave);
        }
      };
    }
    return () => {};
  }, [onMouseMove, pokemon.types]);

  const imagePath = `/images/pokemon/${pokemon.numero}.png`;
  const placeholderImage = "/images/pokeball_placeholder.gif";

  return (
    <div className="holo-card-container-wrapper">
      <div className="holo-card-perspective-container">
        <div
          ref={cardRef}
          className={`holo-card-element ${isInteracting ? "interacting" : ""}`}
        >
          <div className="holo-card-content">
            <div className="holo-card-image-container">
              <Image
                src={imagePath}
                alt={pokemon.nom}
                width={240}
                height={Math.floor(336 * 0.7)}
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
  );
};

export default HoloPokemonCard;
