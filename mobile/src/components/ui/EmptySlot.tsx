import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const EmptySlots = () => (
  <View className="bg-surface border border-dashed border-border p-8 rounded-3xl items-center justify-center mt-2">
    <View className="bg-primary/10 p-4 rounded-full mb-3">
      <Ionicons name="calendar-outline" size={32} color="#4F46E5" />
    </View>
    <Text className="text-main font-bold text-lg">Fully Booked</Text>
    <Text className="text-muted text-center mt-1">
      All slots are taken for this day.{"\n"}Please try another date.
    </Text>
  </View>
);
