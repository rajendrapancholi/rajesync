import { useThemeColors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'success' | 'warning' | 'info';
  onClsTitle?: string;
  onCnfmTitle?: string;
  showConfirm?: boolean;
}

export const CustomAlert = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  onClsTitle = 'Close',
  onCnfmTitle = 'Confirm',
  showConfirm = true
}: CustomAlertProps) => {
  const { colors, alertConfig } = useThemeColors();
  const config = alertConfig[type];

  const getButtonBg = () => {
    switch (type) {
      case 'danger': return 'bg-danger';
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      default: return 'bg-primary';
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/60 px-6" >
        <View className="bg-surface border border-border w-full rounded-[32px] p-6 items-center shadow-2xl relative">

          {/* TOP RIGHT CLOSE ICON */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute right-5 top-5 z-10 p-1"
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={colors.muted} />
          </TouchableOpacity>

          {/* Dynamic Icon Header */}
          <View className={`p-4 rounded-full mb-4 mt-2 ${config.bgColor}`}>
            <Ionicons name={config.icon as any} size={40} color={config.color} />
          </View>

          <Text className="text-main text-xl font-bold text-center px-4">{title}</Text>
          <Text className="text-muted text-sm text-center mt-2 leading-5">
            {message}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-8 w-full">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className={`flex-1 border border-border p-4 rounded-2xl bg-background ${!showConfirm ? 'w-full' : ''}`}
            >
              <Text className="text-main font-bold text-center">{onClsTitle}</Text>
            </TouchableOpacity>

            {showConfirm && (
              <TouchableOpacity
                onPress={onConfirm || onClose} 
                activeOpacity={0.8}
                className={`flex-1 p-4 rounded-2xl ${getButtonBg()}`}
              >
                <Text className="text-main font-bold text-center">{onCnfmTitle}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
