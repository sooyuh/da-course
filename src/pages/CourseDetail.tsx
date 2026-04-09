import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { ChevronRight, PlayCircle, Book, CheckCircle, Clock } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户登录状态
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // 获取课程详情
    const fetchCourseDetail = async () => {
      if (!id) return;

      setLoading(true);
      
      // 获取课程信息
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseData) {
        setCourse(courseData);

        // 获取课程模块
        const { data: modulesData } = await supabase
          .from('modules')
          .select('*')
          .eq('course_id', id)
          .order('order_index', { ascending: true });

        setModules(modulesData || []);

        // 获取用户进度
        if (user) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', id);

          setUserProgress(progressData || []);
        }
      }

      setLoading(false);
    };

    fetchCourseDetail();
  }, [id, user]);

  // 获取模块进度
  const getModuleProgress = (moduleId: string) => {
    const progress = userProgress.find((p: any) => p.module_id === moduleId);
    return progress ? progress.progress_percentage : 0;
  };

  // 检查模块是否完成
  const isModuleCompleted = (moduleId: string) => {
    const progress = userProgress.find((p: any) => p.module_id === moduleId);
    return progress ? progress.completed : false;
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

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">课程不存在</h3>
          <p className="text-gray-600 mb-4">该课程可能已被删除或不存在。</p>
          <Link 
            to="/courses" 
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回课程列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* 课程头部 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="h-64 md:h-full bg-gray-200">
                {course.cover_image_url && (
                  <img 
                    src={course.cover_image_url} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="md:w-2/3 p-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${course.level === '初级' ? 'bg-green-100 text-green-800' : course.level === '中级' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                  {course.level}
                </span>
                <span className="text-xs text-gray-500">{course.category}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <span>预计学习时间: 10小时</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Book className="h-5 w-5" />
                  <span>{modules.length} 个模块</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 课程模块 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">课程模块</h2>
          <div className="space-y-4">
            {modules.map((module) => {
              const progress = getModuleProgress(module.id);
              const completed = isModuleCompleted(module.id);
              
              return (
                <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">{module.title}</h3>
                      <div className="flex items-center space-x-2">
                        {completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-sm text-gray-500">{progress}%</span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <Link 
                      to={`/learning/${course.id}/${module.id}`}
                      className="inline-flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-800 transition-colors"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>开始学习</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 课程信息 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">课程信息</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-gray-700 mb-1">课程目标</h3>
              <p className="text-gray-600">通过本课程的学习，你将掌握数据分析的核心技能，能够应用Python进行数据处理、分析和可视化。</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-1">适合人群</h3>
              <p className="text-gray-600">商务数据分析与应用专业的学生，以及希望提升数据分析能力的职场人士。</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-1">前置要求</h3>
              <p className="text-gray-600">{course.level === '初级' ? '无前置要求，适合初学者' : '具备基本的Python编程知识'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;