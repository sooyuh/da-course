import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { User, Book, Award, History, Edit } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户登录状态
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // 获取用户数据
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);

        // 获取用户学习进度
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);
        setUserProgress(progressData || []);

        // 获取用户成就
        const { data: achievementsData } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);
        setUserAchievements(achievementsData || []);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  // 计算学习统计
  const calculateLearningStats = () => {
    const totalCourses = new Set(userProgress.map((p: any) => p.course_id)).size;
    const completedCourses = new Set(userProgress.filter((p: any) => p.completed).map((p: any) => p.course_id)).size;
    const totalModules = userProgress.length;
    const completedModules = userProgress.filter((p: any) => p.completed).length;

    return {
      totalCourses,
      completedCourses,
      totalModules,
      completedModules
    };
  };

  const stats = calculateLearningStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">请先登录</h3>
          <p className="text-gray-600 mb-4">登录后才能查看个人中心。</p>
          <a 
            href="/auth/login" 
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            去登录
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">个人中心</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            管理你的个人信息，查看学习历史和成就记录。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 个人信息 */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{user.email}</h2>
                <p className="text-gray-600 mb-4">商务数据分析与应用专业</p>
                <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto">
                  <Edit className="h-4 w-4" />
                  <span>编辑资料</span>
                </button>
              </div>
            </div>

            {/* 学习统计 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">学习统计</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">已学课程</span>
                  <span className="font-semibold text-gray-800">{stats.completedCourses} / {stats.totalCourses}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: stats.totalCourses > 0 ? `${(stats.completedCourses / stats.totalCourses) * 100}%` : '0%' }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">已学模块</span>
                  <span className="font-semibold text-gray-800">{stats.completedModules} / {stats.totalModules}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: stats.totalModules > 0 ? `${(stats.completedModules / stats.totalModules) * 100}%` : '0%' }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">获得成就</span>
                  <span className="font-semibold text-gray-800">{userAchievements.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 学习历史和成就记录 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 学习历史 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <History className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">学习历史</h2>
              </div>
              <div className="space-y-4">
                {userProgress.length > 0 ? (
                  userProgress.map((progress) => (
                    <div key={progress.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800">课程 {progress.course_id.substring(0, 8)}...</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${progress.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {progress.completed ? '已完成' : '进行中'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${progress.progress_percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">进度: {progress.progress_percentage}%</span>
                        <span className="text-sm text-gray-500">最后访问: {new Date(progress.last_accessed_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>暂无学习历史</p>
                  </div>
                )}
              </div>
            </div>

            {/* 成就记录 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">成就记录</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userAchievements.length > 0 ? (
                  userAchievements.map((userAchievement, index) => (
                    <div key={userAchievement.id} className="border border-green-300 bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
                          <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800">成就 {index + 1}</h3>
                          <p className="text-sm text-gray-600">解锁时间: {new Date(userAchievement.unlocked_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p>暂无成就记录</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;