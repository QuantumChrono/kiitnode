import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAuth } from "@/hooks/useAuth";
import { AuthContextType } from "@/context/AuthContext";
import { PostTag } from "@/types/database";
import * as Haptics from "expo-haptics";
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

  // All hooks must be called before any conditional returns
  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [price, setPrice] = useState("");
  const [transactionType, setTransactionType] = useState<'Selling' | 'Buying' | 'Renting'>('Selling');
  const [campusLandmark, setCampusLandmark] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  if (!auth.profile) return null;

  const profile = auth.profile;

  const transactionOptions = [
    { label: 'Selling', value: 'Selling' },
    { label: 'Buying', value: 'Buying' },
    { label: 'Renting', value: 'Renting' }
  ] as const;

  const hasChanges = !!itemTitle.trim() || !!price.trim() || !!campusLandmark.trim() || !!itemDescription.trim();

  const handlePost = async () => {
    if (!itemTitle.trim()) return;

    setIsPosting(true);
    try {
      const trimmedPrice = price.trim();
      const formattedPrice = trimmedPrice ? `₹${trimmedPrice.replace(/^[₹\s]+/, '').trim()}` : '';
      const prefix = transactionType === 'Renting' ? 'Rent: ' : transactionType === 'Buying' ? 'Buying: ' : '';
      const formattedTitle = `${prefix}${itemTitle.trim()}${formattedPrice ? ` — ${formattedPrice}` : ''}`;

      const desc = itemDescription.trim();
      const landmark = campusLandmark.trim();
      const defaultDesc = `${transactionType} ${itemTitle.trim()}${landmark ? ` at ${landmark}` : ''}.`;
      const finalContent = desc || defaultDesc;

      const newPost = {
        title: formattedTitle,
        content: finalContent,
        tag: 'MARKET' as PostTag,
        location_tag: landmark || null,
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

              {/* Description */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.secondaryLabel, textTransform: "uppercase", marginBottom: 6 }}>Description / Condition</Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, minHeight: 90 }}>
                  <TextInput
                    style={{ fontSize: 16, color: colors.label }}
                    value={itemDescription}
                    onChangeText={setItemDescription}
                    placeholder="e.g. Used for 1 semester, working condition, includes cable"
                    placeholderTextColor={colors.tertiaryLabel}
                    multiline
                  />
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