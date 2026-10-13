import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Header } from '@/components/ui/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import PostDetailModal from '@/components/modals/PostDetailModal';
import CreateCollabModal from '@/components/modals/CreateCollabModal';
import { AppleButton } from '@/components/ui/AppleButton';
import { supabase } from '@/lib/supabase';
import { PublicPost } from '@/types/database';

interface Post {
  id: string;
  title: string;
  author: string;
  campus: string;
  skills: string[];
  seriousness: string;
  bandwidth: string;
  whatsapp?: string;
  looking_for?: string;
  content?: string;
}

export default function CollabScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollabPosts = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('posts_public')
        .select('*')
        .eq('tag', 'COLLAB')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedPosts: Post[] = (data || []).map((dbPost: PublicPost) => ({
        id: dbPost.id,
        title: dbPost.title,
        author: dbPost.full_name || 'Unknown',
        campus: dbPost.location_tag || '',
        skills: dbPost.skill_tags || [],
        seriousness: dbPost.seriousness_level || '',
        bandwidth: dbPost.weekly_bandwidth || '',
        whatsapp: dbPost.whatsapp_number || undefined,
        looking_for: dbPost.looking_for,
        content: dbPost.content
      }));

      setPosts(transformedPosts);
      setError(null);
    } catch (err) {
      console.error('Error fetching collab posts:', err);
      setError('Failed to load opportunities');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCollabPosts();
  }, [fetchCollabPosts]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCollabPosts();
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    fetchCollabPosts();
  };

  const handleWhatsApp = (phone?: string) => {
    if (!phone) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10); // Extract 10-digit number
      Linking.openURL('whatsapp://send?phone=91' + cleanPhone);
    } catch (e) {
      console.warn("Could not open WhatsApp", e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 64, paddingBottom: 180, paddingHorizontal: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
      >
        <Text style={{ fontSize: 34, fontWeight: '700', color: colors.label, marginBottom: 16, marginTop: 8 }}>Teammates</Text>

        {isLoading ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}>
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        ) : error ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.secondaryLabel }}>{error}</Text>
            <Pressable onPress={handleRetry} style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.tint }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.card }}>Retry</Text>
            </Pressable>
          </View>
        ) : posts.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.secondaryLabel }}>No opportunities yet</Text>
            <Text style={{ fontSize: 15, color: colors.tertiaryLabel }}>Be the first to post a collaboration</Text>
          </View>
        ) : (
          posts.map((post) => (
          <Pressable
            key={post.id}
            onPress={() => setSelectedPost(post)}
            style={{
              backgroundColor: colors.card,
              borderRadius: 20,
              padding: 16,
              marginBottom: 16,
            }}
          >
            {/* Row 1: Avatar & Author */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.tintBg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                 <Text style={{ fontSize: 16, fontWeight: '600', color: colors.tint }}>
                   {post.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                 </Text>
              </View>
              <View>
                <Text style={{ color: colors.label, fontSize: 16, fontWeight: '600' }}>{post.author}</Text>
                <Text style={{ color: colors.secondaryLabel, fontSize: 14 }}>{post.campus}</Text>
              </View>
            </View>

            {/* Row 2: Title */}
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: colors.label, marginBottom: 8 }}>
              {post.title}
            </Text>

            {/* Row 3: Description / Content */}
            {post.content ? (
              <Text style={{ fontSize: 14, color: colors.secondaryLabel, lineHeight: 20, marginBottom: 12 }} numberOfLines={3}>
                {post.content}
              </Text>
            ) : post.looking_for ? (
              <Text style={{ fontSize: 15, color: colors.blue, marginBottom: 12 }}>
                Looking for: {post.looking_for}
              </Text>
            ) : null}

            {/* Row 4: Tags */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {[...(post.skills || []), post.seriousness, post.bandwidth].filter(Boolean).map((tag, idx) => (
                <View key={idx} style={{ backgroundColor: colors.cardPressed, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' }}>
                  <Text style={{ color: colors.label, fontSize: 13 }}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Row 5: Action Bar */}
            <View style={{ alignItems: 'flex-end' }}>
              <AppleButton
                variant="primary"
                title="WhatsApp"
                onPress={() => handleWhatsApp(post.whatsapp)}
              />
            </View>
          </Pressable>
        ))
        )}
      </ScrollView>

      <CreateCollabModal
        visible={isCreateModalVisible}
        onRequestClose={() => setIsCreateModalVisible(false)}
        onPostCreated={() => {
          setIsCreateModalVisible(false);
          fetchCollabPosts();
        }}
      />

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      <FloatingActionButton onPress={() => setIsCreateModalVisible(true)} />
    </View>
  );
}