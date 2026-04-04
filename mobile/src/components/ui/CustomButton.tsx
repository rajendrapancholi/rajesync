import { useThemeColors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
  icon?: any;
}

export const CustomButton = ({ title, variant = 'primary', loading, icon, className, ...props }: CustomButtonProps) => {
  const { colors } = useThemeColors();

  const variants = {
    primary: {
      container: "bg-primary border-transparent",
      text: "text-white",
      icon: "#FFFFFF"
    },
    outline: {
      container: "bg-transparent border-2",
      text: "text-main",
      icon: colors.primary,
      style: { borderColor: colors.primary }
    },
    ghost: {
      container: "bg-transparent",
      text: "text-primary",
      icon: colors.primary
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading}
      style={[variant === 'outline' ? variants.outline.style : null]}
      className={`h-16 rounded-2xl flex-row items-center justify-center px-6 ${variants[variant].container} ${loading ? 'opacity-70' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : colors.primary} />
      ) : (
        <View className="flex-row items-center">
          {icon && <Ionicons name={icon} size={20} color={variants[variant].icon} style={{ marginRight: 10 }} />}
          <Text className={`text-lg font-bold ${variants[variant].text}`}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
