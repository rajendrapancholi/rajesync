import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, DimensionValue } from 'react-native';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  className?: string;
}

export const Skeleton = ({ width, height, radius = 8, className = "" }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View className={className}>
      <Animated.View
        style={[
          styles.skeleton,
          { 
            width: width ?? '100%', 
            height: height ?? 20, 
            borderRadius: radius, 
            opacity 
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E9EE',
  },
});
