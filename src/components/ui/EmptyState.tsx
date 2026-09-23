import React from "react";
import { View, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-slate-800">
        <Icon size={32} color="#64748B" />
      </View>
      <Text className="mb-2 text-center text-lg font-semibold text-white">
        {title}
      </Text>
      <Text className="text-center text-base text-slate-400">{description}</Text>
    </View>
  );
}