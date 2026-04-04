import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FetchAppointment } from "@/types/Appointment";

interface AppointmentCardProps {
  appointment: FetchAppointment;
  onCancel: (id: string)=>void;
}

export const AppointmentCard = ({ appointment, onCancel }: AppointmentCardProps) => {
  const isUpcoming = appointment.status === "upcoming";

  return (
    <View className="bg-surface p-4 rounded-3xl border border-border mb-4">
      <View className="flex-row">
        <Image
          source={{ uri: appointment.providerImage }}
          className="w-16 h-16 rounded-2xl"
        />
        <View className="ml-4 flex-1">
          <Text className="text-main font-bold text-lg">
            {appointment.providerName || "provider"}
          </Text>
          <Text className="text-muted text-sm">
            {appointment.category}
          </Text>

          <View className="flex-row items-center mt-2">
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text className="text-muted text-xs ml-1">{appointment.date}</Text>
            <Ionicons
              name="time-outline"
              size={14}
              color="#6B7280"
              className="ml-3"
            />
            <Text className="text-muted text-xs ml-1">
              {appointment.timeSlot}
            </Text>
          </View>
        </View>

        <View
          className={`px-3 py-1 rounded-full h-8 ${
            appointment.status === "upcoming"
              ? "bg-blue-100"
              : appointment.status === "completed"
                ? "bg-green-100"
                : "bg-red-100"
          }`}
        >
          <Text
            className={`text-[10px] font-bold uppercase ${
              appointment.status === "upcoming"
                ? "text-blue-600"
                : appointment.status === "completed"
                  ? "text-green-600"
                  : "text-red-600"
            }`}
          >
            {appointment.status}
          </Text>
        </View>
      </View>

      {isUpcoming && (
        <TouchableOpacity
          onPress={() => onCancel(appointment.id)}
          className="mt-4 border border-red-200 py-3 rounded-2xl items-center"
        >
          <Text className="text-red-500 font-bold">Cancel Appointment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
