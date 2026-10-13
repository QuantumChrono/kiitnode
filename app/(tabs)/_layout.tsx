import { Tabs } from "expo-router";
import { Users, ShoppingBag, MessageSquare, Compass, User } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { AppleFloatingTabBar } from "@/components/ui/AppleFloatingTabBar";

export default function TabsLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      tabBar={(props) => <AppleFloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tertiaryLabel,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600", // semibold
          marginTop: 2,
        },
        tabBarItemStyle: {
          flex: 1,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 0,
          paddingHorizontal: 0,
        },
      }}
    >
      <Tabs.Screen
        name="collab"
        options={{
          title: "Teammates",
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: "Forum",
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: "Directory",
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}