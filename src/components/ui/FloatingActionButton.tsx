import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function FloatingActionButton({ onPress }: { onPress: () => void }) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={({ pressed }) => [
        {
          position: 'absolute',
          right: 24,
          bottom: (insets?.bottom ?? 0) + 90, // Hard offset above tab bar
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.tint,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          zIndex: 9999,
          transform: [{ scale: pressed ? 0.92 : 1 }]
        }
      ]}
    >
      <Plus size={30} color="#FFFFFF" />
    </Pressable>
  );
}