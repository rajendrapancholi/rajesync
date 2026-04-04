import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/theme";
import { useUserAppointments } from "@/hooks/useAppointments";
// import { useBookingMutations } from "@/hooks/useBookingMutations"; // Import your mutation hook

const { width } = Dimensions.get("window");

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams();
  const safeId = Array.isArray(id) ? id[0] : id;
  const { colors } = useThemeColors();
  const router = useRouter();

  const { data: appointments } = useUserAppointments();
  // const { cancelBooking } = useBookingMutations(); // Destructure your cancel function

  const appointment = appointments?.find((a) => a.id === safeId);

  if (!appointment) return null;

  const statusColor =
    appointment.status === "upcoming" ? colors.success : colors.danger;

  const handleCancel = () => {
    console.log('Debug name: ');
  };

  return (
    <SafeAreaView className="flex-1 bg-background animate-theme">
      {/* Header */}
      <View className="px-6 flex-row items-center justify-between py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-surface w-12 h-12 rounded-2xl flex-center border border-border/40"
        >
          <Ionicons name="chevron-back" size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-main">Appointment Detail</Text>
        <TouchableOpacity className="bg-surface w-12 h-12 rounded-2xl flex-center border border-border/40">
          <Ionicons name="share-outline" size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
        {/* Provider Profile Card */}
        <View className="bg-card rounded-[32px] p-6 border border-border/50 items-center mt-4">
          <View className="relative">
            <View className="w-24 h-24 rounded-full bg-primary/10 flex-center border-4 border-background">
              <Ionicons name="person" size={48} color={colors.primary} />
            </View>
            
            <View 
              style={{ backgroundColor: statusColor }}
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white" 
            />
          </View>

          <Text className="text-main text-2xl font-bold mt-4">
            {appointment.providerName}
          </Text>
          <Text className="text-muted font-medium italic">
            {appointment.category}
          </Text>

          <View className="flex-row mt-6 space-x-3">
            <TouchableOpacity className="bg-primary/10 px-6 py-3 rounded-2xl flex-row items-center">
              <Ionicons
                name="chatbubble-ellipses"
                size={18}
                color={colors.primary}
              />
              <Text className="text-primary font-bold ml-2">Message</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-surface px-6 py-3 rounded-2xl flex-row items-center border border-border">
              <Ionicons name="call" size={18} color={colors.surface} />
              <Text className="text-main font-bold ml-2">Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Schedule Info Section */}
        <View className="mt-8">
          <Text className="text-main font-bold text-lg mb-4 ml-1">
            Schedule Info
          </Text>
          <View className="bg-surface/50 rounded-[32px] p-2 border border-border/40">
            <ScheduleCard
              icon="calendar-outline"
              title="Date"
              value={appointment.date}
              bgColor="bg-info/10"
              iconColor={colors.info}
            />
            <View className="h-[1px] bg-border/50 mx-6" />
            <ScheduleCard
              icon="time-outline"
              title="Time Slot"
              value={appointment.timeSlot}
              bgColor="bg-warning/10"
              iconColor={colors.warning}
            />
            <View className="h-[1px] bg-border/50 mx-6" />
            <ScheduleCard
              icon="shield-checkmark-outline"
              title="Booking Status"
              value={appointment.status}
              bgColor="bg-success/10"
              iconColor={statusColor} 
              isStatus
            />
          </View>
        </View>

        <View className="mt-8 mb-10 px-4 py-6 bg-card border border-dashed border-border rounded-3xl flex-row justify-between items-center">
          <View>
            <Text className="text-muted text-xs uppercase font-bold tracking-tighter">
              Appointment ID
            </Text>
            <Text className="text-main font-mono font-bold text-base mt-1">
              #{safeId.slice(-8).toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity 
            className="bg-primary px-4 py-2 rounded-xl"
            onPress={() => {/* Add Clipboard logic here */}}
          >
            <Text className="text-white font-bold text-xs">Copy ID</Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View className="flex-row space-x-4 mb-10">
          <TouchableOpacity 
            // onPress={handleCancel}
            className="flex-1 h-16 rounded-3xl flex-center border border-danger/30 bg-danger/5"
          >
            <Text className="text-danger font-bold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push(`/details/${appointment.providerId}`)}
            className="flex-[2] h-16 rounded-3xl flex-center bg-primary shadow-lg shadow-primary/30"
          >
            <Text className="text-white font-bold text-base">Reschedule</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ScheduleCard = ({
  icon,
  title,
  value,
  bgColor,
  iconColor,
  isStatus,
}: any) => (
  <View className="flex-row items-center p-4">
    <View className={`${bgColor} w-14 h-14 rounded-2xl flex-center`}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-muted text-xs font-bold uppercase tracking-wider">
        {title}
      </Text>
      <Text
        className={`text-lg font-bold ${isStatus ? "capitalize" : "text-main"}`}
        style={isStatus ? { color: iconColor } : null}
      >
        {value}
      </Text>
    </View>
  </View>
);
