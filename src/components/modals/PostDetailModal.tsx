import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native';
import { MapPin as MapPinIcon, MessageCircle as MessageCircleIcon, Flag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { supabase } from '@/lib/supabase';
import { ReportCategory } from '@/types/database';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';

interface PostDetailModalProps {
  post: {
    id: string;
    title: string;
    author?: string;
    campus?: string;
    location?: string;
    skills?: string[];
    seriousness_level?: string;
    weekly_bandwidth?: string;
    whatsapp?: string;
    looking_for?: string;
    content?: string;
    price?: string;
    type?: string;
    category?: string;
    likes?: number;
  };
  onClose: () => void;
}

export default function PostDetailModal({ post, onClose }: PostDetailModalProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { profile } = useAuth();

  const getAuthorName = () => post.author && post.author.trim() !== '' ? post.author : 'Anonymous';
  const getLocation = () => post.campus || post.location || 'KIIT Campus';

  const submitReport = async (category: ReportCategory, reason: string) => {
    if (!profile?.id) {
      Alert.alert('Sign In Required', 'Please sign in to report posts.');
      return;
    }

    try {
      const { error } = await supabase.from('reports').insert({
        post_id: post.id,
        reporter_id: profile.id,
        category,
        reason,
      } as any);

      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key')) {
          Alert.alert(
            'Already Reported',
            'You have already reported this post. Our moderation queue is reviewing it.'
          );
        } else {
          Alert.alert('Report Notice', 'Could not submit report at this time. Please try again.');
        }
        return;
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Report Received',
        'Thank you for helping keep KIIT Node safe. Your report has been submitted to the moderation queue.'
      );
    } catch (err) {
      console.error('Report submission failed:', err);
    }
  };

  const handleReportPost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Report Post',
      'Select a reason for reporting this post to campus moderators:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Spam or Advertising',
          onPress: () => submitReport('SPAM', 'Spam or commercial promotion'),
        },
        {
          text: 'Inappropriate Content',
          onPress: () => submitReport('INAPPROPRIATE', 'Inappropriate or offensive content'),
        },
        {
          text: 'Threat or Safety Concern',
          style: 'destructive',
          onPress: () => submitReport('THREAT_SAFETY', 'Threat, safety hazard, or harassment'),
        },
      ]
    );
  };

  const openWhatsApp = () => {
    if (post.whatsapp) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const cleanPhone = post.whatsapp.replace(/\D/g, '').slice(-10);
      const message = `Hey ${post.author || 'there'}, saw your post about "${post.title}" on KIIT Node!`;
      const encodedMessage = encodeURIComponent(message);
      Linking.openURL(`whatsapp://send?phone=91${cleanPhone}&text=${encodedMessage}`)
        .catch(err => {
          console.error('Failed to open WhatsApp:', err);
          alert(`Could not open WhatsApp for ${cleanPhone}`);
        });
    }
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={true}
      onRequestClose={onClose}
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdropOverlay} />
        </TouchableWithoutFeedback>

        <View
           style={[styles.modalContainer, { backgroundColor: colors.bg, paddingBottom: insets.bottom }]}
        >
          {/* Top grabber pill */}
          <View style={styles.grabberWrapper}>
             <View style={[styles.grabber, { backgroundColor: colors.tertiaryLabel }]} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            <View style={styles.contentWrapper}>
              {/* Thread Author line with Report button */}
              <View style={styles.threadHeaderInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  <Avatar name={getAuthorName()} size={36} />
                  <View style={styles.threadHeaderMeta}>
                    <Text style={[styles.threadAuthorName, { color: colors.label }]}>{getAuthorName()}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <MapPinIcon size={12} color={colors.secondaryLabel} />
                      <Text style={[styles.threadLocation, { color: colors.secondaryLabel }]}>{getLocation()}</Text>
                    </View>
                  </View>
                </View>

                {/* Report post */}
                <Pressable
                  onPress={handleReportPost}
                  hitSlop={8}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.6 : 1,
                      padding: 6,
                      borderRadius: 8,
                    },
                  ]}
                >
                  <Flag size={16} color={colors.secondaryLabel} />
                </Pressable>
              </View>

              {/* Title */}
              <Text style={[styles.title, { color: colors.label }]}>{post.title}</Text>

              {/* Tags / Pills */}
              <View style={styles.tagsContainer}>
                {post.category && (
                  <View style={[styles.tagPill, { backgroundColor: colors.cardPressed }]}>
                    <Text style={[styles.tagText, { color: colors.label }]}>{post.category}</Text>
                  </View>
                )}
                {post.price && (
                  <View style={[styles.tagPill, { backgroundColor: colors.cardPressed }]}>
                    <Text style={[styles.tagText, { color: colors.label }]}>{post.price}</Text>
                  </View>
                )}
                {post.type && (
                    <View style={[styles.tagPill, { backgroundColor: colors.cardPressed }]}>
                      <Text style={[styles.tagText, { color: colors.label, textTransform: 'capitalize' }]}>{post.type}</Text>
                    </View>
                )}
                {post.looking_for && (
                  <View style={[styles.tagPill, { backgroundColor: colors.cardPressed }]}>
                    <Text style={[styles.tagText, { color: colors.label }]}>Needs: {post.looking_for}</Text>
                  </View>
                )}
                {post.skills?.map((skill, idx) => (
                  <View key={idx} style={[styles.tagPill, { backgroundColor: colors.cardPressed }]}>
                     <Text style={[styles.tagText, { color: colors.label }]}>{skill}</Text>
                  </View>
                ))}
              </View>

              {/* Content */}
              <View style={styles.contentBlock}>
                <Text style={[styles.contentText, { color: colors.label }]}>{post.content}</Text>
              </View>

              {/* Special actions like whatsapp */}
              {post.whatsapp && (
                <View style={styles.whatsappContainer}>
                    <Pressable
                        onPress={openWhatsApp}
                        style={({ pressed }) => [
                        styles.whatsappButton,
                        {
                            backgroundColor: colors.tint,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                            opacity: pressed ? 0.8 : 1
                        }
                        ]}
                    >
                        <MessageCircleIcon size={18} color="#FFFFFF" />
                        <Text style={styles.whatsappButtonText}>Connect on WhatsApp</Text>
                    </Pressable>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    maxHeight: '80%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  grabberWrapper: {
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
  },
  contentWrapper: {
    paddingTop: 8,
  },
  threadHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  threadHeaderMeta: {
    justifyContent: 'center',
  },
  threadAuthorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  threadLocation: {
    fontSize: 13,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  contentBlock: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  whatsappContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  whatsappButton: {
    borderRadius: 12,
    borderCurve: 'continuous',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  whatsappButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});