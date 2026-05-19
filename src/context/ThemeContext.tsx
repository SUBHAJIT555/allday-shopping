"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ColorPalette, defaultColors, generateColorPalette, presetColors } from "@/config/colors";

interface ThemeContextType {
  colors: ColorPalette;
  setPrimaryColor: (color: string) => void;
  resetToDefault: () => void;
  presetColors: typeof presetColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [colors, setColors] = useState<ColorPalette>(defaultColors);

  // Load saved color from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem("theme-primary-color");
    if (savedColor) {
      const palette = generateColorPalette(savedColor);
      setColors(palette);
      updateCSSVariables(palette);
    } else {
      updateCSSVariables(defaultColors);
    }
  }, []);

  // Helper function to convert hex to rgba with opacity
  const hexToRgba = (hex: string, opacity: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(147, 51, 234, ${opacity})`;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Update CSS variables when colors change
  const updateCSSVariables = (palette: ColorPalette) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", palette.primary);
    root.style.setProperty("--color-primary-dark", palette.primaryDark);
    root.style.setProperty("--color-primary-light", palette.primaryLight);
    root.style.setProperty("--color-primary-light-2", palette.primaryLight2);
    root.style.setProperty("--color-primary-light-3", palette.primaryLight3);
    root.style.setProperty("--color-primary-light-4", palette.primaryLight4);
    root.style.setProperty("--color-primary-light-5", palette.primaryLight5);
    // Add ring color with opacity for focus states
    root.style.setProperty("--color-primary-ring", hexToRgba(palette.primary, 0.2));
  };

  const setPrimaryColor = (color: string) => {
    const palette = generateColorPalette(color);
    setColors(palette);
    updateCSSVariables(palette);
    localStorage.setItem("theme-primary-color", color);
  };

  const resetToDefault = () => {
    setColors(defaultColors);
    updateCSSVariables(defaultColors);
    localStorage.removeItem("theme-primary-color");
  };

  return (
    <ThemeContext.Provider
      value={{
        colors,
        setPrimaryColor,
        resetToDefault,
        presetColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
