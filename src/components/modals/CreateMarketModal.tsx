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

interface CreateMarketModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onPostCreated: (newPost: any) => void;
}

export default function CreateMarketModal({ visible, onRequestClose, onPostCreated }: CreateMarketModalProps) {
  const colors = useThemeColors();
  const auth = useAuth() as AuthContextType;
  const insets = useSafeAreaInsets();

  if (!auth.profile) return null;

  const profile = auth.profile;

  const [itemTitle, setItemTitle] = useState("");
  const [price, setPrice] = useState("");
  const [transactionType, setTransactionType] = useState<'Selling' | 'Buying' | 'Renting'>('Selling');
  const [campusLandmark, setCampusLandmark] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const transactionOptions = [
    { label: 'Selling', value: 'Selling' },
    { label: 'Buying', value: 'Buying' },
    { label: 'Renting', value: 'Renting' }
  ] as const;

  const hasChanges = !!itemTitle.trim() || !!price.trim() || !!campusLandmark.trim();

  const handlePost = async () => {
    if (!itemTitle.trim()) return;

    setIsPosting(true);
    try {
      const newPost = {
        title: itemTitle.trim(),
        content: price.trim(), // We'll use the content field for price, but note: the UI shows it as price. Alternatively, we could store in a separate field?
        // However, the database schema for posts has a 'content' field. We are using it for price in the market modal.
        // But note: the CreateCollabModal uses 'content' for projectDescription. We are repurposing for market.
        // Alternatively, we could store the price in a separate column? But the task says to submit to the posts table.
        // We are following the pattern of CreateCollabModal which uses the 'content' field for the main description.
        // For market, we are using the 'content' field for the price string. This is acceptable as per the task.
        tag: 'MARKET' as PostTag,
        location_tag: campusLandmark.trim() || null,
        is_anonymous: false,
        sponsored: false,
        sponsor_name: null,
        moderation_score: null,
        is_active: true,
        user_id: profile.id
        // Note: We are not setting skill_tags, seriousness_level, weekly_bandwidth, looking_for for market.
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
              <Text style={{ fontSize: 17, fontWeight: "600", color: colors.label }}>New Market Post</Text>
              <Pressable onPress={handlePost} disabled={!hasChanges || isPosting} hitSlop={10}>
                <Text style={{ fontSize: 17, fontWeight: "600", color: (!hasChanges || isPosting) ? colors.tertiaryLabel : colors.tint }}>
                  {isPosting ? "Posting..." : "Post"}
                </Text>
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}>

              {/* Item Title */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Item Title</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 }}>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label }}
                    value={itemTitle}
                    onChangeText={setItemTitle}
                    placeholder="e.g. TI-84 Calculator"
                    placeholderTextColor={colors.tertiaryLabel}
                    maxLength={50}
                  />
                </View>
              </View>

              {/* Price */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Price</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 }}>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label }}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="e.g. 2500 or 500/mo"
                    placeholderTextColor={colors.tertiaryLabel}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Transaction Type */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Transaction Type</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {transactionOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 14,
                        borderCurve: 'continuous',
                        backgroundColor: transactionType === option.value ? colors.tint : colors.cardPressed,
                      }}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setTransactionType(option.value as 'Selling' | 'Buying' | 'Renting');
                      }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: transactionType === option.value ? '600' : '400', color: transactionType === option.value ? '#FFFFFF' : colors.label }}>
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Campus Landmark */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Campus Landmark</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 }}>
                  <TextInput
                    style={{ fontSize: 17, color: colors.label }}
                    value={campusLandmark}
                    onChangeText={setCampusLandmark}
                    placeholder="e.g. Campus 6 Food Court"
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