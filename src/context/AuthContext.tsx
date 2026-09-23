import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/database";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isModerator: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  devSwitchUser: (email: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  domainError: string | null;
  clearDomainError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isModerator: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  devSwitchUser: async () => {},
  updateProfile: async () => {},
  domainError: null,
  clearDomainError: () => {},
});

const DEV_MOCK_PROFILES: Record<string, Profile> = {
  "2205001@kiit.ac.in": {
    id: "11111111-1111-1111-1111-111111111111",
    email: "2205001@kiit.ac.in",
    full_name: "Arjun Patel",
    avatar_url: null,
    campus_location: "Campus 6",
    whatsapp_number: "919876543210",
    is_moderator: false,
    created_at: new Date().toISOString(),
  },
  "2205002@kiit.ac.in": {
    id: "22222222-2222-2222-2222-222222222222",
    email: "2205002@kiit.ac.in",
    full_name: "Sneha Mohanty",
    avatar_url: null,
    campus_location: "Campus 15",
    whatsapp_number: "919876543211",
    is_moderator: false,
    created_at: new Date().toISOString(),
  },
  "2205003@kiit.ac.in": {
    id: "33333333-3333-3333-3333-333333333333",
    email: "2205003@kiit.ac.in",
    full_name: "Ravi Kumar",
    avatar_url: null,
    campus_location: "Campus 6",
    whatsapp_number: "919876543212",
    is_moderator: true,
    created_at: new Date().toISOString(),
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [domainError, setDomainError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (mounted) setIsLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === "SIGNED_OUT") {
          setProfile(null);
          setIsLoading(false);
        } else if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Profile not found for user, possibly rejected by trigger');
        } else {
          console.error("Error fetching profile:", error);
        }
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setDomainError(null);

      const redirectUrl = makeRedirectUri({
        path: '/auth/callback'
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });

      if (error) throw error;

      if (data?.url) {
        if (Platform.OS !== 'web') {
          const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

          if (res.type === 'success' && res.url) {
            const { params, errorCode } = QueryParams.getQueryParams(res.url);

            if (errorCode) {
              setDomainError(errorCode as string);
              return;
            }

            if (params.error_description?.includes('kiit.ac.in') || params.error_description?.includes('Access Denied')) {
              setDomainError('Access Denied: Please sign in with your official roll-number@kiit.ac.in email account.');
              return;
            }

            if (params.access_token && params.refresh_token) {
              await supabase.auth.setSession({
                access_token: params.access_token,
                refresh_token: params.refresh_token
              });
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      if (error.message?.includes('kiit.ac.in')) {
        setDomainError('Access Denied: Please sign in with your official roll-number@kiit.ac.in email account.');
      } else {
        setDomainError(error.message || 'An error occurred during sign in');
      }
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
  };

  const devSwitchUser = async (key: string) => {
    if (!__DEV__) return;

    setIsLoading(true);
    setDomainError(null);

    // Normalize and match key to profile
    const lowerKey = key.toLowerCase();
    let targetEmail: string | null = null;

    if (lowerKey.includes("1") || lowerKey.includes("arjun") || lowerKey.includes("2205001")) {
      targetEmail = "2205001@kiit.ac.in";
    } else if (lowerKey.includes("2") || lowerKey.includes("sneha") || lowerKey.includes("2205002")) {
      targetEmail = "2205002@kiit.ac.in";
    } else if (lowerKey.includes("3") || lowerKey.includes("ravi") || lowerKey.includes("2205003")) {
      targetEmail = "2205003@kiit.ac.in";
    }

    const mockProfile = targetEmail ? DEV_MOCK_PROFILES[targetEmail] : null;

    if (mockProfile) {
      // Set mock user and session directly
      const mockUser = {
        id: mockProfile.id,
        email: mockProfile.email,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;

      const mockSession = {
        access_token: "mock-token",
        refresh_token: "mock-refresh",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
        user: mockUser,
      } as Session;

      setUser(mockUser);
      setSession(mockSession);
      setProfile(mockProfile);
      setIsLoading(false);
      router.replace("/(tabs)/collab");
    } else {
      setDomainError("Unknown dev user. Use 2205001@kiit.ac.in, 2205002@kiit.ac.in, or 2205003@kiit.ac.in");
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;

    const { error } = await (supabase as any)
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) {
      console.error("Update profile error:", error);
      throw error;
    }

    setProfile((prev: Profile | null) => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isModerator: profile?.is_moderator ?? false,
        signInWithGoogle,
        signOut,
        devSwitchUser,
        updateProfile,
        domainError,
        clearDomainError: () => setDomainError(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};