import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Book, Award, TrendingUp, Users, ChevronRight } from 'lucide-react';

const Home = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);

  useEffect(() => {
    // 检查用户登录状态
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // 获取用户成就
        const { data: achievements } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);
        setUserAchievements(achievements || []);
      }
    };

    checkUser();

    // 获取课程列表
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .limit(4);
      setCourses(data || []);
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              数据驱动未来，学习成就梦想
            </h1>
            <p className="text-xl mb-8">
              基于Python的数据分析在线教育平台，为商务数据分析与应用专业的学生提供完整的学习体系和互动式学习体验。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/courses" 
                className="bg-white text-blue-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <span>浏览课程</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/auth/register" 
                className="bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-800 transition-colors"
              >
                立即注册
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">完整课程体系</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              从Python基础到商务数据分析，我们提供系统化的课程内容，帮助你掌握数据分析的核心技能。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200">
                    {course.cover_image_url && (
                      <img 
                        src={course.cover_image_url} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${course.level === '初级' ? 'bg-green-100 text-green-800' : course.level === '中级' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {course.level}
                      </span>
                      <span className="text-xs text-gray-500">{course.category}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center text-sm text-blue-600 font-medium">
                      <span>查看详情</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/courses" 
              className="inline-flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              <span>查看全部课程</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">核心功能</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              我们提供互动式学习体验，帮助你更好地掌握数据分析技能。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">互动式学习</h3>
              <p className="text-gray-600">
                提供视频、文档、代码示例等多种学习形式，增强学习体验。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">练习与测评</h3>
              <p className="text-gray-600">
                通过编程练习和阶段性测试，巩固学习成果，评估学习效果。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">成就激励</h3>
              <p className="text-gray-600">
                获得徽章、证书等成就，提升学习动力，展示个人能力。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      {user && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">我的成就</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                展示你在学习过程中获得的成就和奖励。
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userAchievements.length > 0 ? (
                userAchievements.map((userAchievement, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
                    <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Award className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="text-sm font-medium">成就 {index + 1}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <p>尚未获得任何成就，开始学习吧！</p>
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <Link 
                to="/achievements" 
                className="inline-flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-800 transition-colors"
              >
                <span>查看全部成就</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;