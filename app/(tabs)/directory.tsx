import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ExternalLink, ThumbsUp, FileText, Calendar, Bus, BookOpen } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useThemeColors } from '@/hooks/useThemeColors';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'TOOL' | 'NOTES' | 'CALENDAR' | 'TRANSPORT';
  upvotes: number;
  link?: string;
}

const SEED_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'SAP Portal Helper',
    description: 'Guide for navigating KIIT SAP portal, grade viewing, and fee payment',
    category: 'TOOL',
    upvotes: 156,
    link: 'https://kiit.ac.in',
  },
  {
    id: '2',
    title: 'Notes Drive',
    description: 'Shared Google Drive with subject notes from seniors',
    category: 'NOTES',
    upvotes: 243,
    link: 'https://drive.google.com',
  },
  {
    id: '3',
    title: 'Shuttle Tracker',
    description: 'Live shuttle timing and route map for campus transport',
    category: 'TRANSPORT',
    upvotes: 89,
  },
  {
    id: '4',
    title: 'Academic Calendar',
    description: 'Exam dates, holidays, and important academic deadlines',
    category: 'CALENDAR',
    upvotes: 312,
    link: 'https://kiit.ac.in/calendar',
  },
];

export default function DirectoryScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const getCategoryIcon = (category: Resource['category']) => {
    switch (category) {
      case 'TOOL': return FileText;
      case 'NOTES': return BookOpen;
      case 'CALENDAR': return Calendar;
      case 'TRANSPORT': return Bus;
      default: return FileText;
    }
  };

  const getCategoryVariant = (category: Resource['category']) => {
    switch (category) {
      case 'TOOL': return 'blue';
      case 'NOTES': return 'violet';
      case 'CALENDAR': return 'amber';
      case 'TRANSPORT': return 'emerald';
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
        <Text style={[styles.largeTitle, { color: colors.label, marginTop: 8, marginBottom: 16 }]}>Directory</Text>

        {/* Seed Resources */}
        <View style={styles.resourcesContainer}>
          {SEED_RESOURCES.map((resource) => {
            const IconComponent = getCategoryIcon(resource.category);

            return (
              <Card key={resource.id} style={styles.resourceCard}>
                {/* Category Badge */}
                <View style={styles.categoryRow}>
                  <Badge variant={getCategoryVariant(resource.category)}>
                    {resource.category}
                  </Badge>
                </View>

                {/* Title */}
                <View style={styles.titleRow}>
                  <Text style={[styles.resourceTitle, { color: colors.label }]}>
                    {resource.title}
                  </Text>
                  {resource.link && (
                    <Pressable
                      onPress={() => resource.link && Linking.openURL(resource.link)}
                      hitSlop={8}
                    >
                      <ExternalLink size={18} color={colors.blue} />
                    </Pressable>
                  )}
                </View>

                {/* Description */}
                <Text style={[styles.resourceDesc, { color: colors.secondaryLabel }]}>
                  {resource.description}
                </Text>

                {/* Upvote Button */}
                <Pressable style={[styles.upvoteButton, { borderColor: colors.separator }]}>
                  <ThumbsUp size={14} color={colors.secondaryLabel} />
                  <Text style={[styles.upvoteText, { color: colors.secondaryLabel }]}>
                    {resource.upvotes}
                  </Text>
                </Pressable>
              </Card>
            );
          })}
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
  resourcesContainer: {
    gap: 12,
  },
  resourceCard: {
    padding: 16,
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    flex: 1,
  },
  resourceDesc: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.24,
    lineHeight: 20,
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderCurve: 'continuous' as const,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  upvoteText: {
    fontSize: 13,
    fontWeight: '400',
  },
});