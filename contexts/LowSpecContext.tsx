"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface LowSpecContextType {
  isLowSpec: boolean;
  toggleLowSpec: () => void;
}

const LowSpecContext = createContext<LowSpecContextType | undefined>(undefined);

export const LowSpecProvider = ({ children }: { children: ReactNode }) => {
  const [isLowSpec, setIsLowSpec] = useState(false);

  const toggleLowSpec = () => {
    setIsLowSpec((prev) => !prev);
  };

  return (
    <LowSpecContext.Provider value={{ isLowSpec, toggleLowSpec }}>
      {children}
    </LowSpecContext.Provider>
  );
};

export const useLowSpec = (): LowSpecContextType => {
  const context = useContext(LowSpecContext);
  if (context === undefined) {
    throw new Error("useLowSpec must be used within a LowSpecProvider");
  }
  return context;
};
