import React, { useEffect } from "react";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import { Animated } from "react-native";

export default function TermsScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Box flex={1} style={{ background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' }}>
      <ScrollView p="$4">
        <VStack space="md" style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Heading size="xl" textAlign="center" style={{ fontFamily: 'Avenir', color: '#333' }}>用户协议</Heading>
          
          <VStack space="sm">
            <Heading size="md">1. 协议的范围</Heading>
            <Text>本协议是您与维扣平台之间关于使用维扣服务所订立的协议。</Text>
          </VStack>

          <VStack space="sm">
            <Heading size="md">2. 服务内容</Heading>
            <Text>维扣为用户提供以下服务：</Text>
            <Text>• 账号注册与管理</Text>
            <Text>• 内容浏览与分享</Text>
            <Text>• 社交互动功能</Text>
            <Text>• 其他相关服务</Text>
          </VStack>

          <VStack space="sm">
            <Heading size="md">3. 用户义务</Heading>
            <Text>• 遵守中华人民共和国相关法律法规</Text>
            <Text>• 不得利用本平台从事违法违规活动</Text>
            <Text>• 维护平台良好社区氛围</Text>
            <Text>• 保护个人账号安全</Text>
          </VStack>

          <VStack space="sm">
            <Heading size="md">4. 知识产权</Heading>
            <Text>维扣平台的所有内容，包括但不限于文字、图片、音频、视频等，均受著作权法和其他相关法律法规的保护。</Text>
          </VStack>

          <VStack space="sm">
            <Heading size="md">5. 免责声明</Heading>
            <Text>对于因不可抗力或维扣无法控制的原因造成的服务中断或其他缺陷，维扣不承担责任。</Text>
          </VStack>

          <Box mt="$4">
            <Button
              size="md"
              variant="solid"
              action="primary"
              onPress={() => router.back()}
              style={{ borderRadius: 10 }}
            >
              <ButtonText>返回</ButtonText>
            </Button>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}