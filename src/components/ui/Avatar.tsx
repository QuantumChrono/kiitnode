import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg" | number;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getSizeStyle(size: "sm" | "md" | "lg" | number) {
  if (typeof size === "number") {
    return { width: size, height: size, borderRadius: size / 2 };
  }
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
  };
  const s = sizes[size] || 48;
  return { width: s, height: s, borderRadius: s / 2 };
}

function getFontSize(size: "sm" | "md" | "lg" | number): number {
  if (typeof size === "number") {
    return Math.max(12, size / 3);
  }
  const sizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };
  return sizes[size] || 16;
}

export function Avatar({ name = "", size = "md", className = "" }: AvatarProps) {
  const { isDark } = useTheme();
  const initials = getInitials(name || "?");
  const sizeStyle = getSizeStyle(size);
  const fontSize = getFontSize(size);

  const bgStyle = isDark
    ? { backgroundColor: "#3B3B3D" }
    : { backgroundColor: "#E5E5EA" };

  return (
    <View
      style={[
        styles.container,
        sizeStyle,
        bgStyle,
        className ? { } : undefined,
      ]}
      className={className}
    >
      <Text style={[styles.initials, { fontSize }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous" as const,
  },
  initials: {
    fontWeight: "500",
    color: "#8E8E93",
  },
});