import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { router } from 'expo-router';

// 定义接口返回格式
interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

// 创建请求实例
const instance: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:9800',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求队列管理
const pendingMap = new Map();

// 生成请求Key
function generateReqKey(config: AxiosRequestConfig) {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
}

// 将请求添加到队列
function addPending(config: AxiosRequestConfig) {
  const requestKey = generateReqKey(config);
  if (!pendingMap.has(requestKey)) {
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingMap.set(requestKey, controller);
  }
}

// 移除请求从队列
function removePending(config: AxiosRequestConfig) {
  const requestKey = generateReqKey(config);
  if (pendingMap.has(requestKey)) {
    const controller = pendingMap.get(requestKey);
    controller.abort();
    pendingMap.delete(requestKey);
  }
}

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 检查并取消重复请求
    removePending(config);
    addPending(config);

    // 添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    // 移除已完成的请求
    removePending(response.config);

    const { code, data, message } = response.data;

    // 处理业务状态码
    switch (code) {
      case 0:
        // 如果是登录接口的响应，保存用户信息
        if (response.config.url?.includes('/api/v1/users/login')) {
          const { user_id, username, access_token } = data;
          localStorage.setItem('user_id', user_id.toString());
          localStorage.setItem('username', username);
          localStorage.setItem('token', access_token);
        }
        return response.data;
      case 401:
        // 未登录或token过期
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        router.replace('/login');
        return Promise.reject(new Error(message || '请重新登录'));
      default:
        // 修改此处以返回完整的响应数据
        return Promise.reject(response.data);
    }
  },
  (error) => {
    // 移除失败的请求
    error.config && removePending(error.config);

    if (axios.isCancel(error)) {
      console.log('重复请求已取消');
      return Promise.reject(new Error('重复请求已取消'));
    }

    // 处理请求超时
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      return Promise.reject(new Error('请求超时，请重试'));
    }

    // 处理网络错误
    if (!window.navigator.onLine) {
      return Promise.reject(new Error('网络连接失败，请检查网络'));
    }

    return Promise.reject(error);
  }
);

// 封装请求方法
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config);
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config);
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config);
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.patch(url, data, config);
  },
};