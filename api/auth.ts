import { request } from './request';

// 用户认证相关接口
export interface LoginParams {
  username: string;
  password: string;
}

// 用户注册接口
export interface RegisterParams  {
  username: string;
  password: string;
  confirmPassword: string;
}


export const authApi = {
  // 用户登录
  login(params: LoginParams) {
    return request.post('/api/v1/users/login', params);
  },

  // 用户注册
  register(params: RegisterParams) {
    return request.post<{
      token: string;
      user: UserInfo;
    }>('/api/v1/users/register', params);
  },

  // 获取当前用户信息
  getCurrentUser() {
    return request.get<UserInfo>('/auth/me');
  },

  // 退出登录
  logout() {
    return request.post('/auth/logout');
  },

  // 刷新token
  refreshToken() {
    return request.post<{
      token: string;
    }>('/auth/refresh-token');
  },
};