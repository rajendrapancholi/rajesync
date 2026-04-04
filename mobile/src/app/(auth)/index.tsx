import { CustomButton } from "@/components/ui/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";

import { useThemeColors } from "@/constants/theme";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const { colors } = useThemeColors();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-8">
        <View className="bg-primary/10 p-6 rounded-[40px] mb-6 border border-primary/20">
          <Ionicons name="sync" size={60} color={colors.primary} />
        </View>
        <Text className="text-main text-5xl font-black tracking-tighter mb-2">
          Rajendra
        </Text>
        <Text className="text-muted text-center text-lg leading-6 px-4">
          Synchronize your appoinment life effortlessly.
        </Text>
      </View>

      <SafeAreaView edges={["bottom"]} className="px-8 pb-8">
        {/* Link to sign-up.tsx */}
        <Link href="/sign-up" asChild>
          <CustomButton title="Continue with Email" icon="mail-outline" />
        </Link>

        <View className="items-center my-4">
          <Text className="text-main opacity-60 text-sm">
            Already have an account?
          </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text style={{ color: colors.primary }} className="font-bold">
                Login
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-[1px] bg-border opacity-50" />
          <Text className="mx-4 text-muted text-xs font-bold uppercase tracking-widest">
            or join with
          </Text>
          <View className="flex-1 h-[1px] bg-border opacity-50" />
        </View>

        <View className="flex-row justify-between">
          <Link href="/sign-up" asChild>
            <SocialButton icon="logo-google" label="Google" theme={colors} />
          </Link>
          <SocialButton icon="logo-apple" label="Apple" theme={colors} />
        </View>

        <Text className="text-muted text-center mt-8 text-[11px] px-6 leading-4">
          By continuing, you agree to our
          <Text className="text-primary font-bold"> Terms </Text>&
          <Text className="text-primary font-bold"> Privacy Policy</Text>
        </Text>
      </SafeAreaView>
    </View>
  );
}

const SocialButton = ({
  icon,
  label,
  theme,
  ...props
}: {
  icon: any;
  label: string;
  theme: any;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    className="flex-1 flex-row items-center justify-center bg-surface border border-border h-14 rounded-2xl mx-2"
    {...props}
  >
    <Ionicons name={icon} size={20} color={theme.textMain} />
    <Text className="text-main font-semibold ml-2">{label}</Text>
  </TouchableOpacity>
);
