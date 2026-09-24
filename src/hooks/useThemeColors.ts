import { useTheme } from "@/context/ThemeContext";

export interface ThemeColors {
  bg: string;
  card: string;
  cardPressed: string;
  label: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  separator: string;
  glassBg: string;
  glassBorder: string;
  tint: string;
  tintBg: string;
  blue: string;
  red: string;
  isDark: boolean;
}

export function useThemeColors(): ThemeColors {
  const { colors, isDark } = useTheme();

  return {
    bg: colors.bg,
    card: colors.card,
    cardPressed: colors.cardPressed,
    label: colors.label,
    secondaryLabel: colors.secondaryLabel,
    tertiaryLabel: colors.tertiaryLabel,
    separator: colors.separator,
    glassBg: isDark ? "rgba(18, 18, 20, 0.92)" : "rgba(248, 248, 250, 0.92)",
    glassBorder: colors.glassBorder,
    tint: colors.green,
    tintBg: colors.greenTint,
    blue: colors.blue,
    red: "#FF3B30",
    isDark,
  };
}