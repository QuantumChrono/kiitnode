import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MessageCircle, Info } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useThemeColors } from '@/hooks/useThemeColors';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import { AppleButton } from '@/components/ui/AppleButton';
import PostDetailModal from '@/components/modals/PostDetailModal';
import CreateCollabModal from '@/components/modals/CreateCollabModal';

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
    whatsapp: '919999999991',
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
    whatsapp: '919999999992',
    looking_for: 'ML Engineer',
    content: 'Working on a natural language processing project for sentiment analysis of student feedback. Looking for teammates with ML/NLP experience.'
  },
  {
    id: '3',
    title: 'Hackathon team — SIH 2026',
    author: 'Arjun Patel',
    campus: 'Campus 6',
    skills: ['Full Stack', 'AI/ML'],
    seriousness: 'Very Serious',
    bandwidth: '20+ hrs/week',
    whatsapp: '919999999991',
    looking_for: 'Full Stack Developer',
    content: 'Preparing for Smart India Hackathon 2026. Need a full stack developer to build a healthcare solution using React Native and Node.js.'
  },
  {
    id: '4',
    title: 'IoT project partner needed',
    author: 'Sneha Mohanty',
    campus: 'Campus 15',
    skills: ['Arduino', 'Sensors'],
    seriousness: 'Serious',
    bandwidth: '5-10 hrs/week',
    whatsapp: '919999999992',
    looking_for: 'IoT Engineer',
    content: 'Building a smart campus irrigation system using Arduino and soil moisture sensors. Need a partner with IoT and embedded systems experience.'
  },
  {
    id: '5',
    title: 'Open-source contributors wanted',
    author: 'Arjun Patel',
    campus: 'Campus 6',
    skills: ['Git', 'Open Source'],
    seriousness: 'Casual',
    bandwidth: 'Any',
    whatsapp: '919999999991',
    looking_for: 'Open Source Contributor',
    content: 'Maintaining an open-source library for campus navigation. Looking for contributors to help with documentation, testing, and feature development.'
  },
];

export default function CollabScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}`);
  };

  const handleCreatePost = (newPost: any) => {
    // Prepend new post to the feed
    setIsCreateModalVisible(false);
    // In a real app, we would fetch fresh data or update state
    // For now, we'll just close the modal and rely on refresh
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Header />

      <FloatingActionButton onPress={() => setIsCreateModalVisible(true)} />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 64,
          paddingBottom: insets.bottom + 130,
          paddingHorizontal: 16,
        }}
      >
        {/* Large Title */}
        <Text style={[styles.largeTitle, { color: colors.label, marginTop: 8, marginBottom: 16 }]}>Teammates</Text>

        {/* Seed Posts */}
        <View style={styles.postsContainer}>
          {SEED_POSTS.map((post) => (
            <Card
              key={post.id}
              style={{
                padding: 16,
                gap: 10,
                backgroundColor: colors.card
              }}
            >
              {/* 1. Title takes full width */}
              <Text style={{
                fontSize: 17,
                fontWeight: '600',
                color: colors.label
              }}>
                {post.title}
              </Text>

              {/* 2. Author and Location */}
              <Text style={{
                fontSize: 14,
                color: colors.secondaryLabel
              }}>
                {post.author} • {post.campus}
              </Text>

              {/* 3. Looking For (if exists) */}
              {post.looking_for && (
                <Text style={{
                  fontSize: 14,
                  color: colors.blue,
                  marginVertical: 4
                }}>
                  Looking for: {post.looking_for}
                </Text>
              )}

              {/* 4. Skill & Bandwidth Badges */}
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 6,
                marginVertical: 4
              }}>
                {/* Skill Tags */}
                {post.skills.map((skill) => (
                  <View
                    key={skill}
                    style={{
                      backgroundColor: colors.isDark ? '#2C2C2E' : '#F2F2F7',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                      borderCurve: 'continuous' as const
                    }}
                  >
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '500',
                      color: colors.label
                    }}>
                      {skill}
                    </Text>
                  </View>
                ))}

                {/* Seriousness Badge */}
                {post.seriousness && (
                  <View style={{
                    backgroundColor: colors.isDark ? '#2C2C2E' : '#F2F2F7',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    borderCurve: 'continuous' as const
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '500',
                      color: colors.label
                    }}>
                      {post.seriousness}
                    </Text>
                  </View>
                )}

                {/* Bandwidth Badge */}
                {post.bandwidth && (
                  <View style={{
                    backgroundColor: colors.isDark ? '#2C2C2E' : '#F2F2F7',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    borderCurve: 'continuous' as const
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '500',
                      color: colors.label
                    }}>
                      {post.bandwidth}
                    </Text>
                  </View>
                )}
              </View>

              {/* 5. Action Button Row: Dual Button Layout */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, width: '100%' }}>
                <AppleButton
                  title="Details"
                  icon={Info}
                  variant="secondary"
                  onPress={() => setSelectedPost(post)}
                  style={{ flex: 1 }}
                />
                <AppleButton
                  title="Message"
                  icon={MessageCircle}
                  variant="primary"
                  onPress={() => handleWhatsApp(post.whatsapp!)}
                  style={{ flex: 1.2 }}
                />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Create Collab Modal */}
      <CreateCollabModal
        visible={isCreateModalVisible}
        onRequestClose={() => setIsCreateModalVisible(false)}
        onPostCreated={handleCreatePost}
      />

      {/* Details Bottom Sheet Modal */}
      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
    marginBottom: 12,
    marginTop: 8,
  },
  postsContainer: {
    gap: 12,
  },
});