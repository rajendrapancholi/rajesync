import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DateScrollerProps {
  days: { fullDate: string; dayName: string; dayNumber: number }[];
  selectedDate: string;
  onSelect: (date: string) => void;
  onMore: () => void;
  colors: any;
}

export const DateScroller = ({
  days,
  selectedDate,
  onSelect,
  onMore,
  colors,
}: DateScrollerProps) => (
  <View>
    <Text className="text-main text-xl font-bold mt-8 mb-4">Select Date</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row mb-6"
    >
      {days.map((item) => (
        <TouchableOpacity
          key={item.fullDate}
          onPress={() => onSelect(item.fullDate)}
          className={`items-center justify-center mr-4 w-16 h-20 rounded-2xl border ${
            selectedDate === item.fullDate
              ? "bg-primary border-primary"
              : "bg-surface border-border"
          }`}
        >
          <Text
            className={`text-xs ${selectedDate === item.fullDate ? "text-white/80" : "text-muted"}`}
          >
            {item.dayName}
          </Text>
          <Text
            className={`text-lg font-bold ${selectedDate === item.fullDate ? "text-white" : "text-main"}`}
          >
            {item.dayNumber}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={onMore}
        className="items-center justify-center w-16 h-20 rounded-2xl border border-dashed border-primary bg-surface"
      >
        <Ionicons name="calendar" size={24} color={colors.primary} />
        <Text className="text-[10px] text-primary font-bold">More</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);
