import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Image } from "@/components/ui/image";
import { ImageBackground } from "@/components/ui/image-background";
import { router } from "expo-router";
import { Animated } from "react-native";

export default function LaunchScreen() {
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (isBackgroundLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // 呼吸灯动画
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isBackgroundLoaded]);

  return (
    <ImageBackground
      source={require("../assets/images/v2_q95i8v.jpg")}
      className="flex-1 justify-center items-center"
      resizeMode="cover"
      onLoadEnd={() => setIsBackgroundLoaded(true)}
    >
      {isBackgroundLoaded && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Box className="items-center space-y-6 bg-black/30 p-8 rounded-lg">
            <Text className="text-lg text-white font-semibold">打开维扣，记录这一刻</Text>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Pressable
                onPress={() => router.push("/login")}
                className="bg-red-500 w-14 h-14 rounded-full justify-center items-center shadow-lg"
              >
                <Box className="w-4 h-4 border-2 border-white rounded-sm" />
              </Pressable>
            </Animated.View>
          </Box>
        </Animated.View>
      )}
    </ImageBackground>
  );
}