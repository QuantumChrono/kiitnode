import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { MessageCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import PostDetailModal from '@/components/modals/PostDetailModal';
import CreateMarketModal from '@/components/modals/CreateMarketModal';

interface Listing {
  id: string;
  title: string;
  price: string;
  location: string;
  type: 'selling' | 'buying' | 'renting';
  whatsapp?: string;
  author?: string;
  content?: string;
}

const SEED_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'TI-84 Calculator',
    price: '₹2500',
    location: 'Campus 6 Food Court',
    type: 'selling',
    author: 'Ravi Kumar',
    whatsapp: '919999999991',
    content: 'Perfect condition calculator, used for one semester. Includes charging cable.'
  },
  {
    id: '2',
    title: 'Second-hand cycle',
    price: '₹3000',
    location: 'Hostel KP-7 Gate',
    type: 'buying',
    author: 'Sneha Mohanty',
    whatsapp: '919999999992',
    content: 'Looking for a cycle in good condition for daily commute to campus.'
  },
];

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [selectedPost, setSelectedPost] = useState<Listing | null>(null);
  const [seedListings, setSeedListings] = useState<Listing[]>(SEED_LISTINGS);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const handleWhatsApp = (phone: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const cleanPhone = phone.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Header />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingBottom: 160,
          paddingHorizontal: 16,
          gap: 16
        }}
      >
        <Text style={[styles.largeTitle, { color: colors.label, marginTop: 8, marginBottom: 0 }]}>Market</Text>

        <View style={styles.listingsContainer}>
          {seedListings.map((listing) => (
            <Pressable
              key={listing.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedPost(listing);
              }}
              style={({ pressed }) => pressed && styles.cardPressed}
            >
              <Card style={{ padding: 16, gap: 12, backgroundColor: colors.card }}>
                {/* Header Row: Avatar, Author Name, Metadata */}
                <View style={styles.headerRow}>
                  <View style={[styles.avatar, { backgroundColor: colors.tintBg }]}>
                    <Text style={[styles.avatarText, { color: colors.tint }]}>
                      {(listing.author || 'Anonymous').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.headerTextInfo}>
                    <Text style={[styles.authorName, { color: colors.label }]}>{listing.author || 'Anonymous'}</Text>
                    <Text style={[styles.metadata, { color: colors.secondaryLabel }]}>{listing.location}</Text>
                  </View>
                </View>

                {/* Body: Title, Description */}
                <View style={styles.bodyBlock}>
                  <Text style={[styles.postTitle, { color: colors.label }]}>
                    {listing.title}
                  </Text>
                  {listing.content && (
                    <Text style={[styles.postDesc, { color: colors.secondaryLabel }]} numberOfLines={3}>
                      {listing.content}
                    </Text>
                  )}
                </View>

                {/* Tags/Price: Intrinsic width pills */}
                <View style={styles.tagsContainer}>
                  <View style={[styles.tagPill, { backgroundColor: colors.cardPressed }]}>
                    <Text style={[styles.tagText, { color: colors.label, fontWeight: '700' }]}>{listing.price}</Text>
                  </View>
                  {listing.type && (
                    <View style={[styles.tagPill, { backgroundColor: colors.cardPressed }]}>
                      <Text style={[styles.tagText, { color: colors.label, textTransform: 'capitalize' }]}>
                        {listing.type}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Social Action Bar */}
                <View style={[styles.actionBar, { borderTopColor: colors.separator }]}>
                  <Pressable
                    onPress={() => {
                      if (listing.whatsapp) {
                        handleWhatsApp(listing.whatsapp);
                      } else {
                        setSelectedPost(listing);
                      }
                    }}
                    style={({ pressed }) => [
                      styles.messageButton,
                      {
                        backgroundColor: pressed ? colors.tint : colors.cardPressed,
                        transform: [{ scale: pressed ? 0.96 : 1 }]
                      }
                    ]}
                  >
                    <MessageCircle size={18} color={colors.label} />
                    <Text style={[styles.messageButtonText, { color: colors.label }]}>Contact</Text>
                  </Pressable>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <CreateMarketModal
        visible={isCreateModalVisible}
        onRequestClose={() => setIsCreateModalVisible(false)}
        onPostCreated={(newPost) => {
          const newListing: Listing = {
            id: newPost.id,
            title: newPost.title,
            price: `₹${newPost.content}`,
            location: newPost.location_tag || 'Campus Location',
            type: newPost.content.toLowerCase().includes('/mo') ? 'renting' : 'selling',
            whatsapp: '919999999999'
          };
          setSeedListings([newListing, ...seedListings]);
          setIsCreateModalVisible(false);
        }}
      />

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      <FloatingActionButton onPress={() => setIsCreateModalVisible(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  largeTitle: { fontSize: 34, fontWeight: '700', letterSpacing: 0.37 },
  listingsContainer: { gap: 16 },
  cardPressed: { opacity: 0.92 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '600' },
  headerTextInfo: { flex: 1 },
  authorName: { fontSize: 16, fontWeight: '600' },
  metadata: { fontSize: 13, fontWeight: '400', marginTop: 2 },
  bodyBlock: { gap: 6 },
  postTitle: { fontSize: 17, fontWeight: '700' },
  postDesc: { fontSize: 15, lineHeight: 20 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignSelf: 'flex-start' },
  tagPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tagText: { fontSize: 13, fontWeight: '500' },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});