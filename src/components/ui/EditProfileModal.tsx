import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, Switch, TextInput } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Edit3, ChevronRight, CheckCircle2, LogOut, Sun, Moon } from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";

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
  const { updateProfile, profile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [whatsappNumber, setWhatsAppNumber] = useState(profile?.whatsapp_number ?? '');
  const [campusLocation, setCampusLocation] = useState(profile?.campus_location ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await updateProfile({
        full_name: fullName.trim(),
        whatsapp_number: whatsappNumber.trim(),
        campus_location: campusLocation.trim(),
      });
      onRequestClose();
    } catch (error: any) {
      setSaveError(error.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

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
        <View style={[styles.container, { backgroundColor: colors.isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.label }]}>Edit Profile</Text>
            <Pressable style={styles.closeButton} onPress={onRequestClose}>
              <Text style={[styles.closeButtonText, { color: colors.label }]}>✕</Text>
            </Pressable>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputRow}>
              <Text style={[styles.inputLabel, { color: colors.secondaryLabel }]}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.label },
                ]}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                placeholderTextColor={colors.tertiaryLabel}
              />
            </View>

            {/* WhatsApp Number */}
            <View style={styles.inputRow}>
              <Text style={[styles.inputLabel, { color: colors.secondaryLabel }]}>WhatsApp Number</Text>
              <View style={styles.inputWithPrefix}>
                <Text style={[styles.inputPrefix, { color: colors.secondaryLabel }]}>+91 </Text>
                <TextInput
                  style={[
                    styles.input,
                    { flex: 1, color: colors.label },
                  ]}
                  placeholder="Enter 10-digit number"
                  value={whatsappNumber}
                  onChangeText={setWhatsAppNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor={colors.tertiaryLabel}
                />
              </View>
            </View>

            {/* Campus / Hostel Location */}
            <View style={styles.inputRow}>
              <Text style={[styles.inputLabel, { color: colors.secondaryLabel }]}>Campus / Hostel Location</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.label,
                  }
                ]}
                placeholder="e.g. Hostel 6, Campus 15"
                value={campusLocation}
                onChangeText={setCampusLocation}
                placeholderTextColor={colors.tertiaryLabel}
              />
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.separator }]} />

          {/* Error Message */}
          {saveError && (
            <View style={[styles.errorContainer, { backgroundColor: colors.isDark ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.05)' }]}>
              <Text style={[styles.errorText, { color: colors.isDark ? '#FF6B6B' : '#FF3B30' }]}>{saveError}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={[
                styles.actionItem,
                { flex: 1, marginRight: 8 }
              ]}
              onPress={onRequestClose}
              disabled={isSaving}
            >
              <Text style={[
                styles.actionText,
                { opacity: isSaving ? 0.5 : 1 }
              ]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.actionItem,
                { flex: 1, marginLeft: 8, backgroundColor: colors.tint }
              ]}
              onPress={handleSave}
              disabled={isSaving || !fullName.trim()}
            >
              <Text style={[
                styles.actionText,
                { color: '#FFFFFF', opacity: isSaving ? 0.5 : 1 }
              ]}>
                {isSaving ? 'Saving...' : 'Save'}
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
  form: {
    gap: 16,
  },
  inputRow: {
    flexDirection: "column",
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
  },
  inputWithPrefix: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
  },
  inputPrefix: {
    paddingHorizontal: 12,
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionItem: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },
});