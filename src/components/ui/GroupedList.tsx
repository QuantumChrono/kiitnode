import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type GroupedListProps = {
  children: React.ReactNode;
};

export default function GroupedList({ children }: GroupedListProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, {
      backgroundColor: colors.card,
      borderColor: colors.separator
    }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderCurve: "continuous" as const,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
});