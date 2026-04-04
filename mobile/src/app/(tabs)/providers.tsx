import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/theme";
import { useRouter, Href } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useProviders, useCategories } from "@/hooks/useProviders";
import { Skeleton } from "@/components/ui/Skeleton";
import { FetchProvider } from "@/types/Provider";

export default function ProvidersTab() {
  const { colors } = useThemeColors();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: providers = [], isLoading, refetch } = useProviders();
  const { data: categories = [] } = useCategories();

  const filtered = useMemo(() => {
    return providers.filter((p: FetchProvider) => {
      const matchesSearch = 
        (p.name?.toLowerCase().includes(search.toLowerCase())) ||
        (p.category?.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = 
        activeCategory === "All" || p.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, providers]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background px-5">
        <View className="h-10 w-40 mt-6 mb-4">
          <Skeleton width="100%" height="100%" />
        </View>
        <Skeleton width="100%" height={60} radius={16} className="mb-8" />
        <Skeleton width="100%" height={120} radius={24} className="mb-4" />
        <Skeleton width="100%" height={120} radius={24} className="mb-4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header & Search Section */}
      <View className="px-5 pt-4">
        <Text className="text-3xl font-bold text-main tracking-tight">
          Explore
        </Text>
        <Text className="text-muted text-lg">Top specialists near you</Text>

        <View className="bg-surface border border-border mt-6 p-4 rounded-[24px] flex-row items-center shadow-sm">
          <Ionicons name="search-outline" size={22} color={colors.primary} />
          <TextInput
            placeholder="Search name or service..."
            placeholderTextColor={colors.textMuted}
            className="ml-3 flex-1 text-main font-medium"
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Horizontal Category Chips */}
      <View className="mt-6">
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveCategory(item)}
              className={`mr-3 px-6 py-2.5 rounded-full border ${
                activeCategory === item
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`font-bold ${activeCategory === item ? "text-white" : "text-muted"}`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Provider Cards */}
      <FlatList
        data={filtered}
        className="mt-6 px-5"
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="search-outline" size={60} color={colors.surface} />
            <Text className="text-muted mt-4">No specialists found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push(`/details/${item.id}` as Href)}
            className="bg-surface p-4 rounded-[32px] border border-border mb-5 flex-row items-center shadow-sm"
          >
            {/* Provider Avatar */}
            <View className="relative">
              <Image
                source={{ uri: item.image }}
                className="w-20 h-20 rounded-2xl bg-muted"
              />
              <View className="absolute -bottom-1 -right-1 bg-success h-4 w-4 rounded-full border-2 border-surface" />
            </View>

            {/* Provider Info */}
            <View className="ml-5 flex-1">
              <Text className="text-main font-bold text-lg" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-primary font-medium text-xs mb-2 uppercase tracking-widest">
                {item.category}
              </Text>

              <View className="flex-row items-center">
                <View className="flex-row items-center bg-background px-2 py-1 rounded-lg">
                  <Ionicons name="star" size={14} color="#FBBF24" />
                  <Text className="text-main font-bold ml-1 text-xs">
                    {item.rating}
                  </Text>
                </View>
                <Text className="text-muted ml-3 font-bold">{item.price}</Text>
              </View>
            </View>

            {/* Arrow Button */}
            <View className="bg-primary/10 p-2 rounded-full">
              <Ionicons name="arrow-forward" size={18} color={colors.primary} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
