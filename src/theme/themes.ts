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
  text: string;
  textDim: string;
  textMuted: string;
  white: string;
}>;

export type ThemePreset = Readonly<{
  id: string;
  name: string;
  colors: ThemeColors;
}>;

/**
 * Your custom scheme (Forest + Gold).
 * NOTE: I preserved your values exactly.
 */
const FOREST_GOLD: ThemePreset = {
  id: "forest_gold",
  name: "Forest Gold",
  colors: {
    bg: "#232424",
    card: "#1c1d20",
    cardBorder: "#765812",
    accent: "#0b440c",
    success: "#165d0e",
    successDim: "rgba(0, 230, 118, 0.15)",
    text: "#795c0c",
    textDim: "#085c1a",
    textMuted: "#23603b",
    white: "#ffffff54",
  },
} as const;

/**
 * A second preset (example) — keeps your old theme around as an option.
 * Adjust as you like.
 */
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
    text: "#e8eaf6",
    textDim: "#7986cb",
    textMuted: "#3d4566",
    white: "#ffffff",
  },
} as const;

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