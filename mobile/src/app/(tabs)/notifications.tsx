import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColors } from "@/constants/theme";
import { useUserAppointments } from "@/hooks/useAppointments";
import { Skeleton } from "@/components/ui/Skeleton";
import { FetchAppointment } from "@/types/Appointment";

export default function Notifications() {
  const { colors } = useThemeColors();
  const router = useRouter();

  const { data: appointments = [], isLoading } = useUserAppointments();

  const notifications = appointments.filter(
    (a: FetchAppointment) => a.status === "upcoming",
  );

  const renderNotification = ({ item }: { item: FetchAppointment }) => (
    <TouchableOpacity
      className="bg-surface border border-border p-4 rounded-[24px] mb-4 flex-row items-center"
      onPress={() =>
        router.push(`/appointment/${item.id}`)
      }
    >
      {/* Icon/Avatar Section */}
      <View className="bg-primary/10 p-3 rounded-2xl">
        <Ionicons name="calendar-outline" size={24} color={colors.primary} />
      </View>

      <View className="flex-1 ml-4">
        <Text className="text-main font-bold text-base" numberOfLines={1}>
          Booking Confirmed!
        </Text>
        <Text className="text-muted text-sm mt-1" numberOfLines={2}>
          You have an appointment with {item.providerName} on {item.date} at{" "}
          {item.timeSlot}.
        </Text>
      </View>

      <View className="h-2 w-2 bg-primary rounded-full ml-2" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background px-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mt-4 mb-8">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-surface p-3 rounded-2xl border border-border"
        >
          <Ionicons name="arrow-back" size={24} color={colors.textMain} />
        </TouchableOpacity>
        <Text className="text-main text-xl font-bold">Notifications</Text>
        <View className="w-12" />
      </View>

      {isLoading ? (
        <View>
          <Skeleton width="100%" height={90} radius={24} className="mb-4" />
          <Skeleton width="100%" height={90} radius={24} className="mb-4" />
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center pb-20">
          <View className="bg-surface p-8 rounded-full mb-4">
            <Ionicons
              name="notifications-off-outline"
              size={60}
              color={colors.border}
            />
          </View>
          <Text className="text-main text-xl font-bold">All caught up!</Text>
          <Text className="text-muted text-center mt-2">
            No new notifications at the moment.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
