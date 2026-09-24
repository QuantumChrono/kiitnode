import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MessageCircle, EyeOff, ThumbsUp } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';

interface Post {
  id: string;
  title: string;
  author: string;
  campus: string;
  isAnonymous: boolean;
  likes: number;
  comments: number;
  category: string;
}

const SEED_POSTS: Post[] = [
  {
    id: '1',
    title: 'Exam notes drive - Share your PDFs!',
    author: 'Arjun Patel',
    campus: 'Campus 6',
    isAnonymous: false,
    likes: 24,
    comments: 8,
    category: 'Academic',
  },
  {
    id: '2',
    title: 'Robotics workshop this Saturday',
    author: 'Sneha Mohanty',
    campus: 'Campus 15',
    isAnonymous: false,
    likes: 18,
    comments: 5,
    category: 'Events',
  },
  {
    id: '3',
    title: 'Hostel power cuts are getting worse...',
    author: '',
    campus: '',
    isAnonymous: true,
    likes: 42,
    comments: 15,
    category: 'Campus',
  },
];

export default function ForumScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'Academic': return 'blue';
      case 'Events': return 'amber';
      case 'Campus': return 'violet';
      default: return 'slate';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Header />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 64,
          paddingBottom: insets.bottom + 130,
          paddingHorizontal: 16,
        }}
      >
        {/* Large Title */}
        <Text style={[styles.largeTitle, { color: colors.label, marginTop: 8, marginBottom: 16 }]}>Forum</Text>

        {/* Seed Posts */}
        <View style={styles.postsContainer}>
          {SEED_POSTS.map((post) => (
            <Card key={post.id} style={styles.postCard}>
              {/* Category Badge */}
              <View style={styles.categoryRow}>
                <Badge variant={getCategoryVariant(post.category)}>{post.category}</Badge>
              </View>

              {/* Title */}
              <Text style={[styles.postTitle, { color: colors.label }]}>
                {post.title}
              </Text>

              {/* Author / Anonymous */}
              <View style={styles.authorRow}>
                {post.isAnonymous ? (
                  <View style={styles.anonymousContainer}>
                    <EyeOff size={14} color={colors.secondaryLabel} />
                    <Text style={[styles.anonymousText, { color: colors.secondaryLabel }]}>
                      Anonymous Student
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.authorText, { color: colors.secondaryLabel }]}>
                    {post.author} • {post.campus}
                  </Text>
                )}
              </View>

              {/* Engagement Row */}
              <View style={styles.engagementRow}>
                <Pressable style={styles.engagementButton}>
                  <ThumbsUp size={14} color={colors.secondaryLabel} />
                  <Text style={[styles.engagementText, { color: colors.secondaryLabel }]}>
                    {post.likes}
                  </Text>
                </Pressable>
                <Pressable style={styles.engagementButton}>
                  <MessageCircle size={14} color={colors.secondaryLabel} />
                  <Text style={[styles.engagementText, { color: colors.secondaryLabel }]}>
                    {post.comments}
                  </Text>
                </Pressable>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
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
  postCard: {
    padding: 16,
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
  },
  postTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    lineHeight: 22,
  },
  authorRow: {
    marginTop: 4,
  },
  authorText: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.24,
  },
  anonymousContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  anonymousText: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.24,
  },
  engagementRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementText: {
    fontSize: 13,
    fontWeight: '400',
  },
});