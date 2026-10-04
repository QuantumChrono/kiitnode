import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Header } from '@/components/ui/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import PostDetailModal from '@/components/modals/PostDetailModal';
import CreateCollabModal from '@/components/modals/CreateCollabModal';
import { AppleButton } from '@/components/ui/AppleButton';

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

const SEED_POSTS: Post[] = [
  {
    id: '1',
    title: 'Need a React Native dev for campus app',
    author: 'Arjun Patel',
    campus: 'Campus 6',
    skills: ['React Native', 'TypeScript'],
    seriousness: 'Serious',
    bandwidth: '5-10 hrs/week',
    whatsapp: '9999999991',
    looking_for: 'Backend Developer',
    content: 'We are building a campus event management app and need a React Native developer to join our team. Experience with Expo and TypeScript preferred.'
  },
  {
    id: '2',
    title: 'Looking for ML teammates — NLP project',
    author: 'Sneha Mohanty',
    campus: 'Campus 15',
    skills: ['Machine Learning', 'Python'],
    seriousness: 'Casual',
    bandwidth: '2-5 hrs/week',
    whatsapp: '9999999992',
    looking_for: 'ML Engineer',
    content: 'Working on a natural language processing project for sentiment analysis of student feedback. Looking for teammates with ML/NLP experience.'
  },
];

export default function CollabScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

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

  const handleCreatePost = (newPost: any) => {
    setIsCreateModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 64, paddingBottom: 180, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 34, fontWeight: '700', color: colors.label, marginBottom: 16, marginTop: 8 }}>Teammates</Text>

        {SEED_POSTS.map((post) => (
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

            {/* Row 3: Looking for */}
            {post.looking_for && (
              <Text style={{ fontSize: 15, color: colors.blue, marginBottom: 12 }}>
                Looking for: {post.looking_for}
              </Text>
            )}

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
        ))}
      </ScrollView>

      <CreateCollabModal
        visible={isCreateModalVisible}
        onRequestClose={() => setIsCreateModalVisible(false)}
        onPostCreated={handleCreatePost}
      />

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      <FloatingActionButton onPress={() => setIsCreateModalVisible(true)} />
    </View>
  );
}