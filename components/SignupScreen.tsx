import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack"
import { Text } from "@/components/ui/text";
import {
  FormControl,
  FormControlLabel
} from "@/components/ui/form-control"
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox"
import { CheckIcon } from "@/components/ui/icon"
import { Heading } from "@/components/ui/heading";
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

export default function SignupScreen() {
  const toast = useToast();
  const [toastId, setToastId] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
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
                <ToastTitle>注册失败</ToastTitle>
                <ToastDescription>{errorMessage}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    }
  };

  const handleSignup = async () => {
    if (!username || !password || !confirmPassword) {
      setError("请填写所有必填项");
      return;
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    if (!agreeToTerms) {
      setError("请阅读并同意用户协议和隐私政策");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.register({
        username,
        password,
        confirmPassword,
      });

      if (response && response.code === 0) {
        toast.show({
          placement: "top",
          offset: 100, 
          render: ({ id }) => (
            <Toast nativeID={`toast-${id}`} action="success" variant="solid">
              <VStack space="xs">
                <ToastTitle>注册成功</ToastTitle>
              </VStack>
            </Toast>
          ),
        });
        router.replace("/login");
      } else {
        const errorMessage = response?.msg || "注册失败，请稍后重试";
        setError(errorMessage);
        showErrorToast(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.msg || "注册失败，请检查网络连接";
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex-1 justify-center items-center p-4 bg-white">
      <Animated.View style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Box className="w-full max-w-sm bg-white p-6 rounded-3xl space-y-6">
          <Box className="space-y-2">
            <Heading size="xl" className="text-center">注册维扣</Heading>
            <Box className="flex-row justify-center items-center space-x-1">
              <Text size="sm" className="text-gray-600">已有账号？</Text>
              <Link href="/login">
                <LinkText>登录</LinkText>
              </Link>
            </Box>
          </Box>

          <VStack space="md">
            <FormControl isInvalid={!!error}>
              <FormControlLabel><Text>用户名</Text></FormControlLabel>
              <Input>
                <InputField
                  placeholder="请输入用户名"
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
            </FormControl>

            <FormControl isInvalid={!!error}>
              <FormControlLabel><Text>确认密码</Text></FormControlLabel>
              <Input>
                <InputField
                  placeholder="请再次输入密码"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  className="bg-white rounded-lg px-4 py-3 border-0"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <InputSlot className="pr-4">
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} color="#666" />
                  </Pressable>
                </InputSlot>
              </Input>
              {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
            </FormControl>

            <Box className="flex-row items-start space-x-2">
              <Checkbox
                size="md"
                isInvalid={false}
                isDisabled={false}
                value={agreeToTerms}
                onChange={setAgreeToTerms}
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="ml-2 flex-wrap">
                  <Text className="text-sm text-gray-600">我已阅读并同意</Text>
                  <Link href="/terms">
                    <LinkText className="text-sm">《用户协议》</LinkText>
                  </Link>
                  <Text className="text-sm text-gray-600">和</Text>
                  <Link href="/privacy">
                    <LinkText className="text-sm">《隐私政策》</LinkText>
                  </Link>
                </CheckboxLabel>
              </Checkbox>
            </Box>

            <Button
              size="md"
              variant="solid"
              action="primary"
              onPress={handleSignup}
              isDisabled={isLoading}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <ButtonText>{isLoading ? "注册中..." : "注册"}</ButtonText>
            </Button>
          </VStack>
        </Box>
      </Animated.View>
    </Box>
  );
}