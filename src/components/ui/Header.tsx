import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogOut, Sun, Moon } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColors } from "@/hooks/useThemeColors";

interface HeaderProps {
  showDevSwitch?: boolean;
}

export function Header({ showDevSwitch = false }: HeaderProps) {
  const { toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { signOut, profile } = useAuth();
  const targetRef = React.useRef<View | null>(null);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <View style={[
      styles.container,
      {
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingTop: insets.top,
        height: insets.top + 48,
        overflow: "hidden",
      }
    ]}>
      {/* Glass host */}
      <View style={[
        styles.glassHost,
        {
          backgroundColor: colors.isDark ? '#1C1C1E' : '#FFFFFF',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: colors.separator,
        }
      ]} />

      <View style={styles.content}>
        <View style={styles.leftContainer}>
          <Text style={[styles.title, { color: colors.label }]}>KIIT Node</Text>
        </View>

        <View style={styles.rightContainer}>
          {profile?.campus_location && (
            <View style={[styles.campusPill, { backgroundColor: colors.card }]}>
              <Text style={[styles.campusText, { color: colors.label }]}>
                {profile.campus_location}
              </Text>
            </View>
          )}
          <Pressable onPress={toggleTheme} style={[styles.iconButton, { backgroundColor: colors.card }]} hitSlop={8}>
            {colors.isDark ? <Sun size={18} color={colors.label} /> : <Moon size={18} color={colors.label} />}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute" },
  glassHost: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  leftContainer: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 17, fontWeight: "600", letterSpacing: -0.41 },
  rightContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  campusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  campusText: { fontSize: 12, fontWeight: "500" },
  iconButton: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});