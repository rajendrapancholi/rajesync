import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface ThemeColors {
  primary: string;
  muted: string;
  danger: string;
}

interface HelperProps {
  label: string;
  value?: string;
  icon: IoniconsName;
  theme: ThemeColors;
  onPress?: () => void;
  isDanger?: boolean;
}

export const StatBox = ({ label, value, icon, theme }: HelperProps) => {
  const getIconColor = () => {
    switch (label?.toLowerCase()) {
      case "upcoming":
        return theme.primary;
      case "completed":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      default:
        return theme.muted;
    }
  };

  return (
    <View className="bg-surface border border-border w-[31%] py-5 px-2 rounded-[30px] items-center shadow-sm">
      <Ionicons name={icon} size={22} color={getIconColor()} />
      <Text className="text-main text-xl font-bold mt-2">{value}</Text>
      <Text className="text-muted text-[9px] uppercase font-bold tracking-tighter">
        {label}
      </Text>
    </View>
  );
};

export const MenuLink = ({
  icon,
  label,
  value,
  theme,
  onPress,
}: HelperProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.5}
    className="flex-row items-center justify-between p-5"
  >
    <View className="flex-row items-center">
      <View className="bg-background p-2.5 rounded-2xl border border-border">
        <Ionicons name={icon} size={20} color={theme.primary} />
      </View>
      <Text className="text-main font-semibold ml-4 text-[15px]">{label}</Text>
    </View>
    <View className="flex-row items-center">
      {value && <Text className="text-muted mr-3 text-sm">{value}</Text>}
      <Ionicons name="chevron-forward" size={18} color={theme.muted} />
    </View>
  </TouchableOpacity>
);
