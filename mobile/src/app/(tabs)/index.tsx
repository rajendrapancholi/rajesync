import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useThemeColors } from "@/constants/theme";
import { Href, Link, router } from "expo-router";
import { useCategories, useProviders } from "@/hooks/useProviders";
import { FetchProvider } from "@/types/Provider";
import { useUserAppointments } from "@/hooks/useAppointments";

export default function Dashboard() {
  const { user } = useAuth();
  const { colors } = useThemeColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: providers = [], isLoading, refetch } = useProviders();
  const { data: categories } = useCategories();

  const { data: upcomingCount } = useUserAppointments<number>({
    select: (appointments) =>
      appointments?.filter((a) => a.status === "upcoming").length || 0,
  });

  const filteredProviders = useMemo(() => {
    return providers.filter((p: FetchProvider) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, providers]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderProvider = ({ item }: { item: FetchProvider }) => (
    <TouchableOpacity
      className="bg-surface border border-border rounded-3xl p-4 mb-4 flex-row items-center"
      activeOpacity={0.8}
      onPress={() => router.push(`/details/${item.id}` as Href)}
    >
      <Image
        source={{ uri: item.image }}
        className="w-20 h-20 rounded-2xl bg-muted"
        onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
      />

      <View className="flex-1 ml-4">
        <Text className="text-main font-bold text-lg" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-primary font-medium text-sm mb-1">
          {item.category}
        </Text>

        <View className="flex-row items-center">
          <Ionicons name="star" size={14} color="#FBBF24" />
          <Text className="text-main font-bold ml-1">{item.rating}</Text>
          <Text className="text-muted ml-3">{item.price}</Text>
        </View>
      </View>

      <TouchableOpacity className="bg-primary/10 p-2 rounded-full">
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background px-5">
      {/* Header */}
      <View className="mt-4 flex-row justify-between items-center">
        <View>
          <Text className="text-muted text-lg">Welcome back,</Text>
          <Text className="text-main text-3xl font-bold">
            {user?.name || "Guest"} 👋
          </Text>
        </View>
        <TouchableOpacity
          className="bg-surface p-3 rounded-2xl border border-border relative flex-center"
          onPress={() => router.push("/notifications" as Href)}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.primary}
          />
          {(upcomingCount ?? 0) > 0 && (
            <View className="absolute top-1 right-1 bg-danger rounded-full h-6 w-6 flex-center border-2 border-surface">
              <Text className="text-inverse text-[10px] font-bold">
                {(upcomingCount ?? 0) > 9 ? "9+" : upcomingCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="bg-surface border border-border mt-8 p-4 rounded-2xl flex-row items-center">
        <Ionicons name="search-outline" size={20} color={colors.muted} />
        <TextInput
          placeholder="Search services..."
          placeholderTextColor={colors.muted}
          className="ml-3 flex-1 text-main"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Categories */}
      <View className="mt-8">
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveCategory(item)}
              className={`mr-3 px-6 py-3 rounded-2xl ${
                activeCategory === item
                  ? "bg-primary"
                  : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`font-bold ${activeCategory === item ? "text-white" : "text-muted"}`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      {/* Provider List */}
      <View className="flex-1 mt-6">
        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-main text-xl font-bold">Recommended</Text>
          <Link href={"/(tabs)/providers"} className="text-primary font-bold">
            See All
          </Link>
        </View>

        <FlatList
          data={filteredProviders}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={() => (
            <View className="items-center mt-10">
              <Text className="text-muted">
                No providers found for "{searchQuery}"
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
