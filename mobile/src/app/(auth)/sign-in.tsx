import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@/hooks/useAuthMutations";
import { useThemeColors } from "@/constants/theme";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import { IUser } from "@/types/User";

export default function SignIn() {
  const router = useRouter();
  const { onLoginSuccess } = useAuth();
  const { colors } = useThemeColors();

  const [form, setForm] = useState({ email: "", pass: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as "info" | "danger" | "success",
  });

  // Integration with TanStack Query Hook
  const loginMutation = useLogin((data: { token: string, user: IUser }) => {
    onLoginSuccess({ token: data.token, user: data.user });
    router.replace("/(tabs)"); 
  });

  const handleLogin = async () => {
    if (!form.email || !form.pass) {
      setAlert({
        visible: true,
        title: "Error",
        message: "Please enter your credentials",
        type: "danger",
      });
      return;
    }

    // Trigger the TanStack Query mutation
    loginMutation.mutate(
      { email: form.email, pass: form.pass },
      {
        onError: (error: any) => {
          setAlert({
            visible: true,
            title: "Login Failed",
            message:
              error.response?.data?.message || "Invalid email or password",
            type: "danger",
          });
        },
      },
    );
  };

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const signUpUrl = "/sign-up" as Href;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={50} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-6">
            <CustomAlert
              {...alert}
              onClose={() => setAlert((p) => ({ ...p, visible: false }))}
            />

            <Text className="text-3xl font-bold text-main text-center mb-8">
              Welcome Back
            </Text>

            <TextInput
              className="bg-background/50 border border-border p-4 rounded-2xl mb-4 text-main"
              placeholder="Enter your email"
              placeholderTextColor={colors.muted}
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View className="relative mb-6">
              <TextInput
                className="bg-background/50 border border-border p-4 rounded-2xl text-main pr-12"
                placeholder="Password"
                placeholderTextColor={colors.muted}
                secureTextEntry={!isPasswordVisible}
                value={form.pass}
                onChangeText={(t) => setForm({ ...form, pass: t })}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -mt-2.5"
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={colors.muted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-primary py-4 rounded-2xl"
              onPress={handleLogin}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  Login
                </Text>
              )}
            </TouchableOpacity>

            <View className="mt-6 flex-row justify-center pb-10">
              <Text className="text-muted">New here? </Text>
              <TouchableOpacity onPress={() => router.push(signUpUrl)}>
                <Text className="text-primary font-bold">Create account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
