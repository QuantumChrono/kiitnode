import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { MapPin as MapPinIcon, MessageCircle as MessageCircleIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Avatar } from '@/components/ui/Avatar';
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

  const getAuthorName = () => post.author && post.author.trim() !== '' ? post.author : 'Anonymous';
  const getLocation = () => post.campus || post.location || 'KIIT Campus';

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
              {/* Thread Author line */}
              <View style={styles.threadHeaderInfo}>
                <Avatar name={getAuthorName()} size={36} />
                <View style={styles.threadHeaderMeta}>
                  <Text style={[styles.threadAuthorName, { color: colors.label }]}>{getAuthorName()}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MapPinIcon size={12} color={colors.secondaryLabel} />
                    <Text style={[styles.threadLocation, { color: colors.secondaryLabel }]}>{getLocation()}</Text>
                  </View>
                </View>
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