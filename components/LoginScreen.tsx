import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack"
import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import {
  FormControl,
  FormControlLabel
} from "@/components/ui/form-control"
import { Input, InputField,InputSlot,InputIcon} from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import {
  InstagramIcon,
  GithubIcon,
  TwitterIcon,
  FacebookIcon,
} from "lucide-react-native"
import { CheckIcon } from "@/components/ui/icon"
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { Link, LinkText } from "@/components/ui/link";
import { Pressable } from "@/components/ui/pressable";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { Animated } from "react-native";
import { router } from "expo-router";
import { authApi } from "@/api/auth";
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast"

export default function LoginScreen() {
  const toast = useToast();
  const [toastId, setToastId] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];
  const buttonScaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleFocus = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const showErrorToast = (errorMessage: string) => {
    if (!toast.isActive(toastId)) {
      const newId = Math.random();
      setToastId(newId);
      toast.show({
        id: newId,
        placement: "top",
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toast nativeID={uniqueToastId} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>登录失败</ToastTitle>
                <ToastDescription>{errorMessage}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    }
  };

  const showSuccessToast = (successMessage: string) => {
    if (!toast.isActive(toastId)) {
      const newId = Math.random();
      setToastId(newId);
      toast.show({
        id: newId,
        placement: "top",
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toast
              nativeID={uniqueToastId}
              className="p-4 gap-3 w-full sm:min-w-[386px] max-w-[386px] bg-background-0 shadow-hard-2 flex-row"
            >
              <Avatar>
                <AvatarFallbackText>{username.slice(0, 2).toUpperCase()}</AvatarFallbackText>
              </Avatar>
              <VStack className="web:flex-1">
                <HStack className="justify-between">
                  <Heading
                    size="sm"
                    className="text-typography-950 font-semibold"
                  >
                    {username}
                  </Heading>
                  <Text size="sm" className="text-typography-500">
                    刚刚
                  </Text>
                </HStack>
                <Text size="sm" className="text-typography-500">
                  {successMessage}
                </Text>
              </VStack>
            </Toast>
          );
        },
      });
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("请输入账号和密码");
      return;
    }
  
    setError("");
    setIsLoading(true);
    
    let isMounted = true; // 添加组件挂载状态标志
  
    try {
      const response = await authApi.login({
        username,
        password,
      });

      // 确保组件仍然挂载
      if (!isMounted) return;
      
      // 检查响应数据是否存在
      if (!response) {
        throw new Error('响应数据为空');
      }
      
      const { code, msg, data } = response; // 确保从 response 中解构出 msg
      // 登录成功
      if (code === 0 && data) {
        if (rememberMe) {
          // TODO: 实现本地存储用户信息的逻辑
          // localStorage.setItem('user', JSON.stringify(data));
        }
        // 先显示成功提示，然后再跳转
        showSuccessToast("欢迎回来：" + data.username);
        setTimeout(() => {
          router.replace('/tabs');
        }, 1000); // 延迟1秒跳转，让用户看到提示
        return;
      }
      
      // 处理业务错误
      const errorMessage = msg || '登录失败，请稍后重试';
      if (isMounted) {
        setError(errorMessage);
        showErrorToast(errorMessage); // 使用后端返回的错误信息
      }
      
    } catch (err: any) {
      if (!isMounted) return;
      
      // 调试输出错误信息
      console.log('请求错误:', err);

      let errorMessage = '请求异常，请检查网络连接';
      if (err.msg) {
        errorMessage = err.msg;
      } 
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  
    // 组件卸载时的清理函数
    return () => {
      isMounted = false;
    };
  };

  return (
    <Box className="flex-1 justify-center items-center p-4 bg-white">
      <Animated.View style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Box className="w-full max-w-sm bg-white p-6 rounded-3xl space-y-6">
        <Box className="space-y-2">
          <Heading size="xl" className="text-center">登录维扣</Heading>
          <Box className="flex-row justify-center items-center space-x-1">
            <Text size="sm" className="text-gray-600">如果还没有账号请</Text>
            <Link href="/signup">
              <LinkText>注册</LinkText>
            </Link>
          </Box>
        </Box>

        <VStack space="md">
          <FormControl isInvalid={!!error}>
            <FormControlLabel><Text>账号</Text></FormControlLabel>
            <Input>
              <InputField
                placeholder="请输入账号"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-white rounded-lg px-4 py-3 border-0"
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={username}
                onChangeText={setUsername}
              />
            </Input>
          </FormControl>

          <FormControl isInvalid={!!error}>
            <FormControlLabel><Text>密码</Text></FormControlLabel>
            <Input>
              <InputField
                placeholder="请输入密码"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="bg-white rounded-lg px-4 py-3 border-0"
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={password}
                onChangeText={setPassword}
              />
              <InputSlot className="pr-4">
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} color="#666" />
                </Pressable>
              </InputSlot>
            </Input>
            {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
          </FormControl>

          <Box className="flex-row justify-between items-center">
            <Checkbox
              size="md"
              isInvalid={false}
              isDisabled={false}
              value={rememberMe}
              onChange={setRememberMe}
            >
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <CheckboxLabel className="ml-2">记住我</CheckboxLabel>
            </Checkbox>
            <Link href="/forgot-password" className="text-gray-600">
              <Text>忘记密码？</Text>
            </Link>
          </Box>

            <Button
              size="md"
              variant="solid"
              action="primary"
              onPress={handleLogin}
              isDisabled={isLoading}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <ButtonText>{isLoading ? "登录中..." : "登录"}</ButtonText>
            </Button>
        </VStack>
        </Box>

        <Box className="space-y-4 mt-6">
          <Box className="flex-row items-center ">
            <Divider className="flex-1" />
            <Text className="mx-4 text-gray-500">暂不支持第三方登录嘿嘿!</Text>
            <Divider className="flex-1" />
          </Box>

          <Box className="flex-row justify-center space-x-6">
          <Icon className="text-typography-500" as={FacebookIcon} />
          <Icon className="text-typography-500" as={TwitterIcon} />
          <Icon className="text-typography-500" as={GithubIcon} />
          <Icon className="text-typography-500" as={InstagramIcon} />

          </Box>
        </Box>
      </Animated.View>
    </Box>
  );
}