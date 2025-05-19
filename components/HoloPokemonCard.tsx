"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PokemonData } from "@lib/definitions";
import TypeBadge from "@components/TypeBadge";
// Le CSS est importé globalement dans layout.tsx ou la page concernée.
// Pas d'import de CSS module ici si le fichier .css est global.

interface HoloPokemonCardProps {
  pokemon: PokemonData;
}

// Carte Pokémon avec effet holographique interactif.
const HoloPokemonCard: React.FC<HoloPokemonCardProps> = ({ pokemon }) => {
  const cardRef = useRef<HTMLDivElement>(null); // Référence à l'élément principal de la carte.
  const [isInteracting, setIsInteracting] = useState(false); // État pour savoir si la souris est sur la carte.

  // Gère le mouvement de la souris sur la carte pour l'effet 3D et les reflets.
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    // Coordonnées de la souris relatives à la carte (normalisées entre -1 et 1).
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1); // Inversé pour la rotation X.

    // Calcul des rotations.
    const rotateY = mouseX * 15; // Angle de rotation Y (max 15deg).
    const rotateX = mouseY * 15; // Angle de rotation X (max 15deg).

    // Position du reflet (glare) sur l'image.
    // On calcule par rapport au conteneur de l'image pour plus de précision.
    const imageContainer = cardRef.current.querySelector(
      ".holo-card-image-container"
    );
    let glareXPercent = 50; // Valeur par défaut au centre.
    let glareYPercent = 50;

    if (imageContainer) {
      const imgRect = imageContainer.getBoundingClientRect();
      const imgMouseX = e.clientX - imgRect.left;
      const imgMouseY = e.clientY - imgRect.top;
      glareXPercent = (imgMouseX / imgRect.width) * 100;
      glareYPercent = (imgMouseY / imgRect.height) * 100;
    }

    // Application des transformations et positions via les variables CSS.
    cardRef.current.style.setProperty("--rx", `${rotateX}deg`);
    cardRef.current.style.setProperty("--ry", `${rotateY}deg`);
    cardRef.current.style.setProperty("--mx", `${glareXPercent}%`); // Pour le radial-gradient du reflet.
    cardRef.current.style.setProperty("--my", `${glareYPercent}%`);
    cardRef.current.style.setProperty("--posx", `${glareXPercent}%`); // Pour le fond de l'effet "shine".
    cardRef.current.style.setProperty("--posy", `${glareYPercent}%`);

    // Hypothénuse pour moduler l'intensité de certains effets.
    const hyp = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    cardRef.current.style.setProperty("--hyp", `${hyp}`);
  }, []); // `useCallback` pour mémoriser la fonction.

  // Quand la souris entre sur la carte.
  const onMouseEnter = () => {
    setIsInteracting(true);
    if (cardRef.current) cardRef.current.style.setProperty("--o", "1"); // Opacité des effets à fond.
  };

  // Quand la souris quitte la carte.
  const onMouseLeave = () => {
    setIsInteracting(false);
    if (cardRef.current) {
      // Réinitialisation des transformations et effets.
      cardRef.current.style.setProperty("--rx", "0deg");
      cardRef.current.style.setProperty("--ry", "0deg");
      cardRef.current.style.setProperty("--mx", "50%");
      cardRef.current.style.setProperty("--my", "50%");
      cardRef.current.style.setProperty("--posx", "50%");
      cardRef.current.style.setProperty("--posy", "50%");
      cardRef.current.style.setProperty("--o", "0"); // Effets transparents.
      cardRef.current.style.setProperty("--hyp", "0");
    }
  };

  // Effet pour initialiser la carte et gérer les listeners d'événements.
  useEffect(() => {
    const cardElement = cardRef.current;
    if (cardElement) {
      // Détection des appareils tactiles pour désactiver l'effet de survol par souris.
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      if (!isTouchDevice) {
        cardElement.addEventListener("mousemove", onMouseMove);
        cardElement.addEventListener("mouseenter", onMouseEnter);
        cardElement.addEventListener("mouseleave", onMouseLeave);
      } else {
        // Pour les écrans tactiles, on peut mettre une opacité fixe légère pour les effets.
        cardElement.style.setProperty("--o", "0.3");
      }

      // Initialisation des variables CSS.
      cardElement.style.setProperty("--mx", "50%"); // Position X du reflet au centre.
      cardElement.style.setProperty("--my", "50%"); // Position Y du reflet au centre.
      cardElement.style.setProperty("--rx", "0deg"); // Rotation X initiale.
      cardElement.style.setProperty("--ry", "0deg"); // Rotation Y initiale.
      cardElement.style.setProperty("--posx", "50%"); // Position X du fond "shine".
      cardElement.style.setProperty("--posy", "50%"); // Position Y du fond "shine".
      if (!isTouchDevice) cardElement.style.setProperty("--o", "0"); // Opacité des effets.
      cardElement.style.setProperty("--s", "1"); // Échelle initiale.
      cardElement.style.setProperty("--hyp", "0"); // Hypothénuse initiale.

      // Couleurs de base pour l'effet (peuvent être surchargées ou non utilisées).
      // cardElement.style.setProperty("--red", "#f80e7b");
      // cardElement.style.setProperty("--yel", "#eedf10");
      // ...

      // Couleur de "lueur" basée sur le type primaire du Pokémon.
      const primaryTypeColor = pokemon.types[0]?.color
        ? `#${pokemon.types[0].color}`
        : "#69d1e9"; // Bleu par défaut.
      cardElement.style.setProperty("--glow", primaryTypeColor);

      // Nettoyage des listeners quand le composant est démonté.
      return () => {
        if (!isTouchDevice && cardElement) {
          cardElement.removeEventListener("mousemove", onMouseMove);
          cardElement.removeEventListener("mouseenter", onMouseEnter);
          cardElement.removeEventListener("mouseleave", onMouseLeave);
        }
      };
    }
    // `onMouseMove` est dans les dépendances car c'est un `useCallback`.
    // `pokemon.types` pour mettre à jour la couleur `--glow` si le Pokémon change.
  }, [onMouseMove, pokemon.types]);

  const imagePath = `/images/pokemon/${pokemon.numero}.png`;
  const placeholderImage = "/images/pokeball_placeholder.gif"; // Fallback si image non trouvée.

  return (
    // Les classes CSS ici correspondent à celles définies dans HoloPokemonCard.css
    <div className="holo-card-container-wrapper">
      <div className="holo-card-perspective-container">
        <div
          ref={cardRef}
          className={`holo-card-element ${isInteracting ? "interacting" : ""}`} // Classe conditionnelle pour l'interaction.
        >
          <div className="holo-card-content">
            {/* Conteneur de l'image et des effets de brillance/reflet. */}
            <div className="holo-card-image-container">
              <Image
                src={imagePath}
                alt={pokemon.nom}
                width={240} // Largeur fixe pour l'image dans la carte.
                height={Math.floor(336 * 0.7)} // Hauteur basée sur 70% de la carte.
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = placeholderImage;
                }}
                priority={pokemon.numero <= 12} // Prioriser les premières images.
              />
              {/* Overlays pour les effets holographiques. */}
              <div className="holo-card-shine-overlay"></div>
              <div className="holo-card-glare-overlay"></div>
            </div>

            {/* Zone d'informations du Pokémon (nom, numéro, types). */}
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
