import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function OnboardingScreen() {
  const { updateProfile, profile } = useAuth();
  const colors = useThemeColors();

  const [whatsappNumber, setWhatsappNumber] = useState(profile?.whatsapp_number || '');
  const [campusLocation, setCampusLocation] = useState(profile?.campus_location || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!whatsappNumber.trim() || !campusLocation.trim()) {
      setError("Please fill out both fields.");
      return;
    }

    const cleanedNumber = whatsappNumber.replace(/[^\d+]/g, '');
    if (cleanedNumber.replace(/\D/g, '').length < 10) {
      setError("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await updateProfile({
        whatsapp_number: cleanedNumber,
        campus_location: campusLocation.trim(),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigation is triggered reactively by auth state in _layout.tsx
    } catch (e: any) {
      setError(e.message || "Failed to update profile");
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.label }]}>Complete Profile</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryLabel }]}>
              Two details are needed to verify your campus identity before collaborating.
            </Text>

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.tintBg, borderColor: colors.red }]}>
                <Text style={[styles.errorText, { color: colors.red }]}>{error}</Text>
              </View>
            )}

            <View style={styles.form}>
              {/* WhatsApp Field */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.secondaryLabel }]}>
                  WhatsApp Number
                </Text>
                <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.separator }]}>
                  <Text style={[styles.countryCode, { color: colors.secondaryLabel }]}>+91</Text>
                  <TextInput
                    style={[styles.input, { color: colors.label }]}
                    placeholder="98765 43210"
                    placeholderTextColor={colors.tertiaryLabel}
                    keyboardType="phone-pad"
                    value={whatsappNumber.replace('+91', '').trim()}
                    onChangeText={(text) => {
                      setError(null);
                      setWhatsappNumber(text);
                    }}
                    editable={!isSubmitting}
                  />
                </View>
                <Text style={[styles.fieldHint, { color: colors.tertiaryLabel }]}>
                  Used for direct 1-to-1 coordination in Marketplace and Collabs.
                </Text>
              </View>

              {/* Campus Location Field */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.secondaryLabel }]}>
                  Campus Landmark / Hostel
                </Text>
                <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.separator }]}>
                  <TextInput
                    style={[styles.input, { color: colors.label }]}
                    placeholder="e.g. Hostel KP-7 or Campus 6"
                    placeholderTextColor={colors.tertiaryLabel}
                    value={campusLocation}
                    onChangeText={(text) => {
                      setError(null);
                      setCampusLocation(text);
                    }}
                    editable={!isSubmitting}
                  />
                </View>
                <Text style={[styles.fieldHint, { color: colors.tertiaryLabel }]}>
                  Helps nearby students identify convenient meetup spots.
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.buttonWrapper}>
              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.submitButton,
                  {
                    backgroundColor: colors.tint,
                    opacity: isSubmitting ? 0.7 : pressed ? 0.88 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Enter Campus Node</Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 32,
  },
  errorContainer: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
    height: 52,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  fieldHint: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
    paddingHorizontal: 4,
  },
  buttonWrapper: {
    marginTop: 36,
  },
  submitButton: {
    height: 52,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
