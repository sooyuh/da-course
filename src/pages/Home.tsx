import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Book, Award, TrendingUp, Users, ChevronRight, Play, Code, BarChart2, Database, Brain, Sparkles, Zap, Star, ShoppingCart, Filter, Layers, Code2 } from 'lucide-react';

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

      {/* Python基础课程特色 Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
              <Code className="h-5 w-5" />
              <span className="font-medium">热门推荐</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Python基础课程</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              从零开始，系统学习Python编程，掌握数据分析的基础技能
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 课程内容 */}
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">课程内容</h3>
                <div className="space-y-4">
                  {[
                    { icon: <Code className="h-5 w-5" />, title: 'Python基础语法', desc: '变量、数据类型、运算符、控制结构' },
                    { icon: <Database className="h-5 w-5" />, title: '数据结构', desc: '列表、元组、字典、集合' },
                    { icon: <Book className="h-5 w-5" />, title: '函数与模块', desc: '函数定义、参数传递、模块化编程' },
                    { icon: <BarChart2 className="h-5 w-5" />, title: '面向对象', desc: '类、对象、继承、多态' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <div className="text-blue-600">{item.icon}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/courses" 
                  className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>立即开始</span>
                </Link>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">12周课程</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">免费学习</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">初级难度</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 课程预览卡片 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-800 to-green-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-6">
                    <Code className="h-8 w-8" />
                    <span className="text-xl font-bold">Python基础课程</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">从零开始学Python</h3>
                  <p className="text-blue-100 mb-8">
                    适合完全零基础的学生，循序渐进地学习Python编程，为数据分析打下坚实基础
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <Book className="h-4 w-4" />
                      </div>
                      <span>24节视频课程</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <Code className="h-4 w-4" />
                      </div>
                      <span>48个编程练习</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <BarChart2 className="h-4 w-4" />
                      </div>
                      <span>6个实战项目</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white border-opacity-20">
                    <div>
                      <p className="text-blue-100 text-sm">预计学习时间</p>
                      <p className="text-2xl font-bold">48小时</p>
                    </div>
                    <Link 
                      to="/courses" 
                      className="bg-white text-blue-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      查看课程
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Python练习场入口 */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full mb-4">
              <Code2 className="h-5 w-5" />
              <span className="font-medium">立即体验</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Python 数据可视化练习场
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
              无需安装任何软件，在浏览器中直接运行 Pandas 和 NumPy，学习数据分析的乐趣！
            </p>
            <Link 
              to="/python-playground" 
              className="inline-flex items-center space-x-2 bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Play className="h-5 w-5" />
              <span>开始练习</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 数据分析AI训练平台 Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
              <Brain className="h-5 w-5" />
              <span className="font-medium">AI驱动</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">数据分析AI训练平台</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              基于Cloudflare免费资源，实现"3步认知+10个梯度项目+AI错题倒逼"的Python数据分析实操训练平台
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 核心特点 */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">核心特点</h3>
              <div className="space-y-4">
                {[
                  { icon: <Zap className="h-6 w-6" />, title: '无后端架构', desc: '基于Cloudflare Pages + Workers，零成本部署' },
                  { icon: <Brain className="h-6 w-6" />, title: 'AI陪练', desc: '豆包/OpenAI API代理，智能思路点拨和代码纠错' },
                  { icon: <Code className="h-6 w-6" />, title: '浏览器端Python', desc: 'Pyodide运行环境，无需后端服务器' },
                  { icon: <Star className="h-6 w-6" />, title: '10个梯度项目', desc: '从基础到进阶的实战项目，循序渐进' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <div className="text-purple-600">{item.icon}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 项目展示 */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">10个梯度项目</h3>
              <div className="bg-white p-6 rounded-xl shadow-sm h-full">
                <div className="space-y-3">
                  {[
                    '数据清洗实战',
                    '分组聚合分析',
                    '探索性数据分析',
                    '数据可视化',
                    '统计分析',
                    '购物篮分析',
                    '特征工程',
                    '模型评估',
                    '时间序列分析',
                    '综合实战项目'
                  ].map((project, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {index + 1}
                      </div>
                      <span className="text-gray-800">{project}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 技术架构 */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">技术架构</h3>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Code className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">前端应用</h4>
                      <p className="text-gray-600 text-sm">React + TypeScript + Tailwind CSS</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">边缘计算</h4>
                      <p className="text-gray-600 text-sm">Cloudflare Workers + KV存储</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">AI服务</h4>
                      <p className="text-gray-600 text-sm">Cloudflare AI Gateway + 豆包/OpenAI</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Database className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">数据存储</h4>
                      <p className="text-gray-600 text-sm">LocalStorage + Workers KV</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link 
              to="/courses" 
              className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>开始AI训练之旅</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 特色课程展示 Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
              <Layers className="h-5 w-5" />
              <span className="font-medium">特色课程</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">核心实战课程</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              掌握数据分析核心技能，从数据清洗到高级分析，全方位提升实战能力
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 数据清洗实战课程 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10">
                <div className="bg-white bg-opacity-20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Filter className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">数据清洗实战</h3>
                <p className="text-blue-100 mb-6">
                  学习如何处理缺失值、异常值、重复数据，掌握数据清洗的核心技巧和最佳实践
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>缺失值处理与填充策略</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>异常值检测与处理</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>数据格式标准化</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>数据质量评估与报告</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20">
                  <div>
                    <p className="text-blue-100 text-sm">课程时长</p>
                    <p className="text-xl font-bold">8小时</p>
                  </div>
                  <Link 
                    to="/courses" 
                    className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    查看课程
                  </Link>
                </div>
              </div>
            </div>

            {/* 分组聚合分析课程 */}
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-8 text-white relative overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10">
                <div className="bg-white bg-opacity-20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Layers className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">分组聚合分析</h3>
                <p className="text-green-100 mb-6">
                  掌握Pandas分组聚合操作，学习数据透视表、多维度分析等高级技巧
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>groupby分组操作</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>聚合函数应用</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>数据透视表制作</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>多维度交叉分析</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20">
                  <div>
                    <p className="text-green-100 text-sm">课程时长</p>
                    <p className="text-xl font-bold">10小时</p>
                  </div>
                  <Link 
                    to="/courses" 
                    className="bg-white text-green-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    查看课程
                  </Link>
                </div>
              </div>
            </div>

            {/* 购物篮分析课程 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10">
                <div className="bg-white bg-opacity-20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">购物篮分析</h3>
                <p className="text-purple-100 mb-6">
                  基于Apriori算法实现关联规则挖掘，分析商品之间的关联关系，助力营销策略优化
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>关联规则基础理论</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Apriori算法实现</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>支持度与置信度分析</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>实战案例与营销建议</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20">
                  <div>
                    <p className="text-purple-100 text-sm">课程时长</p>
                    <p className="text-xl font-bold">12小时</p>
                  </div>
                  <Link 
                    to="/courses" 
                    className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    查看课程
                  </Link>
                </div>
              </div>
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