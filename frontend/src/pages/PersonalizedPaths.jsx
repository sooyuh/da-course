import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Calendar, Award, Heart, RefreshCw } from 'lucide-react';

const PersonalizedPaths = () => {
  const [recommendedPaths, setRecommendedPaths] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 检查用户是否已登录
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // 获取推荐路径
  useEffect(() => {
    if (isAuthenticated) {
      const fetchRecommendations = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/learning-paths/recommendations', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('获取推荐路径失败');
          }
          const data = await response.json();
          setRecommendedPaths(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchInterests = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/learning-paths/interests', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setInterests(data);
          }
        } catch (err) {
          console.error('获取兴趣失败:', err);
        }
      };

      fetchRecommendations();
      fetchInterests();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-r from-primary/90 to-primary py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">个性化学习路径</h1>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              登录后查看为您量身定制的学习路径
            </p>
            <Link to="/login" className="btn-primary bg-white text-primary hover:bg-gray-100">
              立即登录
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-16">加载中...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-16">错误: {error}</div>;
  }

  return (
    <div className="min-h-screen">
      {/* 页面标题 */}
      <section className="bg-gradient-to-r from-primary/90 to-primary py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">个性化学习路径</h1>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            根据您的兴趣和学习进度，为您推荐最适合的学习路径
          </p>
          {interests.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {interests.map((interest, index) => (
                <span key={index} className="bg-white/20 px-4 py-2 rounded-full text-sm">
                  <Heart className="h-4 w-4 inline mr-1" /> {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 推荐路径 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-8">为您推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedPaths.map((path) => (
              <div key={path.id} className="card flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{path.name}</h3>
                    <p className="text-secondary">{path.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-secondary">{path.total_duration} 小时</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-secondary">{path.total_steps} 个项目</span>
                    </div>
                  </div>
                  <Link to={`/learning-paths/${path.id}`} className="text-primary font-medium flex items-center gap-2">
                    开始学习 <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {recommendedPaths.length === 0 && (
            <div className="text-center py-16">
              <p className="text-secondary mb-4">暂无推荐路径</p>
              <p className="text-secondary mb-6">完成更多项目或更新兴趣偏好，获取个性化推荐</p>
              <Link to="/projects" className="btn-primary">
                浏览项目
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PersonalizedPaths;