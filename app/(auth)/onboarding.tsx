import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const { updateProfile, profile } = useAuth();
  const [whatsappNumber, setWhatsappNumber] = useState(profile?.whatsapp_number || '');
  const [campusLocation, setCampusLocation] = useState(profile?.campus_location || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!whatsappNumber.trim() || !campusLocation.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    // Basic validation for whatsapp
    const cleanedNumber = whatsappNumber.replace(/[^\d+]/g, '');
    if (cleanedNumber.length < 10) {
      setError("Please enter a valid WhatsApp number.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await updateProfile({
        whatsapp_number: cleanedNumber,
        campus_location: campusLocation.trim()
      });
      // The _layout will observe the profile change and automatically redirect to tabs
    } catch (e: any) {
      setError(e.message || "Failed to update profile");
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-campus-dark-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 justify-center py-10">
            <Text className="text-3xl font-bold text-campus-primary mb-2">Complete Profile</Text>
            <Text className="text-slate-400 mb-10 text-base">Wait! We just need two things before you connect with the campus.</Text>

            {error && (
              <View className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <Text className="text-red-400 text-sm font-medium">{error}</Text>
              </View>
            )}

            <View className="space-y-6">
              {/* WhatsApp Field */}
              <View>
                <Text className="text-slate-300 font-medium mb-2 text-sm uppercase tracking-wider">WhatsApp Number</Text>
                <View className="bg-campus-dark-surface border border-slate-700 p-4 rounded-xl flex-row items-center focus:border-campus-primary">
                  <Text className="text-slate-400 mr-2 font-medium">+91</Text>
                  <TextInput
                    className="flex-1 text-slate-100 text-lg font-medium"
                    placeholder="98765 43210"
                    placeholderTextColor="#475569"
                    keyboardType="phone-pad"
                    value={whatsappNumber.replace('+91', '')}
                    onChangeText={setWhatsappNumber}
                    editable={!isSubmitting}
                  />
                </View>
                <Text className="text-slate-500 text-xs mt-2 ml-1">
                  Used for direct coordination in Marketplace and Collabs.
                </Text>
              </View>

              {/* Campus Location Field */}
              <View className="mt-6">
                <Text className="text-slate-300 font-medium mb-2 text-sm uppercase tracking-wider">Campus Landmark / Hostel</Text>
                <View className="bg-campus-dark-surface border border-slate-700 p-4 rounded-xl flex-row items-center focus:border-campus-primary">
                  <TextInput
                    className="flex-1 text-slate-100 text-lg font-medium"
                    placeholder="e.g. Hostel KP-7 or Campus 6"
                    placeholderTextColor="#475569"
                    value={campusLocation}
                    onChangeText={setCampusLocation}
                    editable={!isSubmitting}
                  />
                </View>
              </View>
            </View>

            <View className="mt-12">
              <TouchableOpacity
                className={`w-full py-4 rounded-xl items-center ${isSubmitting ? 'bg-campus-primary/70' : 'bg-campus-primary'}`}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-lg font-bold">Enter Campus Node</Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
