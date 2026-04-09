import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { ChevronRight, Filter, BookOpen } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    // 获取课程列表
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('courses')
        .select('*');
      
      if (data) {
        setCourses(data);
        setFilteredCourses(data);
        
        // 提取所有类别和难度
        const uniqueCategories = [...new Set(data.map((course: any) => course.category))] as string[];
        const uniqueLevels = [...new Set(data.map((course: any) => course.level))] as string[];
        setCategories(uniqueCategories);
        setLevels(uniqueLevels);
      }
    };

    fetchCourses();
  }, []);

  // 筛选课程
  useEffect(() => {
    let result = courses;
    
    if (selectedCategory !== 'all') {
      result = result.filter((course) => course.category === selectedCategory);
    }
    
    if (selectedLevel !== 'all') {
      result = result.filter((course) => course.level === selectedLevel);
    }
    
    setFilteredCourses(result);
  }, [selectedCategory, selectedLevel, courses]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">课程中心</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            浏览我们的完整课程体系，找到适合你的学习路径。
          </p>
        </div>

        {/* 筛选器 */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium">筛选：</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* 类别筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">类别</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全部类别</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* 难度筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
                <select 
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全部难度</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 课程列表 */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
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
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无课程</h3>
            <p className="text-gray-600">没有符合筛选条件的课程，请尝试其他筛选选项。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;