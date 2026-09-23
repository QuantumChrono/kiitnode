import React from "react";
import { Pressable, Text, Linking } from "react-native";
import { MessageCircle } from "lucide-react-native";

interface WhatsAppButtonProps {
  phoneNumber: string;
  text?: string;
  className?: string;
}

export function WhatsAppButton({ phoneNumber, text = "", className = "" }: WhatsAppButtonProps) {
  const handlePress = async () => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-row items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 active:opacity-80 ${className}`}
    >
      <MessageCircle size={18} color="#FFFFFF" />
      <Text className="text-white font-semibold">WhatsApp</Text>
    </Pressable>
  );
}