import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, BookOpen, Heart, Clock, Edit, Settings, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useProgressStore from '../store/progressStore';

const Profile = () => {
  const navigate = useNavigate();
  const { user, getCurrentUser, logout } = useAuthStore();
  const { progressList, getProgress } = useProgressStore();
  
  // 加载用户信息和学习进度
  useEffect(() => {
    const loadData = async () => {
      await getCurrentUser();
      await getProgress();
    };
    loadData();
  }, [getCurrentUser, getProgress]);
  
  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // 计算统计数据
  const completedProjects = progressList.filter(item => item.completed).length;
  const totalProjects = progressList.length;
  
  // 生成用户头像
  const getAvatar = (username) => {
    const initials = username.charAt(0).toUpperCase();
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%20of%20a%20person%20with%20${initials}%20initials%2C%20clean%20background&image_size=square`;
  };

  // 模拟收藏项目数据
  const favoriteProjects = [
    {
      id: 4,
      title: '购物篮分析与关联规则挖掘',
      difficulty: '中级',
      category: '数据挖掘',
    },
    {
      id: 5,
      title: 'RFM用户价值分层与精细化运营',
      difficulty: '中级',
      category: '用户分析',
    },
  ];

  // 模拟学习历史数据
  const learningHistory = [
    {
      id: 1,
      action: '开始学习',
      project: '电商销售数据清洗与质量诊断',
      time: '2026-04-18 14:30',
    },
    {
      id: 2,
      action: '完成项目',
      project: '商品销售趋势分析与库存预警',
      time: '2026-04-17 16:45',
    },
    {
      id: 3,
      action: '开始学习',
      project: '用户行为日志分析与漏斗转化',
      time: '2026-04-16 10:15',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">个人中心</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧个人信息 */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              <div className="mb-4">
                <img 
                  src={user ? getAvatar(user.username) : 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%2C%20clean%20background&image_size=square'} 
                  alt="用户头像" 
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-primary/20"
                />
              </div>
              <h2 className="text-xl font-semibold mb-1">{user ? user.username : '加载中...'}</h2>
              <p className="text-secondary mb-4">{user ? user.email : '加载中...'}</p>
              <div className="space-y-2 text-sm text-secondary mb-6">
                <div>注册日期: {user ? new Date(user.created_at).toLocaleDateString() : '加载中...'}</div>
                <div>已完成项目: {completedProjects}/{totalProjects}</div>
                <div>学习时长: 0 小时</div>
              </div>
              <div className="space-y-2">
                <button className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-light">
                  <Edit className="h-4 w-4" />
                  编辑资料
                </button>
                <button className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-light">
                  <Settings className="h-4 w-4" />
                  账户设置
                </button>
                <button 
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-light text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  退出登录
                </button>
              </div>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="lg:col-span-3 space-y-8">
            {/* 学习进度 */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">学习进度</h2>
              </div>
              <div className="space-y-6">
                {progressList.length > 0 ? (
                  progressList.map((item) => (
                    <div key={item.project_id}>
                      <div className="flex justify-between items-center mb-2">
                        <Link to={`/projects/${item.project_id}`} className="font-medium hover:text-primary">
                          {item.project_name}
                        </Link>
                        <span className="text-sm text-secondary">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-light rounded-full h-2 mb-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-secondary">最后更新: {new Date(item.last_accessed).toLocaleDateString()}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-secondary">
                    暂无学习进度
                  </div>
                )}
              </div>
            </section>

            {/* 收藏项目 */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">收藏项目</h2>
              </div>
              <div className="space-y-4">
                {favoriteProjects.map((project) => (
                  <Link 
                    key={project.id} 
                    to={`/projects/${project.id}`} 
                    className="flex justify-between items-center p-3 hover:bg-light rounded-lg transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${project.difficulty === '入门' ? 'bg-green-100 text-green-800' : project.difficulty === '中级' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {project.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-light text-secondary">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <Heart className="h-5 w-5 text-primary" />
                  </Link>
                ))}
              </div>
            </section>

            {/* 学习历史 */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">学习历史</h2>
              </div>
              <div className="space-y-4">
                {learningHistory.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 hover:bg-light rounded-lg transition-colors">
                    <div>
                      <div className="font-medium">{item.action}</div>
                      <div className="text-sm text-secondary mt-1">{item.project}</div>
                    </div>
                    <div className="text-sm text-secondary">{item.time}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;