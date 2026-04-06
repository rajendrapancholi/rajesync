import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { SplashScreen, Stack } from "expo-router";
import "../globals.css";
import api from "@/api/axiosInstance";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { CustomButton } from "@/components/ui/CustomButton";
import { useColorScheme } from "nativewind";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

export default function RootLayout() {
  const [isNetworkError, setIsNetworkError] = useState(false);
  const { colorScheme } = useColorScheme();

  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.message === "Network Error") setIsNetworkError(true);
        return Promise.reject(error);
      },
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  if (isNetworkError) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-10">
        <Ionicons name="cloud-offline-outline" size={80} color="#64748b" />
        <Text className="text-main text-2xl font-bold mt-4 text-center">
          Server Unreachable
        </Text>
        <Text className="text-muted text-center mt-2 mb-8">
          Please check your internet or verify the API IP address in your .env
          file.
        </Text>
        <CustomButton
          title="Retry Connection"
          onPress={() => setIsNetworkError(false)}
        />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <View className={`flex-1 ${colorScheme === "dark" ? "dark" : ""}`}>
            <RootLayoutNav />
          </View>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const { userToken, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      {userToken ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
