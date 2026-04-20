import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, FileText, Code, Database, LineChart, Zap, ChevronDown, ChevronUp } from 'lucide-react';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // 资源数据
  const resources = [
    {
      id: 1,
      title: 'Pandas 基础教程',
      description: 'Pandas库的基本使用方法，包括数据读取、清洗、转换和分析',
      category: '数据处理',
      subcategory: 'Pandas',
      level: '初级',
      tags: ['pandas', '数据清洗', '数据分析'],
      link: '#',
      icon: '📊'
    },
    {
      id: 2,
      title: 'NumPy 数组操作',
      description: 'NumPy库的核心功能，包括数组创建、操作和数学计算',
      category: '数据处理',
      subcategory: 'NumPy',
      level: '初级',
      tags: ['numpy', '数组', '数学计算'],
      link: '#',
      icon: '🔢'
    },
    {
      id: 3,
      title: 'Matplotlib 数据可视化',
      description: '使用Matplotlib创建各种类型的图表，包括折线图、柱状图、散点图等',
      category: '数据可视化',
      subcategory: 'Matplotlib',
      level: '中级',
      tags: ['matplotlib', '数据可视化', '图表'],
      link: '#',
      icon: '📈'
    },
    {
      id: 4,
      title: 'Seaborn 统计图表',
      description: 'Seaborn库的高级数据可视化功能，专注于统计图表',
      category: '数据可视化',
      subcategory: 'Seaborn',
      level: '中级',
      tags: ['seaborn', '统计图表', '数据可视化'],
      link: '#',
      icon: '📊'
    },
    {
      id: 5,
      title: 'Scikit-learn 机器学习基础',
      description: 'Scikit-learn库的基本使用方法，包括数据预处理、模型训练和评估',
      category: '机器学习',
      subcategory: 'Scikit-learn',
      level: '中级',
      tags: ['scikit-learn', '机器学习', '模型训练'],
      link: '#',
      icon: '🤖'
    },
    {
      id: 6,
      title: 'TensorFlow 深度学习入门',
      description: 'TensorFlow库的基本使用方法，包括张量操作、模型构建和训练',
      category: '机器学习',
      subcategory: 'TensorFlow',
      level: '高级',
      tags: ['tensorflow', '深度学习', '神经网络'],
      link: '#',
      icon: '🧠'
    },
    {
      id: 7,
      title: 'SQL 数据库操作',
      description: 'SQL语言的基本语法和数据库操作，包括查询、插入、更新和删除',
      category: '数据库',
      subcategory: 'SQL',
      level: '初级',
      tags: ['sql', '数据库', '查询'],
      link: '#',
      icon: '🗃️'
    },
    {
      id: 8,
      title: '时间序列分析',
      description: '时间序列数据的分析方法，包括趋势分解、预测模型和异常检测',
      category: '数据分析',
      subcategory: '时间序列',
      level: '高级',
      tags: ['时间序列', '预测', '趋势分析'],
      link: '#',
      icon: '📅'
    },
    {
      id: 9,
      title: '数据清洗最佳实践',
      description: '数据清洗的常用方法和最佳实践，包括处理缺失值、异常值和重复值',
      category: '数据处理',
      subcategory: '数据清洗',
      level: '中级',
      tags: ['数据清洗', '缺失值', '异常值'],
      link: '#',
      icon: '🧹'
    },
    {
      id: 10,
      title: '特征工程入门',
      description: '特征工程的基本概念和方法，包括特征提取、选择和转换',
      category: '机器学习',
      subcategory: '特征工程',
      level: '中级',
      tags: ['特征工程', '机器学习', '数据预处理'],
      link: '#',
      icon: '🔧'
    }
  ];

  // 分类列表
  const categories = [
    { id: 'all', name: '全部资源', icon: <BookOpen className="h-5 w-5" /> },
    { id: '数据处理', name: '数据处理', icon: <Database className="h-5 w-5" /> },
    { id: '数据可视化', name: '数据可视化', icon: <LineChart className="h-5 w-5" /> },
    { id: '机器学习', name: '机器学习', icon: <Zap className="h-5 w-5" /> },
    { id: '数据库', name: '数据库', icon: <Database className="h-5 w-5" /> },
    { id: '数据分析', name: '数据分析', icon: <FileText className="h-5 w-5" /> }
  ];

  // 切换分类展开/折叠
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // 过滤资源
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 按分类分组
  const groupedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">资源中心</h1>
        <p className="text-gray-600 text-lg">
          探索Python数据分析的常用库和工具，获取详细的使用指南和最佳实践
        </p>
      </div>

      {/* 搜索和筛选 */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索资源..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 资源列表 */}
      <div className="max-w-4xl mx-auto">
        {Object.entries(groupedResources).map(([category, items]) => (
          <div key={category} className="mb-8">
            <div 
              className="flex items-center justify-between bg-light rounded-t-lg p-4 cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              <h2 className="text-xl font-semibold text-dark flex items-center gap-2">
                {categories.find(c => c.id === category)?.icon || <BookOpen className="h-5 w-5" />}
                {category}
              </h2>
              {expandedCategories[category] ? 
                <ChevronUp className="h-5 w-5 text-gray-600" /> : 
                <ChevronDown className="h-5 w-5 text-gray-600" />
              }
            </div>
            
            {expandedCategories[category] && (
              <div className="border border-t-0 border-gray-200 rounded-b-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map(resource => (
                    <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{resource.icon}</div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-dark mb-1">{resource.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {resource.subcategory}
                            </span>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              {resource.level}
                            </span>
                          </div>
                          <a 
                            href={resource.link} 
                            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                          >
                            查看详情 <Code className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 空状态 */}
        {Object.keys(groupedResources).length === 0 && (
          <div className="text-center py-12 bg-light rounded-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">未找到资源</h3>
            <p className="text-gray-500">尝试调整搜索条件或选择不同的分类</p>
          </div>
        )}
      </div>

      {/* 常用库指南 */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-dark mb-6">常用库使用指南</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🐼</div>
            <h3 className="font-semibold text-lg mb-2">Pandas</h3>
            <p className="text-gray-600 text-sm mb-4">数据处理和分析的核心库，提供DataFrame等强大的数据结构</p>
            <a href="#" className="text-primary text-sm font-medium hover:underline">查看完整指南</a>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">📈</div>
            <h3 className="font-semibold text-lg mb-2">Matplotlib</h3>
            <p className="text-gray-600 text-sm mb-4">Python的绘图库，用于创建各种静态、动态和交互式图表</p>
            <a href="#" className="text-primary text-sm font-medium hover:underline">查看完整指南</a>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="font-semibold text-lg mb-2">Scikit-learn</h3>
            <p className="text-gray-600 text-sm mb-4">机器学习库，提供分类、回归、聚类等算法和工具</p>
            <a href="#" className="text-primary text-sm font-medium hover:underline">查看完整指南</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;