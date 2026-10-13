import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function AppleFloatingTabBar({ state, descriptors, navigation, insets }: any) {
  const colors = useThemeColors();

  return (
    <View style={[
      styles.container,
      {
        bottom: insets?.bottom != null ? Math.max(insets.bottom + 8, 16) : 16,
        zIndex: 50,
        backgroundColor: colors.card,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.separator,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: colors.isDark ? 0.4 : 0.08,
        shadowRadius: 16,
      }
    ]}>
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
              {options.tabBarIcon({ color, size: 22 })}
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
  tabContent: {
    flex: 1,
    flexDirection: "row",
  },
  tabItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 3,
  },
});
