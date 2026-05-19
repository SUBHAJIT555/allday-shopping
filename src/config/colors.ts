// Centralized Color Configuration
// This is the single source of truth for all theme colors

export interface ColorPalette {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryLight2: string;
  primaryLight3: string;
  primaryLight4: string;
  primaryLight5: string;
}

// Default color palette (purple theme)
export const defaultColors: ColorPalette = {
  primary: "#9333EA",
  primaryDark: "#7E22CE",
  primaryLight: "#A855F7",
  primaryLight2: "#C084FC",
  primaryLight3: "#D8B4FE",
  primaryLight4: "#E9D5FF",
  primaryLight5: "#F3E8FF",
};

// Helper function to generate color variations from a base color
export function generateColorPalette(baseColor: string): ColorPalette {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  // Lighten color
  const lighten = (hex: string, percent: number) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const amount = percent / 100;
    return rgbToHex(
      Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount)),
      Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount)),
      Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount))
    );
  };

  // Darken color
  const darken = (hex: string, percent: number) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const amount = percent / 100;
    return rgbToHex(
      Math.max(0, Math.round(rgb.r * (1 - amount))),
      Math.max(0, Math.round(rgb.g * (1 - amount))),
      Math.max(0, Math.round(rgb.b * (1 - amount)))
    );
  };

  return {
    primary: baseColor,
    primaryDark: darken(baseColor, 25),
    primaryLight: lighten(baseColor, 10),
    primaryLight2: lighten(baseColor, 25),
    primaryLight3: lighten(baseColor, 40),
    primaryLight4: lighten(baseColor, 50),
    primaryLight5: lighten(baseColor, 65),
  };
}

// Preset color options for quick selection
export const presetColors = [
  { name: "Purple", value: "#9333EA" },
  { name: "Blue", value: "#3C50E0" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Lime", value: "#84CC16" },
  { name: "Green", value: "#22C55E" },
  { name: "Emerald", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Sky", value: "#0EA5E9" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Violet", value: "#8B5CF6" },
];
