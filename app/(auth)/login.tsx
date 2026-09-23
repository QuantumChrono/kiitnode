import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { BlurView } from 'expo-blur';

export default function LoginScreen() {
  const { signInWithGoogle, isLoading, devSwitchUser, domainError, clearDomainError } = useAuth();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#000000" : "#F2F2F7" }]}>
      {/* Soft gradient background simulation */}
      <View style={[
        styles.gradientBg,
        { backgroundColor: isDark ? "#1C1C1E" : "rgba(255,255,255,0.8)" }
      ]} />

      <SafeAreaView style={styles.content}>
        {/* Header / Branding */}
        <View style={styles.headerContainer}>
          <View style={[styles.logoCircle, { backgroundColor: colors.green }]}>
            <Text style={styles.logoText}>KN</Text>
          </View>
          <Text style={[styles.title, { color: colors.label }]}>KIIT Node</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryLabel }]}>
            The Verified Campus Network
          </Text>
        </View>

        {/* Auth Box - Apple-style card */}
        <View style={[styles.authCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.green }]}
            onPress={signInWithGoogle}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Continue with KIIT Mail</Text>
            )}
          </TouchableOpacity>

          <Text style={[styles.disclaimer, { color: colors.tertiaryLabel }]}>
            Restricted to verified @kiit.ac.in accounts only.{'\n'}
            Student-run community, not officially affiliated with KIIT.
          </Text>
        </View>

        {/* Developer Bypass - Subtle segmented picker style */}
        {__DEV__ && (
          <View style={styles.devSection}>
            <Text style={[styles.devLabel, { color: colors.tertiaryLabel }]}>
              Quick Access
            </Text>
            <View style={styles.devButtons}>
              <Pressable
                style={[styles.devButton, { backgroundColor: colors.card }]}
                onPress={() => devSwitchUser('2205001@kiit.ac.in')}
              >
                <Text style={[styles.devButtonText, { color: colors.label }]}>Arjun</Text>
                <Text style={[styles.devSubtext, { color: colors.secondaryLabel }]}>CSE</Text>
              </Pressable>
              <Pressable
                style={[styles.devButton, { backgroundColor: colors.card }]}
                onPress={() => devSwitchUser('2205002@kiit.ac.in')}
              >
                <Text style={[styles.devButtonText, { color: colors.label }]}>Sneha</Text>
                <Text style={[styles.devSubtext, { color: colors.secondaryLabel }]}>Mech</Text>
              </Pressable>
              <Pressable
                style={[styles.devButton, styles.devButtonHighlight, { backgroundColor: colors.greenTint, borderColor: colors.green }]}
                onPress={() => devSwitchUser('2205003@kiit.ac.in')}
              >
                <Text style={[styles.devButtonText, { color: colors.green }]}>Ravi</Text>
                <Text style={[styles.devSubtext, { color: colors.green }]}>Mod</Text>
              </Pressable>
            </View>
          </View>
        )}
      </SafeAreaView>

      {/* Domain Error Modal */}
      <Modal visible={!!domainError} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <BlurView tint={isDark ? "dark" : "light"} intensity={40} style={StyleSheet.absoluteFill} />
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalAccent} />
            <Text style={[styles.modalTitle, { color: "#FF3B30" }]}>Access Denied</Text>
            <Text style={[styles.modalMessage, { color: colors.label }]}>
              {domainError}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.cardPressed }]}
              onPress={clearDomainError}
            >
              <Text style={[styles.modalButtonText, { color: colors.blue }]}>Acknowledge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBg: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderCurve: "continuous" as const,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.37,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "400",
    letterSpacing: -0.41,
  },
  authCard: {
    borderRadius: 20,
    borderCurve: "continuous" as const,
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(60, 60, 67, 0.18)",
  },
  primaryButton: {
    height: 50,
    borderRadius: 14,
    borderCurve: "continuous" as const,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.41,
  },
  disclaimer: {
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: -0.08,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
  devSection: {
    marginTop: 40,
    alignItems: "center",
  },
  devLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.07,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  devButtons: {
    flexDirection: "row",
    gap: 12,
  },
  devButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderCurve: "continuous" as const,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(60, 60, 67, 0.18)",
  },
  devButtonHighlight: {
    borderWidth: 1,
  },
  devButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  devSubtext: {
    fontSize: 11,
    fontWeight: "400",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 20,
    borderCurve: "continuous" as const,
    padding: 24,
    overflow: "hidden",
  },
  modalAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#FF3B30",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.35,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    fontWeight: "400",
    letterSpacing: -0.24,
    lineHeight: 22,
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderCurve: "continuous" as const,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.41,
  },
});