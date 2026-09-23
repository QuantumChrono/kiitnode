import { View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Index() {
  const [supabaseOk, setSupabaseOk] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(() => setSupabaseOk(true))
      .catch(() => setSupabaseOk(false));
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-campus-dark-bg px-6">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-2xl bg-campus-primary">
        <Text className="text-3xl font-bold text-white">KN</Text>
      </View>

      <Text className="mb-2 text-3xl font-bold text-white">KIIT Node</Text>
      <Text className="mb-8 text-center text-base text-slate-400">
        Your campus, connected.
      </Text>

      <View className="mb-6 rounded-lg bg-campus-dark-surface px-4 py-3">
        <Text className="text-sm text-slate-300">
          Supabase:{" "}
          <Text
            className={
              supabaseOk === null
                ? "text-slate-500"
                : supabaseOk
                  ? "text-campus-primary-light"
                  : "text-red-400"
            }
          >
            {supabaseOk === null
              ? "checking…"
              : supabaseOk
                ? "connected ✓"
                : "check .env"}
          </Text>
        </Text>
      </View>

      <Pressable className="rounded-xl bg-campus-primary px-8 py-3 active:opacity-80">
        <Text className="text-base font-semibold text-white">
          Get Started →
        </Text>
      </Pressable>
    </View>
  );
}
