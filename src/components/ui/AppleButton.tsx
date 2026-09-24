import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface AppleButtonProps {
  title: string;
  icon?: React.ComponentType<{ size: number; color: string }>;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  style?: ViewStyle;
}

export function AppleButton({ title, icon: Icon, onPress, variant = 'primary', style }: AppleButtonProps) {
  const colors = useThemeColors();
  const isDark = colors.isDark;

  // Theme styling matrix
  let bgColor = colors.tint; // #34C759 Apple Green
  let textColor = colors.label; // Pure black in light, pure white in dark
  let borderColor = 'rgba(0,0,0,0.12)';
  let topBevelColor = 'rgba(255,255,255,0.35)'; // 3D specular highlight
  let bottomBevelColor = 'rgba(0,0,0,0.2)'; // 3D depth bevel

  if (variant === 'secondary') {
    bgColor = isDark ? '#2C2C2E' : '#E5E5EA'; // Apple System Gray 4/5
    textColor = colors.label; // Pure black in light, pure white in dark
    borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
    topBevelColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)';
    bottomBevelColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.12)';
  } else if (variant === 'destructive') {
    bgColor = isDark ? '#3A181A' : '#FFEBEE';
    textColor = colors.red;
    borderColor = isDark ? 'rgba(255,69,58,0.3)' : 'rgba(255,59,48,0.2)';
    topBevelColor = 'transparent';
    bottomBevelColor = 'transparent';
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: bgColor,
          height: 40,
          borderRadius: 14,
          borderCurve: 'continuous',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 14,
          gap: 6,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: borderColor,
          borderTopWidth: 1.5,
          borderTopColor: topBevelColor,
          borderBottomWidth: 2,
          borderBottomColor: bottomBevelColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 3,
          elevation: 2,
          transform: [
            { scale: pressed ? 0.96 : 1 },
            { translateY: pressed ? 1.5 : 0 } // Physical tactile sink
          ],
        },
        style,
      ]}
    >
      {Icon && <Icon size={15} color={textColor} />}
      <Text style={{ color: textColor, fontSize: 13.5, fontWeight: '600', letterSpacing: -0.2 }}>
        {title}
      </Text>
    </Pressable>
  );
}