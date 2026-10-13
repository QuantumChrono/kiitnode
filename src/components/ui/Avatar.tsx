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

  const getAvatarColors = (nameStr: string) => {
    if (!nameStr || nameStr === "?") {
      return isDark ? { bg: "#3B3B3D", text: "#8E8E93" } : { bg: "#E5E5EA", text: "#8E8E93" };
    }
    const colors = [
      { bg: '#FFD1DC', text: '#D84361' }, // pastel pink
      { bg: '#D1E8FF', text: '#2B70C9' }, // pastel blue
      { bg: '#D1FFD1', text: '#2D8A2D' }, // pastel green
      { bg: '#FFE5D1', text: '#C96A2B' }, // pastel orange
      { bg: '#E5D1FF', text: '#7E36D9' }, // pastel purple
      { bg: '#FFFFD1', text: '#A89218' }, // pastel yellow
    ];
    // Use first character for color assignment
    const charCode = nameStr.trim().toUpperCase().charCodeAt(0);
    const index = (charCode >= 65 && charCode <= 90) ? (charCode - 65) % colors.length : 0;

    // In dark mode, slightly adjust or just use the same vibrant pairing as they sit nicely against dark too
    // But for a true "warm social" feel, let's keep them opaque and punchy
    return colors[index];
  };

  const { bg, text } = getAvatarColors(name);

  return (
    <View
      style={[
        styles.container,
        sizeStyle,
        { backgroundColor: bg },
        className ? { } : undefined,
      ]}
      className={className}
    >
      <Text style={[styles.initials, { fontSize, color: text }]}>
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