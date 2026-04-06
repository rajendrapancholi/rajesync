import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/theme";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { CustomButton } from "@/components/ui/CustomButton";
import {
  useBookAppointment,
  useRescheduleAppointment,
} from "@/hooks/useBookingMutations";
import { useGetAvailableSlots, useGetProviderById } from "@/hooks/useProviders";
import { ProviderDetailSkeleton } from "@/components/skeletons/ProviderDetailSkeleton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getNextDays } from "@/utils/helper";
import { EmptySlots } from "@/components/ui/EmptySlot";
import { DateScroller } from "@/components/ui/DateScroller";
import { SlotButton } from "@/components/ui/SlotButton";
import { useUserAppointments } from "@/hooks/useAppointments";

export default function ProviderDetails() {
  const { id, reschedule, appointmentId } = useLocalSearchParams<{
    id: string;
    reschedule?: string;
    appointmentId?: string;
  }>();

  const providerId = Array.isArray(id) ? id[0] : id; // Ensure string
  const appointmentIdToReschedule = Array.isArray(appointmentId)
    ? appointmentId[0]
    : appointmentId;

  const router = useRouter();
  const { colors } = useThemeColors();
  const days = getNextDays(4);

  const [selectedDate, setSelectedDate] = useState(days[0].fullDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    type: "success" | "warning" | "info" | "danger";
  }>({ title: "", message: "", type: "info" });

  const { data: provider, isLoading } = useGetProviderById(providerId);
  const { data: availableSlots, isLoading: isSlotsLoading } =
    useGetAvailableSlots(providerId, selectedDate);
  const { data: userAppointments } = useUserAppointments();
  const appointmentToReschedule = userAppointments?.find(
    (a) => a.id === appointmentIdToReschedule,
  );

  useEffect(() => {
    if (reschedule === "true" && appointmentToReschedule) {
      setSelectedDate(appointmentToReschedule.date);
      setSelectedSlot(appointmentToReschedule.timeSlot);
    }
  }, [reschedule, appointmentToReschedule]);

  const minCalendarDate = new Date();
  minCalendarDate.setDate(minCalendarDate.getDate() + 4);

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      setSelectedDate(formattedDate);
      setSelectedSlot(null);
    }
  };

  const bookingMutation = useBookAppointment(
    () => {
      // On Success
      router.replace("/(tabs)/appointments");
    },
    (errorMsg) => {
      // On Error
      setAlertConfig({
        title: "Booking Failed",
        message: errorMsg,
        type: "danger",
      });
      setAlertVisible(true);
    },
  );

  const rescheduleMutation = useRescheduleAppointment(
    () => router.replace("/(tabs)/appointments"),
    (errorMsg) => {
      setAlertConfig({
        title: "Rescheduling Failed",
        message: errorMsg,
        type: "danger",
      });
      setAlertVisible(true);
    },
  );

  if (isLoading) {
    return <ProviderDetailSkeleton />;
  }

  if (!provider) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background px-6">
        <Ionicons name="alert-circle-outline" size={64} color={colors.muted} />

        <Text className="text-xl font-bold text-main mt-4 text-center">
          Provider not found
        </Text>
        <Text className="text-muted mt-2 mb-8 text-center">
          The provider you're looking for might have been removed or the ID is
          incorrect.
        </Text>
        <CustomButton
          title="Go Back"
          variant="outline"
          icon="arrow-back"
          className="w-full"
          onPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const handleBook = () => {
    if (!selectedSlot) {
      setAlertConfig({
        title: "Selection Required",
        message: "Please select a time slot.",
        type: "warning",
      });
      setAlertVisible(true);
      return;
    }

    setAlertConfig({
      title: reschedule === "true" ? "Confirm Reschedule" : "Confirm Booking",
      message:
        reschedule === "true"
          ? `Do you want to reschedule with ${provider.name} at ${selectedSlot}?`
          : `Do you want to book ${provider.name} at ${selectedSlot}?`,
      type: "info",
    });
    setAlertVisible(true);
  };

  const onConfirmAction = () => {
    setAlertVisible(false);
    if (selectedSlot && provider) {
      if (reschedule === "true" && appointmentToReschedule) {
        rescheduleMutation.mutate({
          appointmentId: appointmentToReschedule.id,
          providerId: providerId,
          date: selectedDate,
          time: selectedSlot,
        });
      } else {
        bookingMutation.mutate({
          providerId: providerId,
          date: selectedDate,
          time: selectedSlot,
        });
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image & Back Button */}
        <View className="relative h-80">
          <Image
            source={{ uri: provider.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ backgroundColor: colors.surface }}
            className="absolute top-6 left-6 p-3 rounded-2xl border border-border"
          >
            <Ionicons name="arrow-back" size={24} color={colors.textMain} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="bg-background -mt-10 rounded-t-[40px] px-6 pt-8 pb-10">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-bold text-main">
                {provider.name}
              </Text>
              <Text className="text-primary text-lg font-medium">
                {provider.category}
              </Text>
            </View>
            <View className="bg-surface border border-border p-3 rounded-2xl flex-row items-center">
              <Ionicons name="star" size={18} color="#FBBF24" />
              <Text className="text-main font-bold ml-1 text-lg">
                {provider.rating}
              </Text>
            </View>
          </View>
          <Text className="text-muted mt-4 text-base leading-6">
            {provider.bio ||
              `Expert ${provider.category.toLowerCase()} with over 5 years of experience. Providing top-quality service with a guarantee of satisfaction. Available for immediate bookings.`}
          </Text>

          <Text className="text-main text-xl font-bold mt-8 mb-4">
            Select Date
          </Text>
          <DateScroller
            days={days}
            selectedDate={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedSlot(null);
            }}
            onMore={() => setShowDatePicker(true)}
            colors={colors}
          />

          {showDatePicker && (
            <DateTimePicker
              value={
                new Date(selectedDate) < minCalendarDate
                  ? minCalendarDate
                  : new Date(selectedDate)
              }
              mode="date"
              display="default"
              minimumDate={minCalendarDate}
              onChange={onDateChange}
            />
          )}

          {/* Slot Selection */}
          <Text className="text-main text-xl font-bold mt-8 mb-4">
            Available Slots
          </Text>
          {isSlotsLoading ? (
            <View className="flex-1 justify-center items-center bg-background">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : availableSlots?.length > 0 ? (
            <View className="flex-row flex-wrap justify-between">
              {availableSlots.map((slot: string) => (
                <SlotButton
                  key={slot}
                  slot={slot}
                  isSelected={selectedSlot === slot}
                  onSelect={setSelectedSlot}
                />
              ))}
            </View>
          ) : (
            <EmptySlots />
          )}
        </View>
      </ScrollView>

      {/* Booking Button Section */}
      <View className="p-6 bg-surface border-t border-border flex-row items-center">
        <View className="flex-1">
          <Text className="text-muted text-sm">Service Price</Text>
          <Text className="text-main text-2xl font-bold">
            ₹{provider?.price}/hr
          </Text>
        </View>
        <View className="flex-1 ml-4">
          <CustomButton
            title={
              bookingMutation.isPending
                ? "Processing..."
                : reschedule === "true"
                  ? "Reschedule Now"
                  : "Book Now"
            }
            onPress={handleBook}
            disabled={bookingMutation.isPending}
          />
        </View>
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertVisible(false)}
        onConfirm={onConfirmAction}
        onCnfmTitle={selectedSlot ? "Confirm" : "Got it"}
        showConfirm={!!selectedSlot}
      />
    </SafeAreaView>
  );
}
