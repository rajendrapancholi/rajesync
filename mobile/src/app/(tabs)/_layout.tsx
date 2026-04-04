import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/theme";
import { useUserAppointments } from "@/hooks/useAppointments";

export default function TabLayout() {
  const { colors } = useThemeColors();

  const { data: upcomingCount } = useUserAppointments<number>({
    select: (appointments) =>
      appointments?.filter((a) => a.status === "upcoming").length || 0,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          height: 75,
          paddingBottom: 15,
          paddingTop: 10,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="providers"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Ionicons name="briefcase" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
          title: "Bookings",
          tabBarBadge: (upcomingCount ?? 0) > 0 ? upcomingCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#EF4444",
            color: "white",
            fontSize: 10,
            lineHeight: 15,
            height: 16,
            minWidth: 16,
            borderRadius: 8,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size || 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="details/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="appointment/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
