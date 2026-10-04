import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { MessageCircle, ThumbsUp, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAuth } from '@/hooks/useAuth';
import { AuthContextType } from '@/context/AuthContext';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import PostDetailModal from '@/components/modals/PostDetailModal';
import CreateForumModal from '@/components/modals/CreateForumModal';
import * as Haptics from 'expo-haptics';

interface Post {
  id: string;
  title: string;
  author: string;
  campus: string;
  isAnonymous: boolean;
  likes: number;
  comments: number;
  category: string;
  content?: string;
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
    content: 'Final exams are approaching. I have compiled all my notes from the last 3 semesters into a Drive link. Drop your links below and let\'s help each other out!'
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
    content: 'Is anyone else experiencing multiple power cuts every day this week? It is making it impossible to focus on assignments.'
  },
];

function ForumCard({ post, onPress }: { post: Post, onPress: () => void }) {
  const colors = useThemeColors();
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const toggleUpvote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsUpvoted(!isUpvoted);
    setLikesCount(prev => isUpvoted ? prev - 1 : prev + 1);
  };

  const handleCommentPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => pressed && styles.cardPressed}
    >
      <Card style={{ padding: 16, gap: 12, backgroundColor: colors.card }}>
        {/* Header Row: Avatar, Author Name, Metadata */}
        <View style={styles.headerRow}>
          <View style={[styles.avatar, { backgroundColor: colors.tintBg }]}>
            {post.isAnonymous ? (
              <EyeOff size={18} color={colors.tint} />
            ) : (
              <Text style={[styles.avatarText, { color: colors.tint }]}>
                {(post.author || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </Text>
            )}
          </View>
          <View style={styles.headerTextInfo}>
            <Text style={[styles.authorName, { color: colors.label }]}>
              {post.isAnonymous ? 'Anonymous Student' : post.author}
            </Text>
            <Text style={[styles.metadata, { color: colors.secondaryLabel }]}>
              {post.isAnonymous ? 'Hidden Location' : post.campus}
            </Text>
          </View>
        </View>

        {/* Body: Title, Description */}
        <View style={styles.bodyBlock}>
          <Text style={[styles.postTitle, { color: colors.label }]}>
            {post.title}
          </Text>
          {post.content && (
            <Text style={[styles.postDesc, { color: colors.secondaryLabel }]} numberOfLines={3}>
              {post.content}
            </Text>
          )}
        </View>

        {/* Tags/Category */}
        <View style={styles.tagsContainer}>
          <View style={[styles.tagPill, { backgroundColor: colors.cardPressed }]}>
            <Text style={[styles.tagText, { color: colors.label }]}>{post.category}</Text>
          </View>
        </View>

        {/* Social Action Bar */}
        <View style={[styles.actionBar, { borderTopColor: colors.separator }]}>
          <View style={styles.actionLeftGroup}>
            <Pressable
              onPress={toggleUpvote}
              style={({ pressed }) => [
                styles.actionItem,
                { transform: [{ scale: pressed ? 0.9 : 1 }] }
              ]}
              hitSlop={8}
            >
              <ThumbsUp size={18} color={isUpvoted ? colors.tint : colors.secondaryLabel} />
              <Text style={[
                styles.actionItemText,
                { color: isUpvoted ? colors.tint : colors.secondaryLabel }
              ]}>
                {likesCount}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCommentPress}
              style={({ pressed }) => [
                styles.actionItem,
                { transform: [{ scale: pressed ? 0.9 : 1 }] }
              ]}
              hitSlop={8}
            >
              <MessageCircle size={18} color={colors.secondaryLabel} />
              <Text style={[styles.actionItemText, { color: colors.secondaryLabel }]}>
                {post.comments}
              </Text>
            </Pressable>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

export default function ForumScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const auth = useAuth() as AuthContextType;
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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
        <Text style={[styles.largeTitle, { color: colors.label, marginTop: 8, marginBottom: 0 }]}>Forum</Text>

        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <ForumCard
              key={post.id}
              post={post}
              onPress={() => setSelectedPost(post)}
            />
          ))}
        </View>
      </ScrollView>

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      <CreateForumModal
        visible={isCreateModalVisible}
        onRequestClose={() => setIsCreateModalVisible(false)}
        onPostCreated={(newPost) => {
          const newForumPost: Post = {
            id: newPost.id,
            title: newPost.title,
            author: newPost.is_anonymous ? '' : (auth.profile?.full_name || 'Current User'),
            campus: newPost.location_tag || '',
            isAnonymous: newPost.is_anonymous,
            likes: 0,
            comments: 0,
            category: newPost.content.includes('Academic') || newPost.content.includes('academic') ? 'Academic' :
                     newPost.content.includes('Events') || newPost.content.includes('events') ? 'Events' : 'Campus',
            content: newPost.content
          };
          setPosts([newForumPost, ...posts]);
          setIsCreateModalVisible(false);
        }}
      />

      <FloatingActionButton onPress={() => setIsCreateModalVisible(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  largeTitle: { fontSize: 34, fontWeight: '700', letterSpacing: 0.37 },
  postsContainer: { gap: 16 },
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
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  actionItemText: {
    fontSize: 14,
    fontWeight: '600',
  }
});