import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ProfileSkeleton = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Skeleton */}
        <View className="items-center px-6 mt-4">
          <View className="w-28 h-28 rounded-full bg-surface animate-pulse border-4 border-muted/20" />
          <View className="h-6 w-40 bg-surface rounded-lg mt-4 animate-pulse" />
          <View className="h-4 w-24 bg-surface rounded-full mt-2 animate-pulse" />
        </View>

        {/* Stats Row Skeleton */}
        <View className="flex-row justify-between px-6 mt-10">
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className="w-[30%] h-24 bg-surface border border-border rounded-3xl animate-pulse"
            />
          ))}
        </View>

        {/* Menu Groups Skeleton */}
        <View className="px-6 mt-10">
          <View className="h-3 w-32 bg-muted/20 rounded mb-4 ml-2" />
          <View className="bg-surface border border-border rounded-[32px] h-48 animate-pulse" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
