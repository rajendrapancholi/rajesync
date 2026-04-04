import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";
import { useRegister } from "@/hooks/useAuthMutations";
import { useThemeColors } from "@/constants/theme";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUp() {
  const router = useRouter();
  const { colors } = useThemeColors();

  const [form, setForm] = useState({
    name: "",
    email: "",
    pass: "",
    confPass: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    pass: false,
    confPass: false,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as "info" | "danger" | "success",
  });

  // 1. Initialize Register Mutation
  const registerMutation = useRegister(() => {
    setAlertConfig({
      visible: true,
      title: "Welcome!",
      message: "Your account has been created successfully.",
      type: "success",
    });
  });

  const handleSignUp = () => {
    const newErrors = {
      name: !form.name.trim(),
      email: !form.email.trim(),
      pass: !form.pass.trim(),
      confPass: !form.confPass.trim() || form.pass !== form.confPass,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      const isMismatch =
        form.pass !== form.confPass && form.confPass.trim() !== "";
      setAlertConfig({
        visible: true,
        title: isMismatch ? "Password Mismatch" : "Missing Info",
        message: isMismatch
          ? "Passwords do not match. Please check again."
          : "Please fill in all highlighted fields.",
        type: "danger",
      });
      return;
    }

    // Trigger Mutation
    registerMutation.mutate(
      {
        name: form.name,
        email: form.email,
        pass: form.pass,
        confPass: form.confPass,
      },
      {
        onError: (error: any) => {
          setAlertConfig({
            visible: true,
            title: "Sign Up Failed",
            message: error.response?.data?.message || "Email already in use.",
            type: "danger",
          });
        },
      },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="px-6 pb-10">
            <CustomAlert
              visible={alertConfig.visible}
              title={alertConfig.title}
              message={alertConfig.message}
              type={alertConfig.type}
              onCnfmTitle="Login Now"
              onClsTitle="Dismiss"
              showConfirm={alertConfig.type === "success"}
              onClose={() => setAlertConfig((p) => ({ ...p, visible: false }))}
              onConfirm={() => {
                setAlertConfig((p) => ({ ...p, visible: false }));
                if (alertConfig.type === "success")
                  router.replace("sign-in" as Href);
              }}
            />

            <View className="mt-10 mb-10">
              <Text className="text-3xl font-bold text-main text-center">
                Create Account
              </Text>
            </View>

            {/* name */}
            <TextInput
              className={`bg-surface border ${errors.name ? "border-danger" : "border-border"} p-4 rounded-2xl text-lg mb-4 text-main`}
              placeholder="Full Name"
              placeholderTextColor={colors.muted}
              value={form.name}
              onChangeText={(t) => {
                setForm({ ...form, name: t });
                setErrors({ ...errors, name: false });
              }}
            />

            {/* email */}
            <TextInput
              className={`bg-surface border ${errors.email ? "border-danger" : "border-border"} p-4 rounded-2xl text-lg mb-4 text-main`}
              placeholder="Email"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(t) => {
                setForm({ ...form, email: t });
                setErrors({ ...errors, email: false });
              }}
            />

            {/* password */}
            <View className="relative mb-6">
              <TextInput
                className={`bg-surface border ${errors.pass ? "border-danger" : "border-border"} p-4 rounded-2xl text-lg text-main pr-12`}
                placeholder="Password"
                placeholderTextColor={colors.muted}
                secureTextEntry={!isPasswordVisible}
                value={form.pass}
                onChangeText={(t) => {
                  setForm({ ...form, pass: t });
                  setErrors({ ...errors, pass: false });
                }}
                autoCorrect={false}
                spellCheck={false}
                textContentType="password"
                autoCapitalize="none"
                style={{
                  fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                }}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-4 top-1/2 -mt-3"
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color={colors.muted}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View className="relative mb-6">
              <TextInput
                className={`bg-surface border ${errors.confPass ? "border-danger" : "border-border"} p-4 rounded-2xl text-lg text-main pr-12`}
                placeholder="Confirm Password" 
                placeholderTextColor={colors.muted}
                secureTextEntry={!isPasswordVisible}
                value={form.confPass}
                onChangeText={(t) => {
                  setForm({ ...form, confPass: t });
                  setErrors({ ...errors, confPass: false });
                }}
                autoCorrect={false}
                spellCheck={false}
                textContentType="password"
                autoCapitalize="none"
                style={{
                  fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                }}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-4 top-1/2 -mt-3"
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color={colors.muted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-primary py-4 rounded-2xl items-center"
              onPress={handleSignUp}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-xl font-bold">Sign Up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-6"
              onPress={() => router.push("sign-in" as Href)}
            >
              <Text className="text-center text-main">
                Already have an account?{" "}
                <Text className="text-primary font-bold">Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
