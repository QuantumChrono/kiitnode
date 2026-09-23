import React from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ChevronRight } from "lucide-react-native";

interface GroupedRowProps {
  label: string;
  value?: string;
  leftIcon?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  showChevron?: boolean;
  showSeparator?: boolean;
  onPress?: () => void;
  isLast?: boolean;
  style?: ViewStyle;
}

export function GroupedRow({
  label,
  value,
  leftIcon,
  rightAccessory,
  showChevron = false,
  showSeparator = true,
  onPress,
  isLast = false,
  style,
}: GroupedRowProps) {
  const colors = useThemeColors();

  const content = (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {leftIcon && (
          <View style={[styles.iconContainer, {
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: colors.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            alignItems: "center",
            justifyContent: "center"
          }]}>
            {leftIcon}
          </View>
        )}

        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.label }]}>{label}</Text>
        </View>

        <View style={styles.rightContainer}>
          {value && (
            <Text style={[styles.value, { color: colors.secondaryLabel }]}>
              {value}
            </Text>
          )}
          {rightAccessory}
          {showChevron && (
            <ChevronRight size={16} color={colors.tertiaryLabel} />
          )}
        </View>
      </View>

      {showSeparator && !isLast && (
        <View style={[styles.separator, { backgroundColor: colors.separator }]} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          pressed && { backgroundColor: colors.cardPressed },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  pressable: {
    minHeight: 52,
  },
  container: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    marginRight: 12,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 17,
    fontWeight: "400",
    letterSpacing: -0.41,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  value: {
    fontSize: 17,
    fontWeight: "400",
    letterSpacing: -0.41,
  },
  separator: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
});