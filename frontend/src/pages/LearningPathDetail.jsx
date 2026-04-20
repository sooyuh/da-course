import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Calendar, Award, CheckCircle, Clock, BookOpen } from 'lucide-react';

const LearningPathDetail = () => {
  const { id } = useParams();
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPathDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/learning-paths/paths/${id}`);
        if (!response.ok) {
          throw new Error('获取学习路径详情失败');
        }
        const data = await response.json();
        setPath(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPathDetail();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-16">加载中...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-16">错误: {error}</div>;
  }

  if (!path) {
    return <div className="container mx-auto px-4 py-16">学习路径不存在</div>;
  }

  return (
    <div className="min-h-screen">
      {/* 页面标题 */}
      <section className="bg-gradient-to-r from-primary/90 to-primary py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{path.name}</h1>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            {path.description}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{path.total_duration} 小时</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>{path.total_steps} 个项目</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>{path.difficulty} 难度</span>
            </div>
          </div>
        </div>
      </section>

      {/* 学习路径步骤 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-8">学习步骤</h2>
          <div className="space-y-8">
            {path.steps.map((step, index) => (
              <div key={step.id} className="card relative">
                {/* 步骤编号 */}
                <div className="absolute left-0 top-0 -translate-x-1/2 mt-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {step.step_order}
                  </div>
                  {index < path.steps.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 absolute top-8 left-1/2 -translate-x-1/2"></div>
                  )}
                </div>
                
                {/* 步骤内容 */}
                <div className="pl-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{step.project_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${step.project_difficulty === '入门' ? 'bg-green-100 text-green-800' : step.project_difficulty === '中级' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      {step.project_difficulty}
                    </span>
                  </div>
                  <p className="text-secondary mb-4">{step.project_description}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-secondary">{step.project_duration} 小时</span>
                    </div>
                  </div>
                  {step.description && (
                    <p className="text-secondary mb-4">{step.description}</p>
                  )}
                  <Link to={`/projects/${step.project_id}`} className="btn-primary inline-block">
                    开始学习 <ChevronRight className="h-4 w-4 inline ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 路径完成情况 */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-8">路径完成情况</h2>
          <div className="card p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">总体进度</h3>
                <p className="text-secondary">已完成 0/{path.total_steps} 个项目</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="w-full md:w-64 bg-gray-200 rounded-full h-4">
                  <div className="bg-primary h-4 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <p className="text-right text-sm text-secondary mt-2">0%</p>
              </div>
            </div>
            <div className="space-y-2">
              {path.steps.map((step) => (
                <div key={step.id} className="flex items-center gap-4">
                  <CheckCircle className="h-5 w-5 text-gray-300" />
                  <span className="text-secondary">{step.project_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningPathDetail;