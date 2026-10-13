import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ExternalLink, ThumbsUp, FileText, Calendar, Bus, BookOpen, Globe, Smartphone, Wrench } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface DirectoryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  upvotes: number;
  link?: string;
  isDbResource?: boolean;
}

const FALLBACK_RESOURCES: DirectoryItem[] = [
  {
    id: 'seed-1',
    title: 'SAP Portal Helper',
    description: 'Guide for navigating KIIT SAP portal, grade viewing, and fee payment',
    category: 'TOOL',
    upvotes: 156,
    link: 'https://kiit.ac.in',
  },
  {
    id: 'seed-2',
    title: 'Notes Drive',
    description: 'Community-maintained Google Drive with notes, PYQs, and slides for all subjects',
    category: 'NOTES',
    upvotes: 243,
    link: 'https://drive.google.com',
  },
  {
    id: 'seed-3',
    title: 'Shuttle Tracker',
    description: 'Live shuttle timing and route map for campus transport',
    category: 'APP',
    upvotes: 89,
    link: 'https://kiit.ac.in',
  },
  {
    id: 'seed-4',
    title: 'Academic Calendar',
    description: 'Official academic calendar with exam dates, holidays, and registration deadlines',
    category: 'WEBSITE',
    upvotes: 312,
    link: 'https://kiit.ac.in/academic-calendar',
  },
];

export default function DirectoryScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { profile } = useAuth();

  const [resources, setResources] = useState<DirectoryItem[]>([]);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDirectory = React.useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from('resources')
        .select('*')
        .order('upvotes_count', { ascending: false });

      if (fetchErr) throw fetchErr;

      let userUpvotes = new Set<string>();
      if (profile?.id) {
        const { data: upvoteData } = await supabase
          .from('resource_upvotes')
          .select('resource_id')
          .eq('user_id', profile.id);

        if (upvoteData) {
          userUpvotes = new Set(upvoteData.map((u: any) => u.resource_id));
        }
      }
      setUpvotedIds(userUpvotes);

      if (data && data.length > 0) {
        const formatted: DirectoryItem[] = data.map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          category: r.category,
          upvotes: r.upvotes_count ?? 0,
          link: r.url,
          isDbResource: true,
        }));
        setResources(formatted);
      } else {
        // Graceful fallback to curated seeds if table has not been populated yet
        setResources(FALLBACK_RESOURCES);
      }
    } catch (err) {
      console.error('Error fetching directory:', err);
      // Fallback on error to ensure student always sees verified directory links
      setResources(FALLBACK_RESOURCES);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchDirectory();
  }, [fetchDirectory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDirectory(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    fetchDirectory();
  };

  const handleToggleUpvote = async (item: DirectoryItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const isCurrentlyUpvoted = upvotedIds.has(item.id);
    const newUpvoted = !isCurrentlyUpvoted;

    // Optimistic UI update
    setUpvotedIds((prev) => {
      const next = new Set(prev);
      if (newUpvoted) {
        next.add(item.id);
      } else {
        next.delete(item.id);
      }
      return next;
    });

    setResources((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? { ...r, upvotes: Math.max(0, r.upvotes + (newUpvoted ? 1 : -1)) }
          : r
      )
    );

    // Sync to Supabase if item is a real database resource and user is logged in
    if (item.isDbResource && profile?.id) {
      try {
        if (newUpvoted) {
          await supabase.from('resource_upvotes').insert({
            user_id: profile.id,
            resource_id: item.id,
          } as any);
        } else {
          await supabase
            .from('resource_upvotes')
            .delete()
            .eq('user_id', profile.id)
            .eq('resource_id', item.id);
        }
      } catch (err) {
        console.error('Failed to update upvote on server:', err);
        // Revert optimistic update
        setUpvotedIds((prev) => {
          const next = new Set(prev);
          if (isCurrentlyUpvoted) {
            next.add(item.id);
          } else {
            next.delete(item.id);
          }
          return next;
        });
        setResources((prev) =>
          prev.map((r) =>
            r.id === item.id
              ? { ...r, upvotes: Math.max(0, r.upvotes + (isCurrentlyUpvoted ? 1 : -1)) }
              : r
          )
        );
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = (category || '').toUpperCase();
    switch (cat) {
      case 'TOOL': return Wrench;
      case 'NOTES': return BookOpen;
      case 'CALENDAR': return Calendar;
      case 'TRANSPORT': return Bus;
      case 'APP': return Smartphone;
      case 'WEBSITE': return Globe;
      default: return FileText;
    }
  };

  const getCategoryVariant = (category: string) => {
    const cat = (category || '').toUpperCase();
    switch (cat) {
      case 'TOOL': return 'blue';
      case 'NOTES': return 'violet';
      case 'CALENDAR': return 'amber';
      case 'TRANSPORT': return 'emerald';
      case 'APP': return 'cyan';
      case 'WEBSITE': return 'indigo';
      default: return 'slate';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Header />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + 140,
          paddingHorizontal: 16,
          gap: 16,
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
        {/* Large Title */}
        <Text style={[styles.largeTitle, { color: colors.label, marginTop: 8, marginBottom: 0 }]}>
          Directory
        </Text>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.errorText, { color: colors.secondaryLabel }]}>{error}</Text>
            <Pressable
              onPress={handleRetry}
              style={[styles.retryButton, { backgroundColor: colors.tint }]}
            >
              <Text style={[styles.retryButtonText, { color: colors.card }]}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.resourcesContainer}>
            {resources.map((resource) => {
              const IconComponent = getCategoryIcon(resource.category);
              const isUpvoted = upvotedIds.has(resource.id);

              return (
                <Card key={resource.id} style={{ ...styles.resourceCard, backgroundColor: colors.card }}>
                  {/* Category Badge & Icon */}
                  <View style={styles.categoryRow}>
                    <Badge variant={getCategoryVariant(resource.category)}>
                      {resource.category}
                    </Badge>
                    <IconComponent size={15} color={colors.secondaryLabel} style={{ marginLeft: 8, alignSelf: 'center' }} />
                  </View>

                  {/* Title & External Link */}
                  <View style={styles.titleRow}>
                    <Text style={[styles.resourceTitle, { color: colors.label }]}>
                      {resource.title}
                    </Text>
                    {resource.link && (
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          if (resource.link) Linking.openURL(resource.link);
                        }}
                        hitSlop={8}
                        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                      >
                        <ExternalLink size={18} color={colors.blue} />
                      </Pressable>
                    )}
                  </View>

                  {/* Description */}
                  <Text style={[styles.resourceDesc, { color: colors.secondaryLabel }]}>
                    {resource.description}
                  </Text>

                  {/* Interactive Upvote Button */}
                  <Pressable
                    onPress={() => handleToggleUpvote(resource)}
                    style={({ pressed }) => [
                      styles.upvoteButton,
                      {
                        borderColor: isUpvoted ? colors.tint : colors.separator,
                        backgroundColor: isUpvoted ? colors.tintBg : (pressed ? colors.cardPressed : 'transparent'),
                        transform: [{ scale: pressed ? 0.96 : 1 }],
                      },
                    ]}
                    hitSlop={6}
                  >
                    <ThumbsUp
                      size={14}
                      color={isUpvoted ? colors.tint : colors.secondaryLabel}
                    />
                    <Text
                      style={[
                        styles.upvoteText,
                        {
                          color: isUpvoted ? colors.tint : colors.secondaryLabel,
                          fontWeight: isUpvoted ? '600' : '400',
                        },
                      ]}
                    >
                      {resource.upvotes}
                    </Text>
                  </Pressable>
                </Card>
              );
            })}
          </View>
        )}
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
  },
  resourcesContainer: {
    gap: 16,
  },
  resourceCard: {
    padding: 16,
    gap: 10,
    borderRadius: 20,
  },
  categoryRow: {
    flexDirection: 'row',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
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
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  upvoteText: {
    fontSize: 13,
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
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});