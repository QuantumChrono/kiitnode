import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CollabScreen() {
  const { signOut, profile } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-campus-dark-bg items-center justify-center px-4">
      <Text className="text-white text-2xl mb-4 font-bold">Collab / Home Stub</Text>
      <Text className="text-slate-300 mb-8 text-center text-lg">Welcome {profile?.full_name}!</Text>
      <TouchableOpacity onPress={signOut} className="bg-slate-800 py-3 px-6 rounded-lg">
        <Text className="text-white font-medium text-lg">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
