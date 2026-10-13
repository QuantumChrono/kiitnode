import React from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const DEV_ACCOUNTS = [
  { email: '2205001@kiit.ac.in', name: 'Arjun', role: 'CSE' },
  { email: '2205002@kiit.ac.in', name: 'Sneha', role: 'Mech' },
  { email: '2205003@kiit.ac.in', name: 'Ravi', role: 'Mod' },
];

export default function LoginScreen() {
  const { signInWithGoogle, isLoading, devSwitchUser, domainError, clearDomainError } = useAuth();
  const colors = useThemeColors();

  // Show domain error as native alert
  React.useEffect(() => {
    if (domainError) {
      Alert.alert('Access Denied', domainError, [
        { text: 'OK', onPress: clearDomainError },
      ]);
    }
  }, [domainError, clearDomainError]);

  const handleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    signInWithGoogle();
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={colors.isDark
          ? ['#0E1116', '#064E3B', '#0E1116'] as const
          : ['#F8F9FA', '#E8F5E9', '#F8F9FA'] as const}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.5, 1]}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Brand header */}
        <View style={styles.header}>
          <Text
            style={[styles.brandTitle, { color: colors.label }]}
            accessibilityRole="header"
          >
            KIIT Node
          </Text>
          <Text style={[styles.brandSubtitle, { color: colors.secondaryLabel }]}>
            The Verified Campus Network
          </Text>
        </View>

        {/* Auth card */}
        <View style={[styles.authCard, {
          backgroundColor: colors.card,
          borderColor: colors.separator,
        }]}>
          {/* Primary CTA */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: pressed ? colors.tintPressed : colors.tint },
              { transform: [{ scale: pressed ? 0.97 : 1 }], opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={handleSignIn}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Continue with KIIT Mail"
            accessibilityState={{ disabled: isLoading }}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Continue with KIIT Mail</Text>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.separator }]} />
            <Text style={[styles.dividerText, { color: colors.tertiaryLabel }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.separator }]} />
          </View>

          {/* Disclaimer */}
          <Text style={[styles.disclaimer, { color: colors.secondaryLabel }]}>
            Restricted to verified @kiit.ac.in accounts only.{'\n'}
            Student-run community, not officially affiliated with KIIT.
          </Text>
        </View>

        {/* Dev bypass */}
        {__DEV__ && (
          <View style={styles.devSection}>
            <Text style={[styles.devLabel, { color: colors.tertiaryLabel }]}>
              DEVELOPER ACCOUNTS
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.devScroll}
            >
              {DEV_ACCOUNTS.map((acct) => (
                <Pressable
                  key={acct.email}
                  style={({ pressed }) => [
                    styles.devPill,
                    { backgroundColor: colors.cardPressed },
                    pressed && {
                      transform: [{ scale: 0.97 }],
                      opacity: 0.85,
                    },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    devSwitchUser(acct.email);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Sign in as ${acct.name}`}
                >
                  <Text style={[styles.devPillText, { color: colors.label }]}>
                    {acct.name} · {acct.role}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  // Header
  header: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 8,
  },
  // Auth card
  authCard: {
    borderRadius: 24,
    borderCurve: 'continuous' as const,
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 48,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 14,
    borderCurve: 'continuous' as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontSize: 13,
    marginHorizontal: 12,
  },
  // Disclaimer
  disclaimer: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Dev
  devSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  devLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  devScroll: {
    paddingHorizontal: 4,
    gap: 8,
  },
  devPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderCurve: 'continuous' as const,
  },
  devPillText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
