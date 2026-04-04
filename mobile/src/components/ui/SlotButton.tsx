import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface SlotButtonProps {
  slot: string;
  isSelected: boolean;
  onSelect: (slot: string) => void;
}

export const SlotButton = ({ slot, isSelected, onSelect }: SlotButtonProps) => (
  <TouchableOpacity
    onPress={() => onSelect(slot)}
    className={`w-[48%] p-4 mb-4 rounded-2xl border items-center ${
      isSelected ? "bg-primary border-primary" : "bg-surface border-border"
    }`}
  >
    <Text className={`font-bold ${isSelected ? "text-white" : "text-main"}`}>
      {slot}
    </Text>
  </TouchableOpacity>
);
