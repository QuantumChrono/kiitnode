import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/database";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";
import * as QueryParams from 'expo-auth-session/build/QueryParams';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isModerator: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  devSwitchUser: (userId: string) => Promise<void>;
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

const SEED_PROFILES: Record<string, string> = {
  arjun: "2205001@kiit.ac.in",
  sneha: "2205002@kiit.ac.in",
  ravi: "2205003@kiit.ac.in",
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
        // If the error is not found, maybe it's because of the KIIT gate on the trigger
        if (error.code === 'PGRST116') {
          // No profile found could mean trigger failed due to wrong email domain
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
            // Optional: prompt user to select account if needed
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

            // We need to parse error_description in case of domain rejection
            if (params.error_description?.includes('kiit.ac.in') || params.error_description?.includes('Access Denied')) {
              setDomainError('Access Denied: Please sign in with your official roll-number@kiit.ac.in email account.');
              return;
            }

            // The session will automatically be saved by the supabase deep link listener if configured properly,
            // but we might need to manually set it for Expo Go.
            // If we have an access_token, we can set it.
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
      // Small timeout to allow auth state to settle before stopping loading
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
  };

  const devSwitchUser = async (userId: string) => {
    if (!__DEV__) return;

    setIsLoading(true);
    setDomainError(null);
    const email = SEED_PROFILES[userId as keyof typeof SEED_PROFILES];

    if (email) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: "kiitpass123",
      });
      if (error) {
        console.error("Mock Login Error:", error.message);
        setDomainError(error.message);
        setIsLoading(false);
      }
      // On success, the onAuthStateChange listener will handle fetching profile
    } else {
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
