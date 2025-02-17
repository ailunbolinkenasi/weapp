import { lazy } from 'react';

// 路由配置
export const routes = {
  // 主页
  index: {
    path: '/',
    component: lazy(() => import('../components/LaunchScreen')),
  },
  // 登录相关
  login: {
    path: '/login',
    component: lazy(() => import('../components/LoginScreen')),
  },
  signup: {
    path: '/signup',
    component: lazy(() => import('../components/SignupScreen')),
  },
//   'forgot-password': {
//     path: '/forgot-password',
//     component: lazy(() => import('../pages/ForgotPassword')),
//   },
};