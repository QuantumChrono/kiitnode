import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function AppleFloatingTabBar({ state, descriptors, navigation, insets }: any) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { bottom: insets?.bottom != null ? Math.max(insets.bottom + 8, 16) : 20 }]}>
      {/* Blur background with dimezisBlurView on Android */}
      <BlurView
        intensity={85}
        tint={colors.isDark ? "dark" : "light"}
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
      {/* Glass background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassBg }]} />
      {/* Specular border */}
      <View style={[styles.border, { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.glassBorder }]} />
      {/* Tab content */}
      <View style={styles.tabContent}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const color = isFocused ? colors.tint : colors.tertiaryLabel;

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabItem}
            >
              {options.tabBarIcon({ color, size: 24 })}
              <Text style={[
                styles.tabLabel,
                { color },
              ]}>
                {options.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Export both default and named
export { AppleFloatingTabBar };

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    borderCurve: "continuous" as const,
    overflow: "hidden",
  },
  border: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  tabContent: {
    flex: 1,
    flexDirection: "row",
  },
  tabItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
});