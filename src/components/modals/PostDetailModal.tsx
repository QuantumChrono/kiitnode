import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Info as InfoIcon, MapPin as MapPinIcon, MessageCircle as MessageCircleIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import * as Linking from 'expo-linking';

interface PostDetailModalProps {
  post: {
    id: string;
    title: string;
    author?: string;
    campus?: string;
    skills?: string[];
    seriousness_level?: string;
    weekly_bandwidth?: string;
    whatsapp?: string;
    looking_for?: string;
    content?: string;
  };
  onClose: () => void;
}

export default function PostDetailModal({ post, onClose }: PostDetailModalProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  // Determine if it's a collab post (has skills) or market listing (has price)
  const isCollab = !!post.skills;

  const openWhatsApp = () => {
    if (post.whatsapp) {
      const cleanPhone = post.whatsapp.replace(/\D/g, '');
      const message = `Hey ${post.author || 'there'}, saw your post about "${post.title}" on KIIT Node!`;
      const encodedMessage = encodeURIComponent(message);
      // Using WhatsApp URL scheme
      Linking.openURL(`whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`)
        .catch(err => {
          console.error('Failed to open WhatsApp:', err);
          // Fallback to alert if WhatsApp is not installed
          alert(`Opening WhatsApp for ${cleanPhone}\nMessage: ${message}`);
        });
    }
  };

  const styles = StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
      paddingBottom: 20,
    },
    backdropOverlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'transparent',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      borderCurve: 'continuous',
      padding: 24,
      maxHeight: '85%',
    },
    grabber: {
      width: 36,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: colors.tertiaryLabel,
      alignSelf: 'center',
      marginVertical: 12,
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: 34,
      fontWeight: '700',
      color: colors.label,
      letterSpacing: 0.37,
    },
    authorBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 24,
    },
    authorAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.tintBg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.separator,
    },
    authorAvatarText: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.tint,
    },
    authorInfo: {
      gap: 4,
    },
    authorName: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.label,
    },
    authorLocation: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    authorLocationText: {
      fontSize: 14,
      color: colors.secondaryLabel,
    },
    contentBlock: {
      paddingVertical: 16,
    },
    contentText: {
      fontSize: 16,
      color: colors.secondaryLabel,
      lineHeight: 24,
    },
    metaBlock: {
      gap: 12,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 0,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.separator,
    },
    metaLabel: {
      fontSize: 15,
      color: colors.secondaryLabel,
      fontWeight: '500',
    },
    metaValue: {
      fontSize: 15,
      color: colors.label,
      fontWeight: '500',
      textAlign: 'right',
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    skillChip: {
      backgroundColor: colors.isDark ? '#2C2C2E' : '#F2F2F7',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.separator,
    },
    skillChipText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.label,
    },
    whatsappContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.bg,
      padding: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.separator,
    },
    whatsappButton: {
      backgroundColor: colors.tint,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    whatsappButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    whatsappButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

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

        <View style={styles.modalContent}>
          {/* Top grabber pill */}
          <View style={styles.grabber} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{post.title}</Text>
          </View>

          {/* Author Block */}
          {post.author && (
            <View style={styles.authorBlock}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorAvatarText}>
                  {post.author.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.author}</Text>
                {post.campus && (
                  <View style={styles.authorLocation}>
                    <MapPinIcon size={14} color={colors.secondaryLabel} />
                    <Text style={styles.authorLocationText}>{post.campus}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Content Block */}
          {post.content && (
            <View style={styles.contentBlock}>
              <Text style={styles.contentText}>{post.content}</Text>
            </View>
          )}

          {/* Meta Block (Grouped List) */}
          <View style={styles.metaBlock}>
            {/* Looking For */}
            {post.looking_for && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Looking For</Text>
                <Text style={styles.metaValue}>{post.looking_for}</Text>
              </View>
            )}

            {/* Seriousness */}
            {post.seriousness_level && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Seriousness</Text>
                <Text style={styles.metaValue}>{post.seriousness_level}</Text>
              </View>
            )}

            {/* Bandwidth */}
            {post.weekly_bandwidth && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Bandwidth</Text>
                <Text style={styles.metaValue}>{post.weekly_bandwidth}</Text>
              </View>
            )}

            {/* Skills */}
            {post.skills && post.skills.length > 0 && (
              <>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Skills</Text>
                  <View style={styles.skillsContainer}>
                    {post.skills.map((skill, index) => (
                      <View key={index} style={styles.skillChip}>
                        <Text style={styles.skillChipText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Sticky Bottom Action */}
          {post.whatsapp && (
            <View style={styles.whatsappContainer}>
              <Pressable
                style={styles.whatsappButton}
                onPress={openWhatsApp}
              >
                <View style={styles.whatsappButtonContent}>
                  <MessageCircleIcon size={20} color="#FFFFFF" />
                  <Text style={styles.whatsappButtonText}>Connect on WhatsApp</Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}