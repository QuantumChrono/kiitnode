import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { signInWithGoogle, isLoading, devSwitchUser, domainError, clearDomainError } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-campus-dark-bg">
      <View className="flex-1 justify-center px-6">

        {/* Header / Branding */}
        <View className="items-center mb-12">
          <Text className="text-5xl font-bold text-campus-primary tracking-tighter shadow-sm mb-2">KIIT Node</Text>
          <Text className="text-slate-300 text-lg font-medium tracking-wide">The Verified Campus Network</Text>
        </View>

        {/* Auth Box */}
        <View className="bg-campus-dark-surface rounded-3xl p-6 shadow-lg border border-slate-800">
          <TouchableOpacity
            className={`w-full py-4 rounded-xl flex-row justify-center items-center ${isLoading ? 'bg-campus-primary/70' : 'bg-campus-primary'}`}
            onPress={signInWithGoogle}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-bold">Continue with KIIT Mail</Text>
            )}
          </TouchableOpacity>

          <Text className="text-slate-400 text-center mt-6 text-sm px-2">
            Restricted to verified @kiit.ac.in accounts only. Student-run community, not officially affiliated with KIIT.
          </Text>
        </View>

        {/* Developer Bypass (__DEV__ only) */}
        {__DEV__ && (
          <View className="mt-12">
            <Text className="text-slate-500 font-bold mb-3 text-center text-xs uppercase tracking-widest">
              Developer Bypass: Quick Switch User
            </Text>
            <View className="flex-row flex-wrap justify-center gap-2">
              <TouchableOpacity onPress={() => devSwitchUser('arjun')} className="bg-slate-800 py-2 px-3 rounded-md">
                <Text className="text-slate-300 text-sm font-medium">Arjun - CSE</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => devSwitchUser('sneha')} className="bg-slate-800 py-2 px-3 rounded-md">
                <Text className="text-slate-300 text-sm font-medium">Sneha - Mech</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => devSwitchUser('ravi')} className="bg-slate-800 py-2 px-3 rounded-md border border-campus-primary/30">
                <Text className="text-campus-primary-light text-sm font-medium">Ravi - Mod</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Domain Error Modal */}
      <Modal visible={!!domainError} transparent animationType="fade">
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
          <View className="bg-campus-dark-surface rounded-2xl p-6 w-full max-w-sm border-l-4 border-red-500 shadow-2xl">
            <Text className="text-red-400 font-bold text-xl mb-3">Access Denied</Text>
            <Text className="text-slate-300 mb-6 text-base leading-relaxed">
              {domainError}
            </Text>
            <TouchableOpacity
              className="bg-slate-800 py-3 rounded-lg items-center active:bg-slate-700 transition-colors"
              onPress={clearDomainError}
            >
              <Text className="text-white font-bold">Acknowledge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
