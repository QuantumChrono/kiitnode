import React from "react";
import { View, ViewStyle, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ children, className = "", style, onPress }: CardProps) {
  const { colors, isDark } = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.separator,
          shadowOpacity: isDark ? 0.04 : 0.04,
        },
        style,
      ]}
      className={className}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => (pressed ? styles.pressed : undefined)}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderCurve: "continuous" as const,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.85,
  },
});