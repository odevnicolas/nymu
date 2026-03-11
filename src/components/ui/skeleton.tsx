/**
 * Skeleton Loading - Componentes de loading simulando o conteúdo
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

/**
 * Skeleton genérico - barra de loading
 */
export function Skeleton({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}: { 
  width?: number | string; 
  height?: number; 
  borderRadius?: number;
  style?: any;
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: '#E5E7EB' },
        { opacity },
        style,
      ]}
    />
  );
}

/**
 * Skeleton para card de resumo de impostos
 */
export function SummaryCardSkeleton() {
  return (
    <View style={summaryStyles.container}>
      <View style={summaryStyles.row}>
        <View style={summaryStyles.item}>
          <Skeleton width={80} height={12} />
          <Skeleton width={60} height={24} style={{ marginTop: 8 }} />
        </View>
        <View style={summaryStyles.item}>
          <Skeleton width={80} height={12} />
          <Skeleton width={30} height={24} style={{ marginTop: 8 }} />
        </View>
      </View>
      <View style={summaryStyles.row}>
        <View style={summaryStyles.item}>
          <Skeleton width={40} height={12} />
          <Skeleton width={60} height={24} style={{ marginTop: 8 }} />
        </View>
        <View style={summaryStyles.item}>
          <Skeleton width={50} height={12} />
          <Skeleton width={60} height={24} style={{ marginTop: 8 }} />
        </View>
      </View>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FAB41B',
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  item: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 12,
  },
});

/**
 * Skeleton para item de imposto
 */
export function ImpostoItemSkeleton() {
  return (
    <View style={itemStyles.container}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={itemStyles.content}>
        <Skeleton width={60} height={16} />
        <Skeleton width={'80%'} height={14} style={{ marginTop: 6 }} />
        <View style={itemStyles.footer}>
          <Skeleton width={80} height={12} />
          <Skeleton width={60} height={16} />
        </View>
      </View>
    </View>
  );
}

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
});

/**
 * Skeleton para lista de impostos
 */
export function ImpostosListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index}>
          <ImpostoItemSkeleton />
          {index < count - 1 && <View style={dividerStyle} />}
        </View>
      ))}
    </View>
  );
}

const dividerStyle = {
  height: 1,
  backgroundColor: '#E5E7EB',
  marginLeft: 80,
};

export default {
  Skeleton,
  SummaryCardSkeleton,
  ImpostoItemSkeleton,
  ImpostosListSkeleton,
};
