import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAuth } from "@/hooks/useAuth";
import { AuthContextType } from "@/context/AuthContext";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface EditProfileModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onAppearanceChange?: (isDark: boolean) => void;
  isDark?: boolean;
}

export default function EditProfileModal({ visible, onRequestClose }: EditProfileModalProps) {
  const colors = useThemeColors();
  const auth = useAuth() as AuthContextType;
  const insets = useSafeAreaInsets();

  if (!auth.profile) return null;

  const profile = auth.profile;
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [whatsappNumber, setWhatsAppNumber] = useState(profile.whatsapp_number ?? "");
  const [campusLocation, setCampusLocation] = useState(profile.campus_location ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const options = ["Hostel 6", "Hostel KP-6", "Hostel KP-7", "Hostel KP-15", "Campus 3", "Campus 6", "Campus 15", "Central Library"];

  const hasChanges = fullName.trim() !== profile.full_name || whatsappNumber.trim() !== (profile.whatsapp_number ?? "") || campusLocation.trim() !== (profile.campus_location ?? "");

  const getInitials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        full_name: fullName.trim(),
        whatsapp_number: whatsappNumber.trim(),
        campus_location: campusLocation.trim(),
      };
      await auth.updateProfile(updateData);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onRequestClose();
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onRequestClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>

          {/* Dismiss scrim layer */}
          <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} />

          <View style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderCurve: "continuous",
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 24),
            height: "90%",
            overflow: "hidden"
          }}>

            {/* Grabber */}
            <View style={{ width: 36, height: 5, borderRadius: 2.5, backgroundColor: colors.tertiaryLabel, alignSelf: "center", marginBottom: 12 }} />

            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.separator }}>
              <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onRequestClose(); }} hitSlop={10}>
                <Text style={{ fontSize: 17, color: colors.blue }}>Cancel</Text>
              </Pressable>
              <Text style={{ fontSize: 17, fontWeight: "600", color: colors.label }}>Edit Profile</Text>
              <Pressable onPress={handleSave} disabled={!hasChanges || isSaving} hitSlop={10}>
                <Text style={{ fontSize: 17, fontWeight: "600", color: (!hasChanges || isSaving) ? colors.tertiaryLabel : colors.tint }}>
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}>

              {/* Avatar Section */}
              <View style={{ alignItems: "center", marginVertical: 24 }}>
                <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: colors.tintBg, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 36, fontWeight: "600", color: colors.tint }}>{getInitials(profile.full_name ?? "")}</Text>
                </View>
                <Pressable style={{ marginTop: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: "500", color: colors.blue }}>Edit Picture</Text>
                </Pressable>
              </View>

              {/* Name & Email Section */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Full Name</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 }}>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label }}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter full name"
                    placeholderTextColor={colors.tertiaryLabel}
                  />
                </View>

                <View style={{ marginTop: 12, paddingHorizontal: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 4 }}>Account Email</Text>
                  <Text style={{ fontSize: 16, color: colors.tertiaryLabel }}>{profile.email || "Verified Student"}</Text>
                </View>
              </View>

              {/* WhatsApp Section */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>WhatsApp Coordination Number</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 17, color: colors.label }}>+91 </Text>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label, flex: 1 }}
                    value={whatsappNumber}
                    onChangeText={setWhatsAppNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                    placeholder="10-digit number"
                    placeholderTextColor={colors.tertiaryLabel}
                  />
                </View>
                <Text style={{ fontSize: 13, color: colors.secondaryLabel, marginTop: 6, paddingHorizontal: 4, lineHeight: 18 }}>
                  Used for direct coordination in Marketplace and Collabs. Kept private on anonymous posts.
                </Text>
              </View>

              {/* Campus Section */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Campus Location / Hostel</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, gap: 8 }}>
                  {options.map((option, index) => (
                    <Pressable
                      key={index}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 16,
                        borderCurve: 'continuous',
                        backgroundColor: campusLocation === option ? colors.tint : colors.cardPressed,
                      }}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setCampusLocation(option);
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: campusLocation === option ? '600' : '400', color: campusLocation === option ? '#FFFFFF' : colors.label }}>
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, marginTop: 12 }}>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label }}
                    placeholder="Or type custom landmark"
                    value={campusLocation}
                    onChangeText={setCampusLocation}
                    placeholderTextColor={colors.tertiaryLabel}
                  />
                </View>
              </View>

            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}