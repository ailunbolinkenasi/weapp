import React, { useEffect } from "react";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";

export default function PrivacyScreen() {
  return (
    <Box flex={1} style={{ background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' }}>
      <ScrollView p="$4">
        <VStack space="md" style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Heading size="xl" textAlign="center" style={{ fontFamily: 'Avenir', color: '#333' }}>隐私政策</Heading>

          <VStack space="sm">
            <Heading size="md">1. 信息收集</Heading>
            <Text>我们收集的信息包括：</Text>
            <Text>• 账号信息（用户名、密码等）</Text>
            <Text>• 设备信息</Text>
            <Text>• 使用记录</Text>
            <Text>• 位置信息（如果您授权）</Text>
          </VStack>

          <VStack space="sm">
            <Heading size="md">2. 信息使用</Heading>
            <Text>我们使用收集的信息用于：</Text>
            <Text>• 提供、维护和改进服务</Text>
            <Text>• 开发新功能</Text>
            <Text>• 保护用户安全</Text>
            <Text>• 向您推送相关信息</Text>
          </VStack>

          <VStack space="sm">
            <Heading size="md">3. 信息保护</Heading>
            <Text>我们采取多种安全措施保护您的个人信息：</Text>
            <Text>• 数据加密存储</Text>
            <Text>• 访问权限控制</Text>
            <Text>• 定期安全评估</Text>
          </VStack>

          <VStack space="sm">
            <Heading size="md">4. 信息共享</Heading>
            <Text>除非经过您的同意，我们不会与第三方分享您的个人信息。</Text>
          </VStack>

          <VStack space="sm">
            <Heading size="md">5. 您的权利</Heading>
            <Text>您有权：</Text>
            <Text>• 访问您的个人信息</Text>
            <Text>• 更正不准确的信息</Text>
            <Text>• 删除您的账号</Text>
          </VStack>

          <Box mt="$4">
            <Button
              size="md"
              variant="solid"
              action="primary"
              onPress={() => router.back()}
              style={{  borderRadius: 10 }}
            >
              <ButtonText style={{ color: '#fff' }}>返回</ButtonText>
            </Button>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}