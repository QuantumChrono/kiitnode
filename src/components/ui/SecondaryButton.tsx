import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export function SecondaryButton({ title, icon: Icon, onPress, style, variant = 'neutral' }: { title: string, icon?: any, onPress?: () => void, style?: ViewStyle, variant?: 'neutral' | 'tint' }) {
  const colors = useThemeColors();
  const bgColor = variant === 'tint'
    ? (colors.isDark ? '#2C2C2E' : '#E5E5EA')
    : colors.cardPressed;
  const textColor = variant === 'tint' ? colors.tint : colors.label;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: bgColor,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 18,
          borderCurve: 'continuous',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: colors.isDark ? 0.2 : 0.05,
          shadowRadius: 2,
          elevation: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
        style
      ]}
    >
      {Icon && <Icon size={14} color={textColor} />}
      <Text style={{ color: textColor, fontSize: 13, fontWeight: '600' }}>{title}</Text>
    </Pressable>
  );
}