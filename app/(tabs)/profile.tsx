import React from "react";
import { View, Text, ScrollView, Pressable, Switch, StyleSheet, Modal } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "@/components/ui/Header";
import GroupedList from "@/components/ui/GroupedList";
import { GroupedRow } from "@/components/ui/GroupedRow";
import { Avatar } from "@/components/ui/Avatar";
import { MessageCircle, Mail, Edit3, ChevronRight, CheckCircle2 } from "lucide-react-native";
import * as Linking from "expo-linking";
import { useThemeColors } from "@/hooks/useThemeColors";
import EditProfileModal from "@/components/ui/EditProfileModal";
import GuidelinesModal from "@/components/ui/GuidelinesModal";

export default function ProfileScreen() {
  const { profile, isModerator, signOut } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [isGuidelinesModalVisible, setIsGuidelinesModalVisible] = React.useState(false);

  const handleWhatsApp = () => {
    if (profile?.whatsapp_number) {
      const phone = profile.whatsapp_number.replace(/\D/g, "");
      Linking.openURL(`whatsapp://send?phone=${phone}`);
    }
  };

  const handleEmail = () => {
    if (profile?.email) {
      Linking.openURL(`mailto:${profile.email}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Header />

      <EditProfileModal
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
        onAppearanceChange={toggleTheme}
        isDark={theme === "dark"}
      />

      <GuidelinesModal
        visible={isGuidelinesModalVisible}
        onRequestClose={() => setIsGuidelinesModalVisible(false)}
      />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + 96,
          paddingHorizontal: 16,
        }}
      >
        {/* Header Section - Apple Contact Card Style */}
        <View style={styles.headerSection}>
          <Avatar name={profile?.full_name} size={96} className="mb-4" />

          <Text style={[styles.nameText, { color: colors.label }]}>
            {profile?.full_name}
          </Text>

          <Text style={[styles.rollText, { color: colors.secondaryLabel }]}>
            {profile?.email}
          </Text>

          <Text style={[styles.subtitleText, { color: colors.tertiaryLabel }]}>
            {isModerator ? "MODERATOR" : "STUDENT"} • {profile?.campus_location?.toUpperCase() || "CAMPUS"}
          </Text>
        </View>

        {/* Quick Action Row - 3 Circular Glass Buttons */}
        <View style={styles.actionRow}>
          <Pressable onPress={handleWhatsApp} style={{}}>
            <View style={{ alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderCurve: 'continuous',
                  backgroundColor: colors.cardPressed,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageCircle size={24} color={colors.tint} />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: colors.secondaryLabel,
                  textTransform: 'uppercase',
                }}
              >
                WhatsApp
              </Text>
            </View>
          </Pressable>

          <Pressable onPress={handleEmail} style={{}}>
            <View style={{ alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderCurve: 'continuous',
                  backgroundColor: colors.cardPressed,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mail size={24} color={colors.blue} />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: colors.secondaryLabel,
                  textTransform: 'uppercase',
                }}
              >
                Email
              </Text>
            </View>
          </Pressable>

          <Pressable onPress={() => setIsEditModalVisible(true)} style={{}}>
            <View style={{ alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderCurve: 'continuous',
                  backgroundColor: colors.cardPressed,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Edit3 size={24} color={colors.label} />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: colors.secondaryLabel,
                  textTransform: 'uppercase',
                }}
              >
                Edit
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Inset Grouped Section 1: Contact & Campus */}
        <View style={styles.sectionSpacer}>
          <GroupedList>
            <GroupedRow
              label="WhatsApp"
              value={profile?.whatsapp_number || "Not added"}
              leftIcon={<MessageCircle size={20} color={colors.tint} />}
              showSeparator
            />
            <GroupedRow
              label="Hostel / Landmark"
              value={profile?.campus_location || "Not set"}
              leftIcon={<ChevronRight size={20} color={colors.secondaryLabel} />}
              showSeparator
              isLast
            />
          </GroupedList>
        </View>

        {/* Verification Status */}
        <View style={styles.sectionSpacer}>
          <GroupedList>
            <GroupedRow
              label="Verification"
              value={profile?.email?.includes("@kiit.ac.in") ? "Verified @kiit.ac.in" : "Unverified"}
              leftIcon={<CheckCircle2 size={20} color={colors.tint} />}
              isLast
            />
          </GroupedList>
        </View>

        {/* Inset Grouped Section 2: Preferences & System */}
        <View style={styles.sectionSpacer}>
          <GroupedList>
            <GroupedRow
              label="Appearance"
              leftIcon={
                <View style={styles.toggleContainer}>
                  <Switch
                    value={colors.isDark}
                    onValueChange={toggleTheme}
                    trackColor={{ false: colors.separator, true: colors.tint }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              }
              value={colors.isDark ? "Dark" : "Light"}
              showSeparator
            />
            <GroupedRow
              label="Community Guidelines"
              showChevron
              leftIcon={<ChevronRight size={20} color={colors.secondaryLabel} />}
              showSeparator
              isLast
              onPress={() => setIsGuidelinesModalVisible(true)}
            />
          </GroupedList>
        </View>

        {/* Danger Section: Sign Out */}
        <View style={styles.sectionSpacer}>
          <GroupedList>
            <GroupedRow
              label="Sign Out"
              onPress={handleSignOut}
              isLast
            />
          </GroupedList>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
  },
  nameText: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.36,
    marginBottom: 4,
  },
  rollText: {
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: -0.32,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.07,
    textTransform: "uppercase",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    marginBottom: 24,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderCurve: "continuous" as const,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 4,
    textTransform: "uppercase",
  },
  sectionSpacer: {
    marginBottom: 16,
  },
  toggleContainer: {
    marginRight: 12,
  },
});