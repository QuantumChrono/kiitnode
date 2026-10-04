import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Switch } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAuth } from "@/hooks/useAuth";
import { AuthContextType } from "@/context/AuthContext";
import { PostTag } from "@/types/database";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";

interface CreateForumModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onPostCreated: (newPost: any) => void;
}

export default function CreateForumModal({ visible, onRequestClose, onPostCreated }: CreateForumModalProps) {
  const colors = useThemeColors();
  const auth = useAuth() as AuthContextType;
  const insets = useSafeAreaInsets();

  if (!auth.profile) return null;

  const profile = auth.profile;

  const [discussionTopic, setDiscussionTopic] = useState("");
  const [detailsContent, setDetailsContent] = useState("");
  const [category, setCategory] = useState<'Academic' | 'Events' | 'Campus'>('Academic');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const categoryOptions = [
    { label: 'Academic', value: 'Academic' },
    { label: 'Events', value: 'Events' },
    { label: 'Campus', value: 'Campus' }
  ] as const;

  const hasChanges = !!discussionTopic.trim() || !!detailsContent.trim();

  const handlePost = async () => {
    if (!discussionTopic.trim()) return;

    setIsPosting(true);
    try {
      const newPost = {
        title: discussionTopic.trim(),
        content: detailsContent.trim(),
        tag: 'DISCUSSION' as PostTag,
        location_tag: null, // Forum posts don't need a campus landmark
        is_anonymous: isAnonymous,
        sponsored: false,
        sponsor_name: null,
        moderation_score: null,
        is_active: true,
        user_id: profile.id
        // Note: We are not setting skill_tags, seriousness_level, weekly_bandwidth, looking_for for forum.
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
              <Text style={{ fontSize: 17, fontWeight: "600", color: colors.label }}>New Discussion</Text>
              <Pressable onPress={handlePost} disabled={!hasChanges || isPosting} hitSlop={10}>
                <Text style={{ fontSize: 17, fontWeight: "600", color: (!hasChanges || isPosting) ? colors.tertiaryLabel : colors.tint }}>
                  {isPosting ? "Posting..." : "Post"}
                </Text>
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}>

              {/* Discussion Topic */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Discussion Topic</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 }}>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label }}
                    value={discussionTopic}
                    onChangeText={setDiscussionTopic}
                    placeholder="Enter discussion topic"
                    placeholderTextColor={colors.tertiaryLabel}
                    maxLength={50}
                  />
                </View>
              </View>

              {/* Details/Content */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Details</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, minHeight: 100 }}>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label }}
                    value={detailsContent}
                    onChangeText={setDetailsContent}
                    placeholder="Share your thoughts..."
                    placeholderTextColor={colors.tertiaryLabel}
                    multiline={true}
                  />
                </View>
              </View>

              {/* Category */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Category</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {categoryOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 14,
                        borderCurve: 'continuous',
                        backgroundColor: category === option.value ? colors.tint : colors.cardPressed,
                      }}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setCategory(option.value as 'Academic' | 'Events' | 'Campus');
                      }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: category === option.value ? '600' : '400', color: category === option.value ? '#FFFFFF' : colors.label }}>
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Post Anonymously */}
              <View style={{ marginBottom: 24, flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginRight: 12 }}>Post Anonymously</Text>
                <Switch
                  trackColor={{ false: colors.cardPressed, true: colors.tint }}
                  thumbColor={isAnonymous ? colors.tint : colors.label}
                  value={isAnonymous}
                  onValueChange={setIsAnonymous}
                />
              </View>

            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}