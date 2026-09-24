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

  const baseStyle = [
    styles.container,
    {
      borderColor: colors.separator,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isDark
        ? 'rgba(255, 255, 255, 0.10)'
        : 'rgba(255, 255, 255, 0.80)',
      shadowOpacity: isDark ? 0 : 0.04,
    },
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          baseStyle,
          {
            backgroundColor: pressed ? colors.cardPressed : colors.card,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.90 : 1,
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      style={[
        baseStyle,
        {
          backgroundColor: colors.card,
        },
        style,
      ]}
      className={className}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderCurve: "continuous" as const,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
});