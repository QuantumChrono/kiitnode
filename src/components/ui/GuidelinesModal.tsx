import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { CheckCircle2 } from "lucide-react-native";

interface GuidelinesModalProps {
  visible: boolean;
  onRequestClose: () => void;
}

export default function GuidelinesModal({
  visible,
  onRequestClose,
}: GuidelinesModalProps) {
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
            <Text style={styles.headerTitle}>Community Guidelines</Text>
            <Pressable style={styles.closeButton} onPress={onRequestClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.guidelinesText}>
              Welcome to KIIT Node! We're a community built on respect, collaboration, and growth.
              Please follow these guidelines to ensure a positive experience for everyone:
            </Text>
            <Text style={styles.guidelinesItem}>
              • Respect others: Treat all members with kindness and respect. Harassment, hate speech,
              or discrimination of any kind will not be tolerated.
            </Text>
            <Text style={styles.guidelinesItem}>
              • Stay on topic: Keep posts relevant to the section you're in (Teammates, Market, Forum, Directory).
            </Text>
            <Text style={styles.guidelinesItem}>
              • No spam: Avoid posting repetitive content, self-promotion without value, or unrelated links.
            </Text>
            <Text style={styles.guidelinesItem}>
              • Protect privacy: Do not share personal information of others without consent.
            </Text>
            <Text style={styles.guidelinesItem}>
              • Report issues: If you see something that violates these guidelines, please report it using the
              report feature or contact a moderator.
            </Text>
            <Text style={styles.guidelinesItem}>
              • Have fun: Remember, we're here to learn, grow, and connect. Enjoy your time on KIIT Node!
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Action */}
          <Pressable style={styles.actionItem} onPress={onRequestClose}>
            <Text style={styles.actionText}>Got it</Text>
          </Pressable>
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
  content: {
    marginBottom: 24,
  },
  guidelinesText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
  guidelinesItem: {
    fontSize: 15,
    marginBottom: 12,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginVertical: 16,
  },
  actionItem: {
    alignItems: "center",
    paddingVertical: 16,
  },
  actionText: {
    fontSize: 17,
    fontWeight: "600",
  },
});