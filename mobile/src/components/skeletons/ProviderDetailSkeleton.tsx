import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '../ui/Skeleton';

export const ProviderDetailSkeleton = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image Placeholder */}
        <Skeleton width="100%" height={320} radius={0} />

        <View className="bg-background -mt-10 rounded-t-[40px] px-6 pt-8 pb-10">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-4">
              <Skeleton width="70%" height={32} className="mb-2" />
              <Skeleton width="40%" height={20} />
            </View>
            <Skeleton width={60} height={45} radius={16} />
          </View>

          {/* Bio Lines */}
          <View className="mt-6 gap-2">
            <Skeleton width="100%" height={14} />
            <Skeleton width="100%" height={14} />
            <Skeleton width="60%" height={14} />
          </View>

          {/* Slots Placeholder */}
          <Skeleton width="50%" height={24} className="mt-8 mb-4" />
          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} width="48%" height={55} radius={16} className="mb-4" />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar Placeholder */}
      <View className="p-6 bg-surface border-t border-border flex-row items-center">
        <View className="flex-1">
          <Skeleton width="40%" height={12} className="mb-2" />
          <Skeleton width="60%" height={28} />
        </View>
        <View className="flex-1 ml-4">
          <Skeleton width="100%" height={50} radius={12} />
        </View>
      </View>
    </SafeAreaView>
  );
};
