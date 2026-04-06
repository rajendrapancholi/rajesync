import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useLogout } from "@/hooks/useAuthMutations";
import { useColorScheme } from "nativewind";
import { useThemeColors } from "@/constants/theme";
import { MenuLink, StatBox } from "@/components/ui/HelperDash"; 
import { useUserAppointments } from "@/hooks/useAppointments";

const Divider = () => <View className="h-[1px] bg-border/40 mx-5" />;

export default function Profile() {
  const { user, onLogoutSuccess } = useAuth();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const { toggleColorScheme } = useColorScheme();
  const { colors, isDark } = useThemeColors();

  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as "info" | "danger" | "success",
  });

  const { data: counts } = useUserAppointments({
    select: (appointments) => ({
      upcoming:
        appointments?.filter((a) => a.status === "upcoming").length || 0,
      completed:
        appointments?.filter((a) => a.status === "completed").length || 0,
      cancelled:
        appointments?.filter((a) => a.status === "cancelled").length || 0,
    }),
  });

  const logoutMutation = useLogout(() => {
    onLogoutSuccess();
    setAlert({
      visible: true,
      title: "Logout Failed",
      message: "Logout success!",
      type: "success",
    });
    const signInUrl = "/sign-in" as Href;
    router.replace(signInUrl);
  });

  const handleLogout = async () => {
    if (!user) {
      setAlert({
        visible: true,
        title: "Error",
        message: "Please enter your credentials",
        type: "danger",
      });
      return;
    }
    logoutMutation.mutate(undefined, {
      onError: (error: any) => {
        setAlert({
          visible: true,
          title: "Logout Failed",
          message: error.response?.data?.message || "Failed to logout!",
          type: "danger",
        });
      },
    });
  };
  const openSupport = () => {
    Linking.openURL("mailto:rpancholi522@gmail.com");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <CustomAlert
        visible={showLogoutAlert}
        title={alert.title}
        message="Are you sure you want to sign out of your account?"
        type="danger"
        onCnfmTitle="Logout"
        onConfirm={handleLogout}
        onClose={() => setShowLogoutAlert(false)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View className="items-center mt-8 px-6">
          <View className="relative shadow-xl">
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0ea5e9&color=fff&size=200`,
              }}
              className="w-28 h-28 rounded-full border-4 border-primary/10"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-4 border-background">
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-bold text-main mt-4">
            {user?.name}
          </Text>
          <Text className="text-muted text-sm">{user?.email}</Text>

          <View className="bg-primary/10 px-4 py-1 rounded-full mt-2 border border-primary/20">
            <Text className="text-primary text-[10px] font-bold uppercase tracking-widest">
              Active Client
            </Text>
          </View>
        </View>

        {/* APPOINTMENT STATS  */}
        <View className="flex-row justify-between px-6 mt-10">
          <StatBox
            label="Upcoming"
            value={counts?.upcoming?.toString()}
            icon="calendar-outline"
            theme={colors}
          />
          <StatBox
            label="Completed"
            value={counts?.completed.toString()}
            icon="checkmark-circle-outline"
            theme={colors}
          />
          <StatBox
            label="Cancelled"
            value={counts?.cancelled.toString()}
            icon="close-circle-outline"
            theme={colors}
          />

          {/* <StatBox
            label="Total Cost"
            value={ 0}`}
            icon="wallet-outline"
            theme={colors}
          /> */}
        </View>

        {/* SETTINGS GROUP */}

        {/* Account Settings Group */}
        <View className="px-6 mt-10">
          <Text className="text-muted text-xs font-bold uppercase tracking-widest mb-4 ml-2">
            General Settings
          </Text>
          <View className="bg-surface border border-border rounded-[32px] overflow-hidden">
            <MenuLink
              icon="person-outline"
              label="Personal Information"
              theme={colors}
            />
            <Divider />
            <MenuLink
              icon="notifications-outline"
              label="Notifications"
              theme={colors}
            />
            <Divider />
            <MenuLink
              icon="mail-outline"
              label="Contact Support"
              theme={colors}
              onPress={openSupport}
            />
          </View>
        </View>

        {/* Preferences Group */}
        <View className="px-6 mt-10">
          <Text className="text-muted text-xs font-bold uppercase tracking-widest mb-4 ml-2">
            Preferences
          </Text>

          <View className="bg-surface border border-border rounded-[32px] overflow-hidden">
            <MenuLink
              icon="language-outline"
              label="Language"
              value="English"
              theme={colors}
            />

            <Divider />

            {/* THEME TOGGLE */}
            <TouchableOpacity
              onPress={toggleColorScheme}
              activeOpacity={0.6}
              className="flex-row items-center justify-between p-5"
            >
              <View className="flex-row items-center">
                <View className="bg-background p-2.5 rounded-2xl border border-border">
                  <Ionicons
                    name={isDark ? "moon-outline" : "sunny-outline"}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text className="text-main font-semibold ml-4 text-[15px]">
                  App Theme
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-primary font-bold mr-3 text-sm capitalize">
                  {isDark ? "Switch to Light Mode" : "Swith to Dark Mode"}
                </Text>
                <Ionicons
                  name="repeat-outline"
                  size={18}
                  color={colors.muted}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Group */}
        <View className="px-6 mt-10">
          <Text className="text-muted text-xs font-bold uppercase tracking-widest mt-3 mb-4 ml-2">
            Support
          </Text>
          <View className="bg-surface border border-border/50 rounded-[32px] overflow-hidden shadow-sm">
            <MenuLink
              icon="help-circle-outline"
              label="Help Center"
              theme={colors}
              onPress={() => {}}
            />
            <Divider />
            <TouchableOpacity
              onPress={() => setShowLogoutAlert(true)}
              className="flex-row items-center p-5"
            >
              <View className="bg-danger/10 p-2 rounded-xl">
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              </View>
              <Text className="text-danger font-semibold ml-4">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-center text-muted/50 mt-12 mb-6 text-[10px] font-medium tracking-widest uppercase">
          Rajendra Pancholi v1.0.4 • Appointment Manager
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
