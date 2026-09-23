import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";

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
  glassBorder: string;
  green: string;
  greenTint: string;
  blue: string;
}

const lightColors: ThemeColors = {
  bg: "#F2F2F7",
  card: "#FFFFFF",
  cardPressed: "#E5E5EA",
  label: "#000000",
  secondaryLabel: "rgba(60, 60, 67, 0.60)",
  tertiaryLabel: "rgba(60, 60, 67, 0.30)",
  separator: "rgba(60, 60, 67, 0.18)",
  glassBorder: "rgba(0, 0, 0, 0.08)",
  green: "#34C759",
  greenTint: "rgba(52, 199, 89, 0.12)",
  blue: "#007AFF",
};

const darkColors: ThemeColors = {
  bg: "#000000",
  card: "#1C1C1E",
  cardPressed: "#2C2C2E",
  label: "#FFFFFF",
  secondaryLabel: "rgba(235, 235, 245, 0.60)",
  tertiaryLabel: "rgba(235, 235, 245, 0.30)",
  separator: "rgba(84, 84, 88, 0.55)",
  glassBorder: "rgba(255, 255, 255, 0.16)",
  green: "#30D158",
  greenTint: "rgba(48, 209, 88, 0.16)",
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
  const systemColorScheme = useColorScheme();
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