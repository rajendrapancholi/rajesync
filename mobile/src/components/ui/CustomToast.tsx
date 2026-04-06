import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/theme";

interface ToastProps {
  text1?: string;
  text2?: string;
  type: "success" | "danger" | "warning" | "info";
  loading?: boolean;
}

export const CustomToast = ({
  text1,
  text2,
  type,
  loading = false,
}: ToastProps) => {
  const { colors, alertConfig } = useThemeColors();
  const config = alertConfig[type];

  return (
    <View
      style={{
        backgroundColor: colors["primary-foreground"],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderLeftColor: config.color,
      }}
      className="w-[92%] flex-row items-center p-4 rounded-2xl border-l-4"
    >
      <View className={`p-2 rounded-full mr-3 ${config.bgColor}`}>
        {loading ? (
          <ActivityIndicator size="small" color={config.color} />
        ) : (
          <Ionicons name={config.icon} size={20} color={config.color} />
        )}
      </View>

      <View className="flex-1">
        <Text className="text-main font-bold text-base leading-tight">
          {text1}
        </Text>
        {text2 && <Text className="text-muted text-sm mt-0.5">{text2}</Text>}
      </View>
    </View>
  );
};

/* use 

// Show a loading toast
Toast.show({
  type: 'info',
  text1: 'Connecting...',
  text2: 'Please wait a moment',
  autoHide: false,
  props: { loading: true } 
});

// Show success (removes loader automatically)
Toast.show({
  type: 'success',
  text1: 'Connected!',
  props: { loading: false }
});
*/