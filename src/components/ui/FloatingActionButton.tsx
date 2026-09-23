import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FloatingActionButton({ onPress }: { onPress: () => void }) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          position: "absolute",
          bottom: insets.bottom + 88,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: colors.tint,
        }
      ]}
    >
      <Plus size={28} color={colors.label} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});