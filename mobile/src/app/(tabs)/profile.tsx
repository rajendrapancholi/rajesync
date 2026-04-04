import React, { useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useLogout } from "@/hooks/useAuthMutations";
import { IUser } from "@/types/User";

export default function Profile() {
  const { user, onLogoutSuccess } = useAuth();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as "info" | "danger" | "success",
  });

  // Integration with TanStack Query Hook
  const logoutMutation = useLogout(() => {
    onLogoutSuccess();
    setAlert({
      visible: true,
      title: "Logout Failed",
      message: "Lougout success!",
      type: "success",
    });
    router.replace("/(auth)");
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

    // Trigger the TanStack Query mutation
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

  const signInUrl = "/sign-in" as Href;

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <CustomAlert
        visible={showLogoutAlert}
        title="Logout"
        message="Are you sure you want to sign out of your account?"
        type="danger"
        onCnfmTitle="Logout"
        onConfirm={handleLogout}
        onClose={() => setShowLogoutAlert(false)}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center mt-10">
          <View className="relative">
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "User",
                )}&background=38bdf8&color=fff&size=128`,
              }}
              className="w-32 h-32 rounded-full border-4 border-primary/20"
            />
            <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-4 border-background">
              <Ionicons name="camera" size={18} color="white" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-main mt-4">
            {user?.name}
          </Text>
          <Text className="text-muted">{user?.email}</Text>
        </View>

        {/* Menu Options */}
        <View className="mt-10 gap-4">
          <CustomButton
            title="Edit Profile"
            variant="outline"
            icon="person-outline"
            onPress={() => {}}
          />
          <CustomButton
            title="Notification Settings"
            variant="outline"
            icon="notifications-outline"
            onPress={() => {}}
          />
          <CustomButton
            title="Help & Support"
            variant="outline"
            icon="help-circle-outline"
            onPress={() => {}}
          />

          <View className="h-[1px] bg-border my-4" />

          <CustomButton
            title="Sign Out"
            variant="primary"
            className="bg-danger" // Custom style for logout
            icon="log-out-outline"
            onPress={() => setShowLogoutAlert(true)}
          />
        </View>

        <Text className="text-center text-muted mt-10 mb-10 text-xs">
          Rajendra Pancholi v1.0.4 • Made with ❤️
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
