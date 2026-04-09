import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { ChevronLeft, CheckCircle, BookOpen, PenTool, FileText } from 'lucide-react';

const LearningModule = () => {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
  const [learningContents, setLearningContents] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content'); // content, exercises, assessments
  const [submittedExercises, setSubmittedExercises] = useState<Record<string, boolean>>({});
  const [submittedAssessments, setSubmittedAssessments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // 检查用户登录状态
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // 获取学习模块数据
    const fetchLearningModule = async () => {
      if (!courseId || !moduleId) return;

      setLoading(true);

      // 获取课程信息
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      setCourse(courseData);

      // 获取模块信息
      const { data: moduleData } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single();
      setModule(moduleData);

      // 获取学习内容
      const { data: contentsData } = await supabase
        .from('learning_contents')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });
      setLearningContents(contentsData || []);

      // 获取练习
      const { data: exercisesData } = await supabase
        .from('exercises')
        .select('*')
        .eq('module_id', moduleId);
      setExercises(exercisesData || []);

      // 获取测评
      const { data: assessmentsData } = await supabase
        .from('assessments')
        .select('*')
        .eq('module_id', moduleId);
      setAssessments(assessmentsData || []);

      // 获取用户提交记录
      if (user) {
        // 练习提交记录
        const { data: exerciseSubmissions } = await supabase
          .from('exercise_submissions')
          .select('exercise_id')
          .eq('user_id', user.id);

        if (exerciseSubmissions) {
          const submitted = exerciseSubmissions.reduce((acc, submission) => {
            acc[submission.exercise_id] = true;
            return acc;
          }, {} as Record<string, boolean>);
          setSubmittedExercises(submitted);
        }

        // 测评提交记录
        const { data: assessmentSubmissions } = await supabase
          .from('assessment_submissions')
          .select('assessment_id')
          .eq('user_id', user.id);

        if (assessmentSubmissions) {
          const submitted = assessmentSubmissions.reduce((acc, submission) => {
            acc[submission.assessment_id] = true;
            return acc;
          }, {} as Record<string, boolean>);
          setSubmittedAssessments(submitted);
        }
      }

      setLoading(false);
    };

    fetchLearningModule();
  }, [courseId, moduleId, user]);

  // 更新学习进度
  const updateProgress = async () => {
    if (!user || !courseId || !moduleId) return;

    // 计算进度
    const totalItems = learningContents.length + exercises.length + assessments.length;
    let completedItems = 0;

    // 学习内容默认全部完成
    completedItems += learningContents.length;

    // 练习完成情况
    completedItems += Object.values(submittedExercises).filter(Boolean).length;

    // 测评完成情况
    completedItems += Object.values(submittedAssessments).filter(Boolean).length;

    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    const completed = progressPercentage === 100;

    // 更新进度
    await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        course_id: courseId,
        module_id: moduleId,
        progress_percentage: progressPercentage,
        completed: completed,
        last_accessed_at: new Date().toISOString()
      });
  };

  // 提交练习
  const handleExerciseSubmit = async (exerciseId: string) => {
    if (!user) return;

    // 模拟提交
    setSubmittedExercises(prev => ({
      ...prev,
      [exerciseId]: true
    }));

    // 实际提交逻辑
    await supabase
      .from('exercise_submissions')
      .insert({
        user_id: user.id,
        exercise_id: exerciseId,
        answer: '完成练习',
        score: 100,
        feedback: '练习完成'
      });

    updateProgress();
  };

  // 提交测评
  const handleAssessmentSubmit = async (assessmentId: string) => {
    if (!user) return;

    // 模拟提交
    setSubmittedAssessments(prev => ({
      ...prev,
      [assessmentId]: true
    }));

    // 实际提交逻辑
    await supabase
      .from('assessment_submissions')
      .insert({
        user_id: user.id,
        assessment_id: assessmentId,
        answers: {},
        total_score: 80,
        passed: true
      });

    updateProgress();
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

  if (!course || !module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">模块不存在</h3>
          <p className="text-gray-600 mb-4">该模块可能已被删除或不存在。</p>
          <Link 
            to={`/courses/${courseId}`} 
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回课程详情
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* 面包屑导航 */}
        <div className="mb-6 flex items-center space-x-2">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">首页</Link>
          <span className="text-gray-400">/</span>
          <Link to={`/courses`} className="text-gray-600 hover:text-blue-600 transition-colors">课程中心</Link>
          <span className="text-gray-400">/</span>
          <Link to={`/courses/${courseId}`} className="text-gray-600 hover:text-blue-600 transition-colors">{course.title}</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">{module.title}</span>
        </div>

        {/* 模块标题 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to={`/courses/${courseId}`} 
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>返回课程</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">{module.title}</h1>
          </div>
          <p className="text-gray-600 mt-2">{module.description}</p>
        </div>

        {/* 标签页 */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'content' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>学习内容</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('exercises')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'exercises' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <div className="flex items-center space-x-2">
                  <PenTool className="h-4 w-4" />
                  <span>练习</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('assessments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assessments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>测评</span>
                </div>
              </button>
            </nav>
          </div>

          {/* 标签页内容 */}
          <div className="p-6">
            {/* 学习内容 */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                {learningContents.length > 0 ? (
                  learningContents.map((content) => (
                    <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 mb-2">{content.title}</h3>
                      <div className="text-gray-600">
                        {/* 根据内容类型显示不同的内容 */}
                        {content.type === 'video' ? (
                          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">视频内容</p>
                          </div>
                        ) : content.type === 'document' ? (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p>{content.content}</p>
                          </div>
                        ) : content.type === 'code' ? (
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                            <pre>{content.content}</pre>
                          </div>
                        ) : (
                          <p>{content.content}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>暂无学习内容</p>
                  </div>
                )}
              </div>
            )}

            {/* 练习 */}
            {activeTab === 'exercises' && (
              <div className="space-y-4">
                {exercises.length > 0 ? (
                  exercises.map((exercise) => {
                    const isSubmitted = submittedExercises[exercise.id];
                    
                    return (
                      <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-gray-800">{exercise.title}</h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${exercise.difficulty === '简单' ? 'bg-green-100 text-green-800' : exercise.difficulty === '中等' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                            {exercise.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{exercise.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">满分: {exercise.max_score}</span>
                          {isSubmitted ? (
                            <div className="flex items-center space-x-2 text-green-500">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-medium">已完成</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleExerciseSubmit(exercise.id)}
                              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              完成练习
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>暂无练习</p>
                  </div>
                )}
              </div>
            )}

            {/* 测评 */}
            {activeTab === 'assessments' && (
              <div className="space-y-4">
                {assessments.length > 0 ? (
                  assessments.map((assessment) => {
                    const isSubmitted = submittedAssessments[assessment.id];
                    
                    return (
                      <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-gray-800">{assessment.title}</h3>
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                            测评
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{assessment.description}</p>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <span className="text-sm text-gray-500">时长: {assessment.duration_minutes}分钟</span>
                          <span className="text-sm text-gray-500">及格分数: {assessment.passing_score}</span>
                        </div>
                        {isSubmitted ? (
                          <div className="flex items-center space-x-2 text-green-500">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">已完成</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAssessmentSubmit(assessment.id)}
                            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            开始测评
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>暂无测评</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningModule;