import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MessageCircle, Info, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useThemeColors } from '@/hooks/useThemeColors';
import { AppleButton } from '@/components/ui/AppleButton';
import PostDetailModal from '@/components/modals/PostDetailModal';

interface Listing {
  id: string;
  title: string;
  price: string;
  location: string;
  type: 'selling' | 'buying' | 'renting';
  whatsapp?: string;
}

const SEED_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'TI-84 Calculator',
    price: '₹2500',
    location: 'Campus 6 Food Court',
    type: 'selling',
    whatsapp: '919999999991',
  },
  {
    id: '2',
    title: 'Second-hand cycle',
    price: '₹3000',
    location: 'Hostel KP-7 Gate',
    type: 'buying',
    whatsapp: '919999999992',
  },
  {
    id: '3',
    title: 'Room cooler rental',
    price: '₹500/mo',
    location: 'Library Lawn',
    type: 'renting',
    whatsapp: '919999999991',
  },
  {
    id: '4',
    title: 'Data Structures textbook',
    price: '₹400',
    location: 'Campus 6 Food Court',
    type: 'selling',
    whatsapp: '919999999992',
  },
];

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [selectedPost, setSelectedPost] = useState<Listing | null>(null);

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Header />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 16,
        }}
      >
        {/* Large Title */}
        <Text style={[styles.largeTitle, { color: colors.label }]}>Market</Text>

        {/* Seed Listings */}
        <View style={styles.listingsContainer}>
          {SEED_LISTINGS.map((listing) => (
            <Card key={listing.id} style={{ padding: 16, gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <Text style={{ fontSize: 17, fontWeight: '600', color: colors.label, flex: 1, flexWrap: 'wrap' }}>
                  {listing.title}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.label }}>
                  {listing.price}
                </Text>
              </View>

              <Text style={{ fontSize: 14, color: colors.secondaryLabel }}>
                {listing.location}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                {/* Badge (Selling/Buying) */}
                {listing.type && (
                  <View style={[
                    styles.typeBadge,
                    {
                      backgroundColor: colors.tintBg,
                    }
                  ]}>
                    <Text style={[
                      styles.typeBadgeText,
                      { color: colors.label },
                    ]}>
                      {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                    </Text>
                  </View>
                )}

                {/* Action Button Row: Dual Button Layout */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <AppleButton
                    title="Details"
                    icon={Info}
                    variant="secondary"
                    onPress={() => setSelectedPost(listing)}
                    style={{ flex: 1 }}
                  />
                  <AppleButton
                    title="Contact"
                    icon={MessageCircle}
                    variant="primary"
                    onPress={() => handleWhatsApp(listing.whatsapp!)}
                    style={{ flex: 1.2 }}
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

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
  listingsContainer: {
    gap: 12,
  },
  listingCard: {
    padding: 16,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    flex: 1,
  },
  listingPrice: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.41,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.24,
  },
  typeRow: {
    marginTop: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderCurve: 'continuous' as const,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.24,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderCurve: 'continuous' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.24,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  detailsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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