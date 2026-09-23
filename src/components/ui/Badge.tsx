import React from "react";
import { View, Text, ViewStyle, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type BadgeVariant = "emerald" | "amber" | "violet" | "slate" | "blue";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  children: React.ReactNode;
}

const sizeStyles: Record<string, ViewStyle> = {
  sm: { paddingHorizontal: 8, paddingVertical: 2 },
  md: { paddingHorizontal: 12, paddingVertical: 4 },
};

const textSizeStyles: Record<string, string> = {
  sm: "text-xs",
  md: "text-sm",
};

export function Badge({ variant = "slate", size = "md", children }: BadgeProps) {
  const { colors, isDark } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "emerald":
        return {
          bg: isDark ? "rgba(48, 209, 88, 0.16)" : "rgba(52, 199, 89, 0.12)",
          text: isDark ? "#30D158" : "#34C759",
        };
      case "amber":
        return {
          bg: isDark ? "rgba(255, 204, 0, 0.16)" : "rgba(255, 204, 0, 0.12)",
          text: isDark ? "#FFD60A" : "#FF9F0A",
        };
      case "violet":
        return {
          bg: isDark ? "rgba(191, 90, 242, 0.16)" : "rgba(191, 90, 242, 0.12)",
          text: isDark ? "#BF5AF2" : "#8B5CF6",
        };
      case "blue":
        return {
          bg: isDark ? "rgba(10, 132, 255, 0.16)" : "rgba(0, 122, 255, 0.12)",
          text: isDark ? "#0A84FF" : "#007AFF",
        };
      case "slate":
      default:
        return {
          bg: isDark ? "rgba(255, 255, 255, 0.10)" : "rgba(0, 0, 0, 0.04)",
          text: isDark ? "rgba(235, 235, 245, 0.60)" : "rgba(60, 60, 67, 0.60)",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View
      style={[
        styles.container,
        sizeStyles[size],
        { backgroundColor: variantStyles.bg, borderRadius: 8 },
      ]}
    >
      <Text style={{ fontSize: size === 'sm' ? 12 : 14, color: variantStyles.text, fontWeight: "500" }}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous" as const,
  },
});