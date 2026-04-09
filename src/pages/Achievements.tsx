import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Award, Trophy, Users, ChevronRight } from 'lucide-react';

const Achievements = () => {
  const [user, setUser] = useState<any>(null);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [allAchievements, setAllAchievements] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户登录状态
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // 获取成就和排行榜数据
    const fetchAchievementsData = async () => {
      setLoading(true);

      // 获取所有成就
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*');
      setAllAchievements(achievementsData || []);

      // 获取排行榜
      const { data: leaderboardData } = await supabase
        .from('leaderboard')
        .select('*')
        .order('points', { ascending: false })
        .limit(10);
      setLeaderboard(leaderboardData || []);

      // 获取用户成就
      if (user) {
        const { data: userAchievementsData } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);
        setUserAchievements(userAchievementsData || []);
      }

      setLoading(false);
    };

    fetchAchievementsData();
  }, [user]);

  // 检查成就是否已解锁
  const isAchievementUnlocked = (achievementId: string) => {
    return userAchievements.some((ua: any) => ua.achievement_id === achievementId);
  };

  // 计算用户总积分
  const calculateTotalPoints = () => {
    return userAchievements.reduce((total, ua) => {
      const achievement = allAchievements.find(a => a.id === ua.achievement_id);
      return total + (achievement?.points || 0);
    }, 0);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">成就中心</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            展示你在学习过程中获得的成就和奖励，查看排行榜了解你的排名。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 个人成就 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 成就概览 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">我的成就</h2>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center">
                  <span className="text-2xl font-bold text-blue-600">{userAchievements.length}</span>
                  <span className="text-gray-600">已获得成就</span>
                </div>
                <div className="bg-green-100 rounded-lg p-4 flex flex-col items-center">
                  <span className="text-2xl font-bold text-green-600">{calculateTotalPoints()}</span>
                  <span className="text-gray-600">总积分</span>
                </div>
                <div className="bg-purple-100 rounded-lg p-4 flex flex-col items-center">
                  <span className="text-2xl font-bold text-purple-600">{allAchievements.length - userAchievements.length}</span>
                  <span className="text-gray-600">待解锁成就</span>
                </div>
              </div>
            </div>

            {/* 成就列表 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">成就列表</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allAchievements.map((achievement) => {
                  const unlocked = isAchievementUnlocked(achievement.id);
                  
                  return (
                    <div 
                      key={achievement.id} 
                      className={`border rounded-lg p-4 ${unlocked ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`rounded-full w-12 h-12 flex items-center justify-center ${unlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Award className={`h-6 w-6 ${unlocked ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-grow">
                          <h3 className={`font-medium ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>{achievement.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {achievement.points} 积分
                            </span>
                            {unlocked ? (
                              <span className="text-xs text-green-600 font-medium">已解锁</span>
                            ) : (
                              <span className="text-xs text-gray-500 font-medium">未解锁</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 排行榜 */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">排行榜</h2>
              </div>
              <div className="space-y-3">
                {leaderboard.length > 0 ? (
                  leaderboard.map((user, index) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white bg-gray-600">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">用户 {index + 1}</p>
                        <p className="text-sm text-gray-500">{user.points} 积分</p>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">#{user.rank || (index + 1)}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>暂无排行榜数据</p>
                  </div>
                )}
              </div>
            </div>

            {/* 激励系统 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">激励系统</h2>
              </div>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">学习目标</h3>
                  <p className="text-gray-600 mb-3">设置学习目标，获得额外奖励。</p>
                  <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors w-full">
                    设置目标
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">连续学习</h3>
                  <p className="text-gray-600 mb-3">连续学习7天，获得特殊成就。</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500">已连续学习 2 天</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;