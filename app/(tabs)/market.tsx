import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MessageCircle, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useThemeColors } from '@/hooks/useThemeColors';

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

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}`);
  };

  const getTypeVariant = (type: Listing['type']) => {
    switch (type) {
      case 'selling': return 'emerald';
      case 'buying': return 'blue';
      case 'renting': return 'amber';
      default: return 'slate';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Header />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + 96,
          paddingHorizontal: 16,
        }}
      >
        {/* Large Title */}
        <Text style={[styles.largeTitle, { color: colors.label }]}>Market</Text>

        {/* Seed Listings */}
        <View style={styles.listingsContainer}>
          {SEED_LISTINGS.map((listing) => (
            <Card key={listing.id} style={styles.listingCard}>
              {/* Title & Price Row */}
              <View style={styles.titleRow}>
                <Text style={[styles.listingTitle, { color: colors.label }]}>
                  {listing.title}
                </Text>
                <Text style={[styles.listingPrice, { color: colors.label }]}>
                  {listing.price}
                </Text>
              </View>

              {/* Location */}
              <View style={styles.locationRow}>
                <MapPin size={14} color={colors.secondaryLabel} />
                <Text style={[styles.locationText, { color: colors.secondaryLabel }]}>
                  {listing.location}
                </Text>
              </View>

              {/* Type Badge */}
              <View style={styles.typeRow}>
                <Badge variant={getTypeVariant(listing.type)}>
                  {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                </Badge>
              </View>

              {/* WhatsApp Action */}
              {listing.whatsapp && (
                <Pressable
                  style={[styles.whatsappButton, { backgroundColor: colors.tint }]}
                  onPress={() => handleWhatsApp(listing.whatsapp!)}
                >
                  <MessageCircle size={16} color="#FFFFFF" />
                  <Text style={styles.whatsappText}>Contact</Text>
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