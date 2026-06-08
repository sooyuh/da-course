import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { ChevronRight, Filter, BookOpen, Clock, Video, FileText, Award } from 'lucide-react';

// Mock课程数据
const mockCourses = [
  {
    id: '1',
    title: 'Python基础入门',
    description: '从零开始学习Python编程，掌握变量、数据类型、控制结构等基础知识，为数据分析打下坚实基础。',
    category: 'Python基础',
    level: '初级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20course%20cover%20with%20code%20and%20snake%20logo%20blue%20background&image_size=landscape_16_9',
    duration: '12小时',
    lessons: 24,
    rating: 4.9,
    students: 3256
  },
  {
    id: '2',
    title: '数据清洗实战',
    description: '学习如何处理缺失值、异常值、重复数据，掌握数据清洗的核心技巧和最佳实践。',
    category: '数据处理',
    level: '中级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20cleaning%20data%20analysis%20workflow%20blue%20gradient&image_size=landscape_16_9',
    duration: '8小时',
    lessons: 16,
    rating: 4.8,
    students: 2189
  },
  {
    id: '3',
    title: '分组聚合分析',
    description: '掌握Pandas分组聚合操作，学习数据透视表、多维度分析等高级技巧。',
    category: '数据分析',
    level: '中级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20aggregation%20grouping%20charts%20business%20intelligence&image_size=landscape_16_9',
    duration: '10小时',
    lessons: 20,
    rating: 4.7,
    students: 1856
  },
  {
    id: '4',
    title: '购物篮分析',
    description: '基于Apriori算法实现关联规则挖掘，分析商品之间的关联关系，助力营销策略优化。',
    category: '机器学习',
    level: '高级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=market%20basket%20analysis%20shopping%20cart%20data%20visualization%20purple&image_size=landscape_16_9',
    duration: '12小时',
    lessons: 24,
    rating: 4.9,
    students: 1432
  },
  {
    id: '5',
    title: '数据可视化实战',
    description: '使用Matplotlib和Seaborn创建专业的数据可视化图表，让数据讲述精彩故事。',
    category: '数据可视化',
    level: '中级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20visualization%20charts%20graphs%20colorful%20dashboard&image_size=landscape_16_9',
    duration: '10小时',
    lessons: 20,
    rating: 4.8,
    students: 2567
  },
  {
    id: '6',
    title: '探索性数据分析',
    description: '学习EDA方法论，掌握数据探索的常用技巧，发现数据中的隐藏规律。',
    category: '数据分析',
    level: '中级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=exploratory%20data%20analysis%20data%20discovery%20insights%20green&image_size=landscape_16_9',
    duration: '8小时',
    lessons: 16,
    rating: 4.6,
    students: 1923
  },
  {
    id: '7',
    title: '统计分析基础',
    description: '掌握描述性统计、假设检验、相关性分析等统计学核心概念和Python实现。',
    category: '统计分析',
    level: '中级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=statistics%20analysis%20math%20formulas%20charts%20academic&image_size=landscape_16_9',
    duration: '12小时',
    lessons: 24,
    rating: 4.7,
    students: 1654
  },
  {
    id: '8',
    title: '特征工程',
    description: '学习特征提取、特征选择、特征变换等技术，提升机器学习模型性能。',
    category: '机器学习',
    level: '高级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=feature%20engineering%20machine%20learning%20data%20processing%20orange&image_size=landscape_16_9',
    duration: '10小时',
    lessons: 20,
    rating: 4.8,
    students: 1234
  },
  {
    id: '9',
    title: '时间序列分析',
    description: '掌握时间序列数据的处理方法，学习ARIMA、指数平滑等经典预测模型。',
    category: '数据分析',
    level: '高级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=time%20series%20analysis%20trends%20forecasting%20charts%20blue%20gradient&image_size=landscape_16_9',
    duration: '14小时',
    lessons: 28,
    rating: 4.6,
    students: 987
  },
  {
    id: '10',
    title: '综合实战项目',
    description: '运用所学知识完成真实商业数据分析项目，涵盖数据获取、清洗、分析和可视化全流程。',
    category: '实战项目',
    level: '高级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20data%20analysis%20project%20dashboard%20professional%20green&image_size=landscape_16_9',
    duration: '20小时',
    lessons: 10,
    rating: 4.9,
    students: 856
  },
  {
    id: '11',
    title: 'Pandas数据处理',
    description: '深入学习Pandas库，掌握DataFrame操作、数据合并、分组聚合等核心技能。',
    category: 'Python基础',
    level: '初级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pandas%20dataframe%20python%20data%20table%20green%20blue&image_size=landscape_16_9',
    duration: '10小时',
    lessons: 20,
    rating: 4.8,
    students: 2876
  },
  {
    id: '12',
    title: '模型评估与调优',
    description: '学习模型评估指标、交叉验证、超参数调优方法，构建更优秀的机器学习模型。',
    category: '机器学习',
    level: '高级',
    cover_image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=model%20evaluation%20machine%20learning%20metrics%20purple&image_size=landscape_16_9',
    duration: '12小时',
    lessons: 24,
    rating: 4.7,
    students: 1123
  }
];

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
      
      // 如果数据库没有数据，使用mock数据
      const courseData = data && data.length > 0 ? data : mockCourses;
      
      setCourses(courseData);
      setFilteredCourses(courseData);
      
      // 提取所有类别和难度
      const uniqueCategories = [...new Set(courseData.map((course: any) => course.category))] as string[];
      const uniqueLevels = [...new Set(courseData.map((course: any) => course.level))] as string[];
      setCategories(uniqueCategories);
      setLevels(uniqueLevels);
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

  const getLevelColor = (level: string) => {
    switch(level) {
      case '初级': return 'bg-green-100 text-green-800';
      case '中级': return 'bg-blue-100 text-blue-800';
      case '高级': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">课程中心</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            浏览我们的完整课程体系，找到适合你的学习路径。
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
                <p className="text-sm text-gray-600">课程总数</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-100" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">140+</p>
                <p className="text-sm text-gray-600">视频课时</p>
              </div>
              <Video className="h-8 w-8 text-green-100" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">4.8</p>
                <p className="text-sm text-gray-600">平均评分</p>
              </div>
              <Award className="h-8 w-8 text-purple-100" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">20K+</p>
                <p className="text-sm text-gray-600">学习人数</p>
              </div>
              <FileText className="h-8 w-8 text-orange-100" />
            </div>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id} className="block group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="relative h-44 overflow-hidden">
                    {course.cover_image_url ? (
                      <img 
                        src={course.cover_image_url} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <div className={`absolute top-3 left-3 ${getLevelColor(course.level)} px-2 py-1 rounded-full text-xs font-semibold`}>
                      {course.level}
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-gray-500 mb-2 block">{course.category}</span>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Video className="h-4 w-4" />
                          <span>{course.lessons}节</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-1">
                        <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium text-gray-700">{course.rating}</span>
                      </div>
                      <div className="flex items-center text-blue-600 font-medium group-hover:underline">
                        <span>查看详情</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
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
