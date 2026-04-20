import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  
  // 登录
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '登录失败');
      }
      
      // 保存token到本地存储
      localStorage.setItem('token', data.access_token);
      
      set({ 
        user: data.user, 
        token: data.access_token, 
        isLoading: false 
      });
      
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 注册
  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '注册失败');
      }
      
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 获取当前用户信息
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null });
      return null;
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '获取用户信息失败');
      }
      
      set({ user: data, isLoading: false });
      return data;
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, error: error.message, isLoading: false });
      return null;
    }
  },
  
  // 更新用户信息
  updateUser: async (userData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未登录');
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '更新用户信息失败');
      }
      
      set({ user: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 登出
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  
  // 清除错误
  clearError: () => {
    set({ error: null });
  }
}));

export default useAuthStore;