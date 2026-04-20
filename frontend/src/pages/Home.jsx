import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BarChart3, Users, TrendingUp, Calendar, Award, ChevronRight } from 'lucide-react';

const Home = () => {
  // 模拟项目数据
  const projects = [
    {
      id: 1,
      title: '电商销售数据清洗与质量诊断',
      description: '对电商销售数据进行全面清洗和质量诊断，掌握数据预处理核心技能',
      difficulty: '入门',
      category: '数据清洗',
      progress: 85,
    },
    {
      id: 2,
      title: '用户行为日志分析与漏斗转化',
      description: '分析用户行为并构建转化漏斗，提升用户转化效率',
      difficulty: '中级',
      category: '用户分析',
      progress: 72,
    },
    {
      id: 3,
      title: '商品销售趋势分析与库存预警',
      description: '分析销售趋势并建立库存预警机制，优化库存管理',
      difficulty: '中级',
      category: '销售分析',
      progress: 65,
    },
  ];

  // 学习路径数据
  const learningPaths = [
    {
      id: 1,
      title: '数据分析师入门路径',
      description: '从基础到进阶，掌握数据分析核心技能',
      steps: 5,
      duration: '8周',
    },
    {
      id: 2,
      title: 'Python数据分析实战路径',
      description: '通过实战项目，提升Python数据分析能力',
      steps: 8,
      duration: '12周',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* 英雄区 */}
      <section className="bg-gradient-to-r from-primary/90 to-primary py-24 md:py-32">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            掌握Python数据分析技能
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            通过10个实战项目，从数据清洗到机器学习，全面提升你的数据分析能力
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/projects" className="btn-primary bg-white text-primary hover:bg-gray-100">
              浏览项目
            </Link>
            <Link to="/register" className="btn-secondary bg-transparent border-white text-white hover:bg-white/10">
              开始学习
            </Link>
          </div>
        </div>
      </section>

      {/* 项目分类 */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="section-title">项目分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">数据清洗</h3>
              <p className="text-secondary mb-4">掌握数据预处理、清洗和质量诊断技能</p>
              <Link to="/projects" className="text-primary font-medium flex items-center justify-center gap-2">
                查看项目 <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="card text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">用户分析</h3>
              <p className="text-secondary mb-4">分析用户行为，优化用户体验和转化</p>
              <Link to="/projects" className="text-primary font-medium flex items-center justify-center gap-2">
                查看项目 <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="card text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">销售分析</h3>
              <p className="text-secondary mb-4">分析销售趋势，优化库存和营销策略</p>
              <Link to="/projects" className="text-primary font-medium flex items-center justify-center gap-2">
                查看项目 <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 热门项目 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">热门项目</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.difficulty === '入门' ? 'bg-green-100 text-green-800' : project.difficulty === '中级' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                    {project.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-light text-secondary">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-secondary mb-4">{project.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>完成进度</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-light rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <Link to={`/projects/${project.id}`} className="btn-primary w-full text-center">
                  开始学习
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/projects" className="btn-secondary">
              查看全部项目
            </Link>
          </div>
        </div>
      </section>

      {/* 学习路径 */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="section-title">学习路径</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {learningPaths.map((path) => (
              <div key={path.id} className="card flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{path.title}</h3>
                    <p className="text-secondary">{path.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-secondary">{path.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-secondary">{path.steps} 个项目</span>
                    </div>
                  </div>
                  <Link to="/projects" className="text-primary font-medium flex items-center gap-2">
                    开始学习 <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 号召性用语 */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好提升你的数据分析技能了吗？</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            加入我们的学习社区，通过实战项目掌握Python数据分析的核心技能
          </p>
          <Link to="/register" className="btn-primary bg-white text-primary hover:bg-gray-100">
            立即注册
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;