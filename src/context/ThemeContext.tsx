import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
  colors: ThemeColors;
}

interface ThemeColors {
  bg: string;
  card: string;
  cardPressed: string;
  label: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  separator: string;
  tint: string;
  tintPressed: string;
  success: string;
  error: string;
  // Legacy aliases — kept so existing consumers don't break
  glassBorder: string;
  green: string;
  greenTint: string;
  blue: string;
}

const lightColors: ThemeColors = {
  bg: "#F8F9FA",
  card: "#FFFFFF",
  cardPressed: "#F1F3F5",
  label: "#111827",
  secondaryLabel: "#6B7280",
  tertiaryLabel: "#9CA3AF",
  separator: "rgba(0,0,0,0.06)",
  tint: "#10B981",
  tintPressed: "#059669",
  success: "#10B981",
  error: "#DC2626",
  // Legacy aliases
  glassBorder: "rgba(0,0,0,0.06)",
  green: "#10B981",
  greenTint: "rgba(16,185,129,0.12)",
  blue: "#007AFF",
};

const darkColors: ThemeColors = {
  bg: "#0E1116",
  card: "#161B22",
  cardPressed: "#21262D",
  label: "#F9FAFB",
  secondaryLabel: "#9CA3AF",
  tertiaryLabel: "#4B5563",
  separator: "rgba(255,255,255,0.08)",
  tint: "#10B981",
  tintPressed: "#34D399",
  success: "#10B981",
  error: "#F87171",
  // Legacy aliases
  glassBorder: "rgba(255,255,255,0.08)",
  green: "#10B981",
  greenTint: "rgba(16,185,129,0.16)",
  blue: "#0A84FF",
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  isDark: false,
  colors: lightColors,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    // Default to light theme - UI.md specifies light as default
    // Sync with nativewind color scheme for dark: classes
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const isDark = theme === "dark";
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}