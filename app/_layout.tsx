import "../global.css";
import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

function RootLayoutNav() {
  const { session, profile, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session) {
      if (!inAuthGroup) {
        // Not signed in and not in auth group -> redirect to login
        router.replace("/(auth)/login");
      }
    } else {
      // Signed in
      const needsOnboarding = !profile?.whatsapp_number || !profile?.campus_location;

      if (needsOnboarding) {
        if (segments.join("/") !== "(auth)/onboarding") {
          router.replace("/(auth)/onboarding");
        }
      } else {
        if (inAuthGroup) {
          // Setup complete and in auth group -> redirect to main app
          // Assuming `/(tabs)` or comparable destination as the app root
          router.replace("/(tabs)/collab");
        }
      }
    }
  }, [session, profile, isLoading, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false, animation: "fade" }} />
      {/*
        This will try to load (tabs) if it exists, otherwise it will just load it normally.
        Since we might not have tabs yet, we can either define it now or let the router fail gracefully during testing.
      */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
