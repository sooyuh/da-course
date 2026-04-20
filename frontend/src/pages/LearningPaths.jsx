import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Calendar, Award, Filter, Search } from 'lucide-react';

const LearningPaths = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/learning-paths/paths');
        if (!response.ok) {
          throw new Error('获取学习路径失败');
        }
        const data = await response.json();
        setPaths(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, []);

  // 过滤和搜索路径
  const filteredPaths = paths.filter(path => {
    const matchesFilter = filter === 'all' || path.category === filter;
    const matchesSearch = path.name.toLowerCase().includes(search.toLowerCase()) || 
                         path.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 获取所有唯一的分类
  const categories = ['all', ...new Set(paths.map(path => path.category))];

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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">学习路径</h1>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            为您精心设计的Python数据分析学习路径，从入门到精通
          </p>
        </div>
      </section>

      {/* 筛选和搜索 */}
      <section className="py-8 bg-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-secondary" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? '全部分类' : category}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="搜索学习路径..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-secondary" />
            </div>
          </div>
        </div>
      </section>

      {/* 学习路径列表 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-8">推荐学习路径</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPaths.map((path) => (
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
                    查看详情 <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {filteredPaths.length === 0 && (
            <div className="text-center py-16">
              <p className="text-secondary">没有找到匹配的学习路径</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LearningPaths;