import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

interface GuidelinesModalProps {
  visible: boolean;
  onRequestClose: () => void;
}

export default function GuidelinesModal({
  visible,
  onRequestClose,
}: GuidelinesModalProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="slide"
      statusBarTranslucent
      supportedOrientations={["portrait"]}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onRequestClose();
          }}
        />

        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.card,
              paddingBottom: Math.max(insets.bottom, 24),
            },
          ]}
        >
          {/* Grabber */}
          <View style={[styles.grabber, { backgroundColor: colors.tertiaryLabel }]} />

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.separator }]}>
            <Text style={[styles.headerTitle, { color: colors.label }]}>
              Community Guidelines
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onRequestClose();
              }}
              hitSlop={12}
            >
              <Text style={[styles.closeButtonText, { color: colors.secondaryLabel }]}>
                ✕
              </Text>
            </Pressable>
          </View>

          {/* Scrollable Guidelines Content */}
          <ScrollView
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <Text style={[styles.introText, { color: colors.secondaryLabel }]}>
              KIIT Node is a trusted campus network built on mutual respect, collaboration, and safety.
              Please adhere to these guidelines to ensure a productive environment for everyone:
            </Text>

            <View style={styles.itemBlock}>
              <Text style={[styles.itemTitle, { color: colors.label }]}>• Respect and Safety</Text>
              <Text style={[styles.itemBody, { color: colors.secondaryLabel }]}>
                Treat every member with dignity. Harassment, discrimination, hateful remarks, or intimidation are strictly forbidden and subject to account review.
              </Text>
            </View>

            <View style={styles.itemBlock}>
              <Text style={[styles.itemTitle, { color: colors.label }]}>• Relevant Campus Posts</Text>
              <Text style={[styles.itemBody, { color: colors.secondaryLabel }]}>
                Keep discussions in their respective zones: Teammates for projects & hackathons, Marketplace for campus exchanges, Forum for questions & notes.
              </Text>
            </View>

            <View style={styles.itemBlock}>
              <Text style={[styles.itemTitle, { color: colors.label }]}>• Authentic Transactions</Text>
              <Text style={[styles.itemBody, { color: colors.secondaryLabel }]}>
                For marketplace items, arrange in-person exchanges at public campus spots (food courts, hostel gates, library lawns) and verify condition before finalizing.
              </Text>
            </View>

            <View style={styles.itemBlock}>
              <Text style={[styles.itemTitle, { color: colors.label }]}>• Responsible Pseudonymity</Text>
              <Text style={[styles.itemBody, { color: colors.secondaryLabel }]}>
                Anonymous posting protects your privacy in the forum feed while preserving server-side accountability for community safety. Do not abuse anonymity for spam or harm.
              </Text>
            </View>

            <View style={styles.itemBlock}>
              <Text style={[styles.itemTitle, { color: colors.label }]}>• Community Reporting</Text>
              <Text style={[styles.itemBody, { color: colors.secondaryLabel }]}>
                If you encounter content that violates these policies, submit a report to queue it for moderator review.
              </Text>
            </View>
          </ScrollView>

          {/* Action Button */}
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: colors.tint,
                opacity: pressed ? 0.88 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onRequestClose();
            }}
          >
            <Text style={styles.actionText}>Understood</Text>
          </Pressable>
        </View>
      </View>
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderCurve: "continuous",
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: "85%",
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  closeButton: {
    padding: 6,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  contentScroll: {
    maxHeight: 380,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  itemBlock: {
    marginBottom: 14,
    gap: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  itemBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButton: {
    height: 50,
    borderRadius: 14,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});