import Sizes from '@/constants/Sizes';
import { useTimer } from '@/contexts/timer';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

const TIME_TICK = 1000;

const TimeDivider = () => {
  const themeColors = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const intervalId = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, TIME_TICK);

    return () => clearInterval(intervalId);
  }, [opacity]);

  return (
    <Animated.Text
      style={{
        color: themeColors.text,
        fontSize: Sizes.LARGE_TEXT,
        opacity,
      }}
    >
      :
    </Animated.Text>
  );
};

export const Timer = () => {
  const themeColors = useTheme();
  const { hours, minutes, seconds } = useTimer();

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: themeColors.background,
        borderRadius: Sizes.DEFAULT_RADIUS,
        flexDirection: 'row',
        gap: 4,
        padding: Sizes.DEFAULT_PADDING,
      }}
    >
      <Text
        style={{
          fontSize: Sizes.ULTRA_LARGE_TEXT,
          color: themeColors.text,
        }}
      >
        {hours}
      </Text>
      <TimeDivider />
      <Text
        style={{
          fontSize: Sizes.ULTRA_LARGE_TEXT,
          color: themeColors.text,
        }}
      >
        {minutes}
      </Text>
      <TimeDivider />
      <Text
        style={{
          fontSize: Sizes.ULTRA_LARGE_TEXT,
          color: themeColors.text,
        }}
      >
        {seconds}
      </Text>
    </View>
  );
};
