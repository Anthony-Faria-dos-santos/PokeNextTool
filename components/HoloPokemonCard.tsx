"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PokemonData } from "@/lib/definitions"; // Import de l'interface centrale
import TypeBadge from "./TypeBadge"; // Importez le nouveau composant

// Interface pour les props du composant PokemonCard
interface HoloPokemonCardProps {
  pokemon: PokemonData; // Utilise l'interface partagée
}

const HoloPokemonCard: React.FC<HoloPokemonCardProps> = ({ pokemon }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const cardWidth = 240;
  const cardHeight = 336;

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return;

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
  }, []);

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
      cardElement.addEventListener("mousemove", onMouseMove);
      cardElement.addEventListener("mouseenter", onMouseEnter);
      cardElement.addEventListener("mouseleave", onMouseLeave);

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
      // Définir une couleur de "glow" par défaut ou basée sur le type principal du Pokémon
      const primaryTypeColor = pokemon.types[0]?.color
        ? `#${pokemon.types[0].color}`
        : "#69d1e9";
      cardElement.style.setProperty("--glow", primaryTypeColor);
    }

    return () => {
      if (cardElement) {
        cardElement.removeEventListener("mousemove", onMouseMove);
        cardElement.removeEventListener("mouseenter", onMouseEnter);
        cardElement.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [onMouseMove, pokemon.types]);

  const imagePath = `/images/pokemon/${pokemon.numero}.png`;
  const placeholderImage = "/images/pokeball_placeholder.gif";

  return (
    <>
      <style jsx global>{`
        /* Styles pour HoloPokemonCard */
        .holo-card-container-wrapper {
          padding: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .holo-card-perspective-container {
          perspective: 1000px;
        }

        /* --card-width et --card-height peuvent être définis ici ou dynamiquement via JS si nécessaire */
        /* Pour l'instant, ils sont fixés dans le JS à 240px et 336px */
        .holo-card-element {
          /* width: var(--card-width, 240px); */ /* Exemple si on utilisait des var CSS */
          /* height: var(--card-height, 336px); */
          border-radius: 15px;
          transform-style: preserve-3d;
          will-change: transform;
          transition: transform 0.05s ease-out, box-shadow 0.2s ease-out;
          position: relative;
          overflow: hidden;
          box-shadow: 0px 8px 16px -4px rgba(0, 0, 0, 0.3);
          transform: rotateY(var(--ry)) rotateX(var(--rx)) scale(var(--s));
          background-color: #2d3748; /* Fond Gris Anthracite */
        }

        .holo-card-element.interacting {
          box-shadow: 0px 15px 30px -5px rgba(0, 0, 0, 0.5),
            0 0 12px 2px var(--glow), 0 0 24px 4px var(--glow, #69d1e980);
        }

        .holo-card-content {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          border-radius: inherit;
        }

        .holo-card-image-container {
          width: 100%;
          height: 70%;
          position: relative;
          overflow: hidden;
          border-top-left-radius: inherit;
          border-top-right-radius: inherit;
          background-color: #4a5568;
        }

        /* Les styles pour img sont déjà bien gérés par le composant Next/Image */

        .holo-card-shine-overlay,
        .holo-card-glare-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          pointer-events: none;
          z-index: 1;
          opacity: var(--o);
          transition: opacity 0.2s ease-out;
          transform: translateZ(10px);
        }

        .holo-card-shine-overlay {
          --space: 2px;
          --h: 21;
          --s-hsl: 70%;
          --l-hsl: 50%;

          clip-path: inset(0);

          background-image: repeating-linear-gradient(
              90deg,
              hsl(calc(var(--h) * 0), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 0),
              hsl(calc(var(--h) * 0), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 1),
              transparent calc(var(--space) * 1.001),
              transparent calc(var(--space) * 1.999),
              hsl(calc(var(--h) * 1), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 2),
              hsl(calc(var(--h) * 1), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 3),
              transparent calc(var(--space) * 3.001),
              transparent calc(var(--space) * 3.999),
              hsl(calc(var(--h) * 2), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 4),
              hsl(calc(var(--h) * 2), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 5),
              transparent calc(var(--space) * 5.001),
              transparent calc(var(--space) * 5.999),
              hsl(calc(var(--h) * 3), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 6),
              hsl(calc(var(--h) * 3), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 7),
              transparent calc(var(--space) * 7.001),
              transparent calc(var(--space) * 7.999),
              hsl(calc(var(--h) * 4), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 8),
              hsl(calc(var(--h) * 4), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 9),
              transparent calc(var(--space) * 9.001),
              transparent calc(var(--space) * 9.999),
              hsl(calc(var(--h) * 5), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 10),
              hsl(calc(var(--h) * 5), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 11),
              transparent calc(var(--space) * 11.001),
              transparent calc(var(--space) * 11.999),
              hsl(calc(var(--h) * 6), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 12),
              hsl(calc(var(--h) * 6), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 13),
              transparent calc(var(--space) * 13.001),
              transparent calc(var(--space) * 13.999),
              hsl(calc(var(--h) * 7), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 14),
              hsl(calc(var(--h) * 7), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 15),
              transparent calc(var(--space) * 15.001),
              transparent calc(var(--space) * 15.999),
              hsl(calc(var(--h) * 8), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 16),
              hsl(calc(var(--h) * 8), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 17),
              transparent calc(var(--space) * 17.001),
              transparent calc(var(--space) * 17.999),
              hsl(calc(var(--h) * 9), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 18),
              hsl(calc(var(--h) * 9), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 19),
              transparent calc(var(--space) * 19.001),
              transparent calc(var(--space) * 19.999),
              hsl(calc(var(--h) * 10), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 20),
              hsl(calc(var(--h) * 10), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 21),
              transparent calc(var(--space) * 21.001),
              transparent calc(var(--space) * 21.999),
              hsl(calc(var(--h) * 11), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 22),
              hsl(calc(var(--h) * 11), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 23),
              transparent calc(var(--space) * 23.001),
              transparent calc(var(--space) * 23.999),
              hsl(calc(var(--h) * 12), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 24),
              hsl(calc(var(--h) * 12), var(--s-hsl), var(--l-hsl))
                calc(var(--space) * 25)
            ),
            radial-gradient(
              farthest-corner circle at var(--mx) var(--my),
              rgba(255, 255, 255, 0.8) 0%,
              rgba(255, 255, 255, 0.3) 30%,
              rgba(0, 0, 0, 0.3) 90%
            );
          background-blend-mode: overlay, overlay;
          background-position: center, var(--posx) var(--posy);
          background-size: 100% 100%, 220% 220%;
          filter: brightness(calc((var(--hyp) + 0.8) * 0.8)) contrast(1.8)
            saturate(1.2);
          mix-blend-mode: color-dodge;
        }

        .holo-card-glare-overlay {
          background-image: radial-gradient(
            farthest-corner circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.5) 5%,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(0, 0, 0, 0.6) 130%
          );
          mix-blend-mode: overlay;
          opacity: calc(var(--o) * (var(--hyp) + 0.2));
        }

        .holo-card-info {
          padding: 0.75rem;
          text-align: center;
          width: 100%;
          background-color: rgba(
            23,
            37,
            64,
            0.85
          ); /* Bleu Nuit Profond semi-transparent */
          border-bottom-left-radius: inherit;
          border-bottom-right-radius: inherit;
          color: #f7fafc;
          margin-top: auto;
          z-index: 2;
          position: relative;
          transform: translateZ(5px);
        }

        .holo-pokemon-name {
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 0.1rem;
          color: #edf2f7;
        }

        .holo-pokemon-number {
          font-family: "Roboto Mono", monospace;
          font-size: 0.8rem;
          color: #a0aec0;
          margin-bottom: 0.3rem;
        }

        .holo-pokemon-types {
          display: flex;
          justify-content: center;
          gap: 0.4rem;
        }
      `}</style>

      <div className="holo-card-container-wrapper">
        <div className="holo-card-perspective-container">
          <div
            ref={cardRef}
            className={`holo-card-element ${
              isInteracting ? "interacting" : ""
            }`}
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
    </>
  );
};

export default HoloPokemonCard;
