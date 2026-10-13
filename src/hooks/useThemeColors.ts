import { useTheme } from "@/context/ThemeContext";

export interface ThemeColors {
  bg: string;
  card: string;
  cardPressed: string;
  label: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  separator: string;
  tint: string;
  tintPressed: string;
  tintBg: string;
  success: string;
  error: string;
  blue: string;
  isDark: boolean;
  // Legacy aliases — kept so existing consumers don't break
  glassBg: string;
  glassBorder: string;
  red: string;
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
    tint: colors.tint,
    tintPressed: colors.tintPressed,
    tintBg: colors.greenTint,
    success: colors.success,
    error: colors.error,
    blue: colors.blue,
    isDark,
    // Legacy aliases
    glassBg: isDark ? "rgba(22, 27, 34, 0.92)" : "rgba(255, 255, 255, 0.92)",
    glassBorder: colors.glassBorder,
    red: colors.error,
  };
}
