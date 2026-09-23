import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, Switch } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Edit3, ChevronRight, CheckCircle2, LogOut, Sun, Moon } from "lucide-react-native";

interface EditProfileModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onAppearanceChange: (isDark: boolean) => void;
  isDark: boolean;
}

export default function EditProfileModal({
  visible,
  onRequestClose,
  onAppearanceChange,
  isDark,
}: EditProfileModalProps) {
  const colors = useThemeColors();

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
      statusBarTranslucent
      supportedOrientations={["portrait"]}
    >
      <Pressable style={styles.backdrop} onPress={onRequestClose}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <Pressable style={styles.closeButton} onPress={onRequestClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {/* Appearance Toggle */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Appearance</Text>
            <Switch
              value={isDark}
              onValueChange={onAppearanceChange}
              trackColor={{ false: colors.separator, true: colors.tint }}
              thumbColor="#FFFFFF"
              style={styles.toggle}
            />
            <Text style={styles.toggleValue}>
              {isDark ? "Dark" : "Light"}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable style={styles.actionItem} onPress={onRequestClose}>
              <Text style={styles.actionText}>Done</Text>
            </Pressable>
            <Pressable style={styles.actionItem}>
              <Text style={[{ ...styles.actionText, color: "#FF3B30" }]}>
                Sign Out
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  toggleLabel: {
    fontSize: 17,
    fontWeight: "400",
  },
  toggle: {
    width: 50,
    height: 28,
  },
  toggleValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginVertical: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionItem: {
    flex: 1,
    paddingVertical: 16,
  },
  actionText: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
});