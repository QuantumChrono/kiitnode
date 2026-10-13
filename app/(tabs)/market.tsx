import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
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
import { supabase } from '@/lib/supabase';
import { PublicPost } from '@/types/database';

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

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [selectedPost, setSelectedPost] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketListings = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('posts_public')
        .select('*')
        .eq('tag', 'MARKET')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedListings: Listing[] = (data || []).map((dbPost: PublicPost) => {
        const fullText = `${dbPost.title} ${dbPost.content || ''}`;
        const priceMatch = fullText.match(/(?:₹|Rs\.?)\s*[\d,]+(?:\/(?:mo|month))?/i);
        const lowerText = fullText.toLowerCase();
        const type: 'selling' | 'buying' | 'renting' =
          lowerText.includes('rent') ? 'renting' :
          (lowerText.includes('buy') || lowerText.includes('looking for') || lowerText.includes('wanted')) ? 'buying' :
          'selling';

        return {
          id: dbPost.id,
          title: dbPost.title,
          price: priceMatch ? priceMatch[0].trim() : '₹ Negotiable',
          location: dbPost.location_tag || 'Campus Location',
          type,
          whatsapp: dbPost.whatsapp_number || undefined,
          author: dbPost.full_name || 'Anonymous',
          content: dbPost.content
        };
      });

      setListings(transformedListings);
      setError(null);
    } catch (err) {
      console.error('Error fetching market listings:', err);
      setError('Failed to load listings');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketListings();
  }, [fetchMarketListings]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMarketListings();
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    fetchMarketListings();
  };

  const handleWhatsApp = (phone: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    Linking.openURL(`whatsapp://send?phone=91${cleanPhone}`);
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
      >
        <Text style={[styles.largeTitle, { color: colors.label, marginTop: 8, marginBottom: 0 }]}>Market</Text>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.errorText, { color: colors.secondaryLabel }]}>{error}</Text>
            <Pressable onPress={handleRetry} style={[styles.retryButton, { backgroundColor: colors.tint }]}>
              <Text style={[styles.retryButtonText, { color: colors.card }]}>Retry</Text>
            </Pressable>
          </View>
        ) : listings.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.emptyText, { color: colors.secondaryLabel }]}>No listings yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.tertiaryLabel }]}>Be the first to post an item</Text>
          </View>
        ) : (
          <View style={styles.listingsContainer}>
            {listings.map((listing) => (
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
        )}
      </ScrollView>

      <CreateMarketModal
        visible={isCreateModalVisible}
        onRequestClose={() => setIsCreateModalVisible(false)}
        onPostCreated={() => {
          setIsCreateModalVisible(false);
          fetchMarketListings();
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
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 15,
  }
});