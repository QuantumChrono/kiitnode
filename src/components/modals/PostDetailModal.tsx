import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { Info as InfoIcon, MapPin as MapPinIcon, MessageCircle as MessageCircleIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';

interface PostDetailModalProps {
  post: {
    id: string;
    title: string;
    author?: string;
    campus?: string;
    skills?: string[];
    seriousness?: string;
    bandwidth?: string;
    whatsapp?: string;
    price?: string;
    location?: string;
    type?: string;
  };
  onClose: () => void;
}

export default function PostDetailModal({ post, onClose }: PostDetailModalProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  // Determine if it's a collab post (has skills) or market listing (has price)
  const isCollab = !!post.skills;

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

          {/* Details */}
          <View style={styles.detailsContainer}>
            {/* Author and Location */}
            <View style={styles.authorLocation}>
              {post.author && (
                <Text style={styles.author}>{post.author}</Text>
              )}
              <Text style={styles.location}>
                <MapPinIcon size={14} color={colors.secondaryLabel} />
                {post.author ? post.campus : post.location}
              </Text>
            </View>

            {/* Skills or Price */}
            {isCollab ? (
              <View>
                {/* Skill Tags */}
                {post.skills?.map((skill) => (
                  <View key={skill} style={styles.skillTag}>
                    <Text style={styles.skillTagText}>{skill}</Text>
                  </View>
                ))}

                {/* Seriousness and Bandwidth */}
                <View style={styles.metaInfo}>
                  {post.seriousness && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Seriousness</Text>
                      <Text style={styles.metaValue}>{post.seriousness}</Text>
                    </View>
                  )}
                  {post.bandwidth && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Bandwidth</Text>
                      <Text style={styles.metaValue}>{post.bandwidth}</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View>
                {/* Price and Type for Market */}
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{post.price}</Text>
                  {post.type && (
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Action Button: Connect on WhatsApp */}
            {post.whatsapp && (
              <Pressable
                style={styles.whatsappButton}
                onPress={() => {
                  const cleanPhone = post.whatsapp!.replace(/\D/g, '');
                  // In a real app, we would use Linking.openURL here
                  // For now, we'll just alert
                  alert(`Opening WhatsApp for ${cleanPhone}`);
                }}
              >
                <MessageCircleIcon size={20} color="#FFFFFF" />
                <Text style={styles.whatsappButtonText}>Connect on WhatsApp</Text>
              </Pressable>
            )}
          </View>
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
    paddingBottom: 20,
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  grabber: {
    width: 40,
    height: 5,
    backgroundColor: '#C7C7CC',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  detailsContainer: {
    gap: 16,
  },
  authorLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontSize: 14,
    color: '#8E8E93',
  },
  skillTag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  skillTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  metaInfo: {
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
  },
  metaLabel: {
    fontSize: 13,
    color: '#8E8E93',
  },
  metaValue: {
    fontSize: 13,
    color: '#000000',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  typeBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  whatsappButton: {
    backgroundColor: '#34C759',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  whatsappButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});