import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAuth } from "@/hooks/useAuth";
import { AuthContextType } from "@/context/AuthContext";
import { PostTag } from "@/types/database";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";

interface CreateCollabModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onPostCreated: (newPost: any) => void;
}

export default function CreateCollabModal({ visible, onRequestClose, onPostCreated }: CreateCollabModalProps) {
  const colors = useThemeColors();
  const auth = useAuth() as AuthContextType;
  const insets = useSafeAreaInsets();

  if (!auth.profile) return null;

  const profile = auth.profile;

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [seriousnessLevel, setSeriousnessLevel] = useState<"Casual" | "Serious" | "Hackathon Win" | "Startup MVP">("Casual");
  const [weeklyBandwidth, setWeeklyBandwidth] = useState<"< 5 hrs" | "5-15 hrs" | "20+ hrs">("< 5 hrs");
  const [isPosting, setIsPosting] = useState(false);

  const seriousnessOptions = [
    { label: "Casual", value: "Casual" },
    { label: "Serious", value: "Serious" },
    { label: "Hackathon Win", value: "Hackathon Win" },
    { label: "Startup MVP", value: "Startup MVP" }
  ] as const;

  const bandwidthOptions = [
    { label: "< 5 hrs", value: "< 5 hrs" },
    { label: "5-15 hrs", value: "5-15 hrs" },
    { label: "20+ hrs", value: "20+ hrs" }
  ] as const;

  const hasChanges = !!projectTitle.trim() || !!projectDescription.trim() || !!lookingFor.trim() || !!skillsInput.trim();

  const handlePost = async () => {
    if (!projectTitle.trim()) return;

    setIsPosting(true);
    try {
      const skillsArray = skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const newPost = {
        title: projectTitle.trim(),
        content: projectDescription.trim(),
        tag: "COLLAB" as PostTag,
        skill_tags: skillsArray.length > 0 ? skillsArray : null,
        seriousness_level: seriousnessLevel,
        weekly_bandwidth: weeklyBandwidth,
        looking_for: lookingFor.trim() || null,
        location_tag: profile.campus_location,
        is_anonymous: false,
        sponsored: false,
        sponsor_name: null,
        moderation_score: null,
        is_active: true,
        user_id: profile.id
      };

      const { data, error } = await supabase
        .from('posts')
        .insert(newPost as any)
        .select()
        .single();

      if (error) throw error;

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onPostCreated(data);
      onRequestClose();
    } catch (error) {
      console.error("Post creation error:", error);
    } finally {
      setIsPosting(false);
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
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
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
              <Text style={{ fontSize: 17, fontWeight: "600", color: colors.label }}>New Collaboration</Text>
              <Pressable onPress={handlePost} disabled={!hasChanges || isPosting} hitSlop={10}>
                <Text style={{ fontSize: 17, fontWeight: "600", color: (!hasChanges || isPosting) ? colors.tertiaryLabel : colors.tint }}>
                  {isPosting ? "Posting..." : "Post"}
                </Text>
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}>

              {/* Project Title */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Project Title</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 }}>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label }}
                    value={projectTitle}
                    onChangeText={setProjectTitle}
                    placeholder="Enter project title"
                    placeholderTextColor={colors.tertiaryLabel}
                    maxLength={50}
                  />
                </View>
              </View>

              {/* Project Description */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Project Description</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, minHeight: 100 }}>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label }}
                    value={projectDescription}
                    onChangeText={setProjectDescription}
                    placeholder="Describe your project"
                    placeholderTextColor={colors.tertiaryLabel}
                    multiline={true}
                  />
                </View>
              </View>

              {/* Looking For */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Looking For</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 }}>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label }}
                    value={lookingFor}
                    onChangeText={setLookingFor}
                    placeholder="e.g. Backend Developer, UI/UX Designer"
                    placeholderTextColor={colors.tertiaryLabel}
                  />
                </View>
              </View>

              {/* Skills Needed */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Skills Needed</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 }}>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label }}
                    value={skillsInput}
                    onChangeText={setSkillsInput}
                    placeholder="React, Python, Figma (comma-separated)"
                    placeholderTextColor={colors.tertiaryLabel}
                  />
                </View>
              </View>

              {/* Seriousness Level */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Seriousness Level</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {seriousnessOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 14,
                        borderCurve: 'continuous',
                        backgroundColor: seriousnessLevel === option.value ? colors.tint : colors.cardPressed,
                      }}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSeriousnessLevel(option.value as "Casual" | "Serious" | "Hackathon Win" | "Startup MVP");
                      }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: seriousnessLevel === option.value ? '600' : '400', color: seriousnessLevel === option.value ? '#FFFFFF' : colors.label }}>
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Weekly Bandwidth */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Weekly Bandwidth</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {bandwidthOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 14,
                        borderCurve: 'continuous',
                        backgroundColor: weeklyBandwidth === option.value ? colors.tint : colors.cardPressed,
                      }}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setWeeklyBandwidth(option.value as "< 5 hrs" | "5-15 hrs" | "20+ hrs");
                      }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: weeklyBandwidth === option.value ? '600' : '400', color: weeklyBandwidth === option.value ? '#FFFFFF' : colors.label }}>
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}