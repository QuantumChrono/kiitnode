import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MessageCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useThemeColors } from '@/hooks/useThemeColors';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

interface Post {
  id: string;
  title: string;
  author: string;
  campus: string;
  skills: string[];
  seriousness: string;
  bandwidth: string;
  whatsapp?: string;
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
  },
];

export default function CollabScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Header />

      <FloatingActionButton onPress={() => {
        // TODO: Implement post creation modal
        alert('Create new post');
      }} />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + 96,
          paddingHorizontal: 16,
        }}
      >
        {/* Large Title */}
        <Text style={[styles.largeTitle, { color: colors.label }]}>Teammates</Text>

        {/* Seed Posts */}
        <View style={styles.postsContainer}>
          {SEED_POSTS.map((post) => (
            <Card key={post.id} style={styles.postCard}>
              {/* Title */}
              <Text style={[styles.postTitle, { color: colors.label }]}>
                {post.title}
              </Text>

              {/* Author & Campus */}
              <Text style={[styles.postMeta, { color: colors.secondaryLabel }]}>
                {post.author} • {post.campus}
              </Text>

              {/* Skill Tags */}
              <View style={styles.skillsRow}>
                {post.skills.map((skill) => (
                  <View key={skill} style={[styles.skillPill, { backgroundColor: colors.tintBg }]}>
                    <Text style={[styles.skillText, { color: colors.tint }]}>{skill}</Text>
                  </View>
                ))}
              </View>

              {/* Badges Row */}
              <View style={styles.badgesRow}>
                <Badge variant="emerald">{post.seriousness}</Badge>
                <Badge variant="slate">{post.bandwidth}</Badge>
              </View>

              {/* WhatsApp Action */}
              {post.whatsapp && (
                <Pressable
                  style={[styles.whatsappButton, { backgroundColor: colors.tint }]}
                  onPress={() => handleWhatsApp(post.whatsapp!)}
                >
                  <MessageCircle size={16} color="#FFFFFF" />
                  <Text style={styles.whatsappText}>Message</Text>
                </Pressable>
              )}
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
  postTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    lineHeight: 22,
  },
  postMeta: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.24,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  skillPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderCurve: 'continuous' as const,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderCurve: 'continuous' as const,
    marginTop: 8,
  },
  whatsappText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.24,
  },
});