import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ArrowUpDown, ChevronDown, Search } from 'lucide-react';

const Projects = () => {
  // 模拟项目数据
  const projectsData = [
    {
      id: 1,
      title: '电商销售数据清洗与质量诊断',
      description: '对电商销售数据进行全面清洗和质量诊断，掌握数据预处理核心技能',
      difficulty: '入门',
      category: '数据清洗',
      duration: '4小时',
      popularity: 95,
    },
    {
      id: 2,
      title: '用户行为日志分析与漏斗转化',
      description: '分析用户行为并构建转化漏斗，提升用户转化效率',
      difficulty: '中级',
      category: '用户分析',
      duration: '6小时',
      popularity: 88,
    },
    {
      id: 3,
      title: '商品销售趋势分析与库存预警',
      description: '分析销售趋势并建立库存预警机制，优化库存管理',
      difficulty: '中级',
      category: '销售分析',
      duration: '5小时',
      popularity: 82,
    },
    {
      id: 4,
      title: '购物篮分析与关联规则挖掘',
      description: '发现商品之间的关联规律，优化捆绑销售策略',
      difficulty: '中级',
      category: '数据挖掘',
      duration: '6小时',
      popularity: 79,
    },
    {
      id: 5,
      title: 'RFM用户价值分层与精细化运营',
      description: '建立用户价值分层体系，实现差异化运营',
      difficulty: '中级',
      category: '用户分析',
      duration: '5小时',
      popularity: 85,
    },
    {
      id: 6,
      title: '用户留存分析与复购行为预测',
      description: '分析用户复购行为模式，识别影响复购的关键因素',
      difficulty: '中级',
      category: '用户分析',
      duration: '6小时',
      popularity: 81,
    },
    {
      id: 7,
      title: '用户画像构建与精准营销标签体系',
      description: '构建完整的用户画像标签体系，为精准营销提供数据支撑',
      difficulty: '高级',
      category: '用户分析',
      duration: '7小时',
      popularity: 78,
    },
    {
      id: 8,
      title: '电商用户聚类分析与客户分群',
      description: '使用K-Means聚类对用户进行精细群体划分',
      difficulty: '高级',
      category: '数据挖掘',
      duration: '8小时',
      popularity: 76,
    },
    {
      id: 9,
      title: '时间序列分析与销售预测',
      description: '使用时间序列分析方法预测未来销售量',
      difficulty: '高级',
      category: '预测分析',
      duration: '7小时',
      popularity: 83,
    },
    {
      id: 10,
      title: 'AI增强的电商用户价值分析系统',
      description: '整合所学技能，构建完整的用户价值分析系统',
      difficulty: '高级',
      category: '综合实战',
      duration: '10小时',
      popularity: 90,
    },
  ];

  const [projects, setProjects] = useState(projectsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('全部');
  const [category, setCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('popularity');

  // 筛选和排序项目
  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficulty === '全部' || project.difficulty === difficulty;
      const matchesCategory = category === '全部' || project.category === category;
      return matchesSearch && matchesDifficulty && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popularity') {
        return b.popularity - a.popularity;
      } else if (sortBy === 'duration') {
        return parseInt(a.duration) - parseInt(b.duration);
      } else if (sortBy === 'difficulty') {
        const difficultyOrder = { '入门': 1, '中级': 2, '高级': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      return 0;
    });

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">数据分析项目</h1>

        {/* 搜索和筛选 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="text"
                placeholder="搜索项目..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => {
                    // 这里可以添加下拉菜单逻辑
                  }}
                >
                  <Filter className="h-4 w-4 text-secondary" />
                  筛选
                  <ChevronDown className="h-4 w-4 text-secondary" />
                </button>
              </div>
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => {
                    // 这里可以添加下拉菜单逻辑
                  }}
                >
                  <ArrowUpDown className="h-4 w-4 text-secondary" />
                  排序
                  <ChevronDown className="h-4 w-4 text-secondary" />
                </button>
              </div>
            </div>
          </div>

          {/* 筛选选项 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">难度</label>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="全部">全部</option>
                <option value="入门">入门</option>
                <option value="中级">中级</option>
                <option value="高级">高级</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">分类</label>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="全部">全部</option>
                <option value="数据清洗">数据清洗</option>
                <option value="用户分析">用户分析</option>
                <option value="销售分析">销售分析</option>
                <option value="数据挖掘">数据挖掘</option>
                <option value="预测分析">预测分析</option>
                <option value="综合实战">综合实战</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">排序</label>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">热度</option>
                <option value="duration">时长</option>
                <option value="difficulty">难度</option>
              </select>
            </div>
          </div>
        </div>

        {/* 项目列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProjects.map((project) => (
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
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-secondary">预计时长: {project.duration}</span>
                <span className="text-sm text-secondary">热度: {project.popularity}%</span>
              </div>
              <Link to={`/projects/${project.id}`} className="btn-primary w-full text-center">
                查看详情
              </Link>
            </div>
          ))}
        </div>

        {/* 分页 */}
        <div className="mt-10 flex justify-center">
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-light">上一页</button>
            <button className="px-4 py-2 border border-primary bg-primary text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-light">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-light">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;