/**
 * BudgetBuddy — Theme Presets
 * File: src/theme/themes.ts
 *
 * Defines all user-selectable color scheme presets.
 * These are pure data objects (no React), making them fast and easy to reuse.
 */

export type ThemeColors = Readonly<{
  bg: string;
  card: string;
  cardBorder: string;
  accent: string;
  success: string;
  successDim: string;
  warning: string;        
  warningDim: string;     
  danger: string;         
  dangerDim: string;      
  text: string;
  textDim: string;
  textMuted: string;
  white: string;
  teal: string;           
  tealDim: string;        
}>;

export type ThemePreset = Readonly<{
  id: string;
  name: string;
  colors: ThemeColors;
}>;

const FOREST_GOLD: ThemePreset = {
  id: "forest_gold",
  name: "Forest Gold",
  colors: {
    bg: "#232424",
    card: "#1c1d20",
    cardBorder: "#765812",
    accent: "#0b440c",
    success: "#165d0e",
    successDim: "rgba(22, 93, 14, 0.15)",
    warning: "#d4a00c",                      
    warningDim: "rgba(212, 160, 12, 0.15)",
    danger: "#a83232",                       
    dangerDim: "rgba(168, 50, 50, 0.15)",    
    text: "#795c0c",
    textDim: "#085c1a",
    textMuted: "#23603b",
    white: "#ffffff54",
    teal: "#0c8a7a",                         
    tealDim: "rgba(12, 138, 122, 0.15)",  
  },
};

const NEON_PURPLE: ThemePreset = {
  id: "neon_purple",
  name: "Neon Purple",
  colors: {
    bg: "#0a0e1a",
    card: "#131829",
    cardBorder: "#1e2642",
    accent: "#6c5ce7",
    success: "#00e676",
    successDim: "rgba(0, 230, 118, 0.15)",
    warning: "#ffc107",                      
    warningDim: "rgba(255, 193, 7, 0.15)",   
    danger: "#ff5252",                       
    dangerDim: "rgba(255, 82, 82, 0.15)",    
    text: "#e8eaf6",
    textDim: "#7986cb",
    textMuted: "#3d4566",
    white: "#ffffff",
    teal: "#00bcd4",                         
    tealDim: "rgba(0, 188, 212, 0.15)", 
  },
};

/** Add more presets here later */
export const THEME_PRESETS: readonly ThemePreset[] = [FOREST_GOLD, NEON_PURPLE] as const;

/** Default theme the app uses on first launch */
export const DEFAULT_THEME_ID: ThemePreset["id"] = "forest_gold";

/**
 * Fast lookup map (O(1)) to avoid scanning arrays.
 */
export const THEME_BY_ID: Readonly<Record<string, ThemePreset>> = THEME_PRESETS.reduce(
  (acc, preset) => {
    acc[preset.id] = preset;
    return acc;
  },
  {} as Record<string, ThemePreset>
);