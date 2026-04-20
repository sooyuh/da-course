import { create } from 'zustand';

const useProgressStore = create((set, get) => ({
  progressList: [],
  isLoading: false,
  error: null,
  
  // 获取学习进度
  getProgress: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ progressList: [] });
      return [];
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/auth/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '获取学习进度失败');
      }
      
      set({ progressList: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },
  
  // 更新学习进度
  updateProgress: async (projectId, progress) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未登录');
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/api/auth/progress/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ progress })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '更新学习进度失败');
      }
      
      // 更新本地进度列表
      const currentProgressList = get().progressList;
      const updatedProgressList = currentProgressList.map(item => 
        item.project_id === projectId ? { ...item, ...data } : item
      );
      
      // 如果不存在，添加新记录
      if (!updatedProgressList.some(item => item.project_id === projectId)) {
        updatedProgressList.push(data);
      }
      
      set({ progressList: updatedProgressList, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 清除错误
  clearError: () => {
    set({ error: null });
  }
}));

export default useProgressStore;