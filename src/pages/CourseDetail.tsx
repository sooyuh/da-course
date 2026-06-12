import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, PlayCircle, Book, CheckCircle, Clock, Star, Users, Award, Sparkles } from 'lucide-react';

// Mock课程详细数据（确保所有课程都有完整内容和可靠的封面图片）
const mockCoursesDetail: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Python基础入门',
    description: '从零开始学习Python编程，掌握变量、数据类型、控制结构等基础知识，为数据分析打下坚实基础。本课程从Python语言基础讲起，配合大量编程实例，让你快速掌握Python语法。',
    category: 'Python基础',
    level: '初级',
    cover_image_url: 'https://picsum.photos/seed/python1/800/500',
    duration: '12小时',
    lessons: 24,
    rating: 4.9,
    students: 3256,
    modules: [
      { id: 'm1-1', title: 'Python环境搭建', description: '安装Python和VSCode开发环境，配置Python解释器，创建第一个Python程序', order: 1 },
      { id: 'm1-2', title: '变量与数据类型', description: '学习整数、浮点数、字符串等基本数据类型，掌握变量定义和命名规则', order: 2 },
      { id: 'm1-3', title: '运算符与表达式', description: '掌握算术、比较、逻辑、赋值运算符，学习表达式的计算', order: 3 },
      { id: 'm1-4', title: '控制结构', description: 'if-else条件语句，for循环和while循环，continue和break关键字', order: 4 },
      { id: 'm1-5', title: '函数基础', description: '函数的定义、参数、返回值，理解函数的作用，掌握参数传递', order: 5 },
      { id: 'm1-6', title: '数据结构', description: '列表、元组、字典、集合的创建和操作，掌握常用的内置方法', order: 6 }
    ],
    objectives: ['掌握Python基础语法和编程技巧', '理解变量和数据类型的使用', '能够独立编写简单的Python程序', '为后续数据分析学习打下坚实基础'],
    suitable: ['零基础编程学习者', '希望转行数据分析的职场人员', '对编程感兴趣的学生和爱好者'],
    requirements: ['无编程经验要求', '具备基本的计算机操作能力和文件管理知识', '能够安装和使用软件']
  },
  '2': {
    id: '2',
    title: '数据清洗实战',
    description: '学习如何处理缺失值、异常值、重复数据，掌握数据清洗的核心技巧和最佳实践。本课程通过真实案例讲解，让你掌握清洗各种脏数据的能力。',
    category: '数据处理',
    level: '中级',
    cover_image_url: 'https://picsum.photos/seed/dataclean/800/500',
    duration: '8小时',
    lessons: 16,
    rating: 4.8,
    students: 2189,
    modules: [
      { id: 'm2-1', title: '数据质量评估', description: '识别和评估数据质量问题，学习数据质量维度和评估指标', order: 1 },
      { id: 'm2-2', title: '缺失值处理', description: '处理缺失值的各种方法，包括删除、填充、插值等策略', order: 2 },
      { id: 'm2-3', title: '异常值检测', description: '识别和处理异常值，学习IQR、Z-score、DBSCAN等检测方法', order: 3 },
      { id: 'm2-4', title: '重复数据处理', description: '检测和删除重复记录，掌握duplicated和drop_duplicates方法', order: 4 },
      { id: 'm2-5', title: '数据格式标准化', description: '统一数据格式和编码，处理日期时间、字符串规范化等', order: 5 },
      { id: 'm2-6', title: '数据清洗实战项目', description: '综合实战练习，清洗销售数据集并生成清洗报告', order: 6 }
    ],
    objectives: ['掌握数据质量评估方法和指标', '能够熟练处理各种数据问题', '熟练使用Pandas进行数据清洗', '独立完成数据清洗项目并生成报告'],
    suitable: ['已掌握Python基础的学员', '数据分析师', '需要处理数据的职场人员'],
    requirements: ['具备Python基础知识', '了解基本的数据概念和Pandas库', '有基本的统计学基础']
  },
  '3': {
    id: '3',
    title: '分组聚合分析',
    description: '掌握Pandas分组聚合操作，学习数据透视表、多维度分析等高级技巧。本课程将教你如何从海量数据中快速提取有价值的信息。',
    category: '数据分析',
    level: '中级',
    cover_image_url: 'https://picsum.photos/seed/groupby2/800/500',
    duration: '10小时',
    lessons: 20,
    rating: 4.7,
    students: 1856,
    modules: [
      { id: 'm3-1', title: 'groupby基础', description: '分组聚合的基本操作，理解分组-应用-合并的流程', order: 1 },
      { id: 'm3-2', title: '聚合函数', description: 'sum、mean、count、min、max等聚合函数的应用', order: 2 },
      { id: 'm3-3', title: '多列分组', description: '多列分组和层次索引，掌握groupby的高级用法', order: 3 },
      { id: 'm3-4', title: '数据透视表', description: '创建和使用数据透视表（pivot_table），类似Excel透视表', order: 4 },
      { id: 'm3-5', title: '交叉分析', description: '多维度交叉分析，学习crosstab和交叉制表', order: 5 },
      { id: 'm3-6', title: '实战案例分析', description: '销售数据分析实战，生成多维度分析报告', order: 6 }
    ],
    objectives: ['熟练掌握groupby分组操作', '灵活使用各种聚合函数', '能够创建专业的数据透视表', '具备多维度数据分析能力'],
    suitable: ['已掌握Pandas基础的学员', '数据分析师和业务分析人员', '希望提升数据分析能力的职场人员'],
    requirements: ['熟悉Python和Pandas基础知识', '了解DataFrame基本操作和索引', '有基本的统计学知识']
  },
  '4': {
    id: '4',
    title: '购物篮分析',
    description: '基于Apriori算法实现关联规则挖掘，分析商品之间的关联关系，助力营销策略优化。本课程将从理论到实践，全面讲解购物篮分析。',
    category: '机器学习',
    level: '高级',
    cover_image_url: 'https://picsum.photos/seed/mbasket3/800/500',
    duration: '12小时',
    lessons: 24,
    rating: 4.9,
    students: 1432,
    modules: [
      { id: 'm4-1', title: '关联规则基础', description: '关联规则的基本概念，理解购物篮分析应用场景', order: 1 },
      { id: 'm4-2', title: 'Apriori算法原理', description: 'Apriori算法详解，理解频繁项集和关联规则生成', order: 2 },
      { id: 'm4-3', title: '支持度与置信度', description: '支持度、置信度、提升度等评估指标的计算方法', order: 3 },
      { id: 'm4-4', title: 'Python实现', description: '使用Python和mlxtend库实现关联规则挖掘', order: 4 },
      { id: 'm4-5', title: '实战案例', description: '零售电商数据分析实战，挖掘商品关联规律', order: 5 },
      { id: 'm4-6', title: '营销应用', description: '关联规则在商品推荐、促销搭配中的应用', order: 6 }
    ],
    objectives: ['理解关联规则挖掘原理和应用场景', '掌握Apriori算法实现和优化', '能够进行购物篮分析并生成规则', '应用分析结果优化电商营销策略'],
    suitable: ['已掌握Python基础的学员', '数据分析师和电商运营人员', '希望提升业务洞察能力的职场人员'],
    requirements: ['具备Python编程能力和Pandas基础', '了解数据分析基本概念', '有一定的电商业务理解']
  },
  '5': {
    id: '5',
    title: '数据可视化实战',
    description: '使用Matplotlib和Seaborn创建专业的数据可视化图表，让数据讲述精彩故事。本课程从基础绘图到高级定制，全面掌握可视化技能。',
    category: '数据可视化',
    level: '中级',
    cover_image_url: 'https://picsum.photos/seed/visual5/800/500',
    duration: '10小时',
    lessons: 20,
    rating: 4.8,
    students: 2567,
    modules: [
      { id: 'm5-1', title: 'Matplotlib基础', description: 'Matplotlib入门，掌握绘图基本流程和概念', order: 1 },
      { id: 'm5-2', title: '常用图表类型', description: '柱状图、折线图、散点图、饼图、热力图等的绘制', order: 2 },
      { id: 'm5-3', title: 'Seaborn进阶', description: 'Seaborn统计图表，掌握箱线图、小提琴图、分布图等', order: 3 },
      { id: 'm5-4', title: '图表优化', description: '美化图表和自定义样式，添加标题、标签、图例', order: 4 },
      { id: 'm5-5', title: '交互式图表', description: '使用Plotly创建交互图表，支持缩放、悬停等操作', order: 5 },
      { id: 'm5-6', title: 'Dashboard实战', description: '数据可视化Dashboard制作，组合多个图表进行数据故事讲述', order: 6 }
    ],
    objectives: ['掌握Matplotlib和Seaborn基础', '能够创建各种常用数据可视化图表', '熟练美化图表和自定义样式', '制作交互式图表和Dashboard报告'],
    suitable: ['数据分析师和数据科学家', '需要展示数据洞察的职场人员', '对数据可视化感兴趣的学习者'],
    requirements: ['具备Python基础和Pandas基础知识', '了解基本的数据分析概念', '有一定的审美和设计能力']
  },
  '6': {
    id: '6',
    title: '探索性数据分析',
    description: '学习EDA方法论，掌握数据探索的常用技巧，发现数据中的隐藏规律。本课程将教你如何在建模之前深入理解数据。',
    category: '数据分析',
    level: '中级',
    cover_image_url: 'https://picsum.photos/seed/eda6/800/500',
    duration: '8小时',
    lessons: 16,
    rating: 4.6,
    students: 1923,
    modules: [
      { id: 'm6-1', title: 'EDA概述', description: '探索性数据分析简介，理解EDA的价值和流程', order: 1 },
      { id: 'm6-2', title: '描述性统计', description: '数据的统计特征分析，均值、中位数、标准差等', order: 2 },
      { id: 'm6-3', title: '分布分析', description: '数据的分布特征，正态分布、偏态分布等识别', order: 3 },
      { id: 'm6-4', title: '相关性分析', description: '变量之间的关系识别，学习相关系数和热力图', order: 4 },
      { id: 'm6-5', title: '可视化探索', description: '用图表发现数据规律，绘图、分布图、箱线图等', order: 5 },
      { id: 'm6-6', title: '实战项目', description: '综合实战练习，对真实数据集进行完整EDA分析', order: 6 }
    ],
    objectives: ['理解EDA方法论和流程', '掌握描述性统计和数据解读', '能够进行相关性分析和识别变量关系', '用可视化方法探索数据并生成洞察'],
    suitable: ['数据分析师和数据科学家', '需要深入了解数据的职场人员', '希望提升数据洞察能力的学习者'],
    requirements: ['具备Python和Pandas基础知识', '了解基本的统计学概念和数据可视化', '有一定的数据分析思维']
  },
  '7': {
    id: '7',
    title: '统计分析基础',
    description: '掌握描述性统计、假设检验、相关性分析等统计学核心概念和Python实现。本课程从理论到实践，让你掌握数据分析必备的统计学工具。',
    category: '统计分析',
    level: '中级',
    cover_image_url: 'https://picsum.photos/seed/stats7/800/500',
    duration: '12小时',
    lessons: 24,
    rating: 4.7,
    students: 1654,
    modules: [
      { id: 'm7-1', title: '描述性统计', description: '均值、方差、标准差、分位数等统计量的计算', order: 1 },
      { id: 'm7-2', title: '概率分布', description: '常见概率分布，正态分布、二项分布、泊松分布', order: 2 },
      { id: 'm7-3', title: '假设检验', description: 't检验、方差分析、卡方检验等假设检验方法', order: 3 },
      { id: 'm7-4', title: '相关性分析', description: '相关系数和回归分析，学习Pearson和Spearman相关', order: 4 },
      { id: 'm7-5', title: 'Python统计实现', description: '使用SciPy和statsmodels进行统计分析', order: 5 },
      { id: 'm7-6', title: '实战应用', description: '统计分析实战应用，A/B测试和显著性检验', order: 6 }
    ],
    objectives: ['掌握统计学基本概念和方法', '能够进行假设检验和显著性分析', '理解相关性分析和回归方法', '使用Python进行专业的统计分析'],
    suitable: ['数据分析师和数据科学家', '需要统计学背景的职场人员', '希望提升数据建模能力的学习者'],
    requirements: ['具备数学基础和Python编程基础', '了解基本的编程概念和Pandas', '有一定的逻辑思维能力']
  },
  '8': {
    id: '8',
    title: '特征工程',
    description: '学习特征提取、特征选择、特征变换等技术，提升机器学习模型性能。特征工程决定模型上限，本课程教你如何做好特征工程。',
    category: '机器学习',
    level: '高级',
    cover_image_url: 'https://picsum.photos/seed/feature8/800/500',
    duration: '10小时',
    lessons: 20,
    rating: 4.8,
    students: 1234,
    modules: [
      { id: 'm8-1', title: '特征提取', description: '从原始数据中提取特征，文本、时间、类别等特征提取', order: 1 },
      { id: 'm8-2', title: '特征选择', description: '选择最重要的特征，学习方差选择、相关性选择等方法', order: 2 },
      { id: 'm8-3', title: '特征变换', description: '标准化、归一化、对数变换等特征变换方法', order: 3 },
      { id: 'm8-4', title: '类别特征编码', description: '独热编码、标签编码、目标编码等类别特征处理方法', order: 4 },
      { id: 'm8-5', title: '特征构建', description: '创建新特征，特征组合、多项式特征、交互特征', order: 5 },
      { id: 'm8-6', title: '实战项目', description: '特征工程综合实战，对Kaggle数据集进行特征工程优化模型', order: 6 }
    ],
    objectives: ['掌握特征提取和选择技术', '能够进行有效的特征变换和编码', '熟练使用sklearn的特征工程工具', '通过特征工程显著提升机器学习模型性能'],
    suitable: ['数据科学家和机器学习工程师', '希望提升模型性能的分析师', '准备参加数据竞赛的学习者'],
    requirements: ['具备Python和机器学习基础知识', '了解常见的机器学习算法和sklearn库', '有一定的数学基础和数据理解']
  },
  '9': {
    id: '9',
    title: '时间序列分析',
    description: '掌握时间序列数据的处理方法，学习ARIMA、指数平滑等经典预测模型。本课程让你掌握从数据处理到模型预测的完整流程。',
    category: '数据分析',
    level: '高级',
    cover_image_url: 'https://picsum.photos/seed/timeseries9/800/500',
    duration: '14小时',
    lessons: 28,
    rating: 4.6,
    students: 987,
    modules: [
      { id: 'm9-1', title: '时间序列基础', description: '时间序列的基本概念，趋势、季节性、周期性识别', order: 1 },
      { id: 'm9-2', title: '数据预处理', description: '时间序列数据处理，缺失值填充、平滑、重采样', order: 2 },
      { id: 'm9-3', title: '趋势分析', description: '识别和分析趋势，移动平均、指数平滑等方法', order: 3 },
      { id: 'm9-4', title: '季节性分析', description: '处理季节性数据，时间分解、季节指数计算', order: 4 },
      { id: 'm9-5', title: '预测模型', description: 'ARIMA、指数平滑、Prophet等经典预测模型应用', order: 5 },
      { id: 'm9-6', title: '实战项目', description: '时间序列预测实战，销售预测和股价预测案例', order: 6 }
    ],
    objectives: ['理解时间序列基本概念和特征', '掌握数据预处理和趋势分析方法', '能够进行季节性分析和时间分解', '使用ARIMA等模型进行精确预测'],
    suitable: ['数据分析师和数据科学家', '需要进行预测的职场人员', '对金融和销售分析感兴趣的学习者'],
    requirements: ['具备Python和Pandas基础知识', '了解基本的统计学概念和方法', '有一定的数据处理和建模经验']
  },
  '10': {
    id: '10',
    title: '综合实战项目',
    description: '运用所学知识完成真实商业数据分析项目，涵盖数据获取、清洗、分析和可视化全流程。本课程将让你体验完整的真实数据分析项目。',
    category: '实战项目',
    level: '高级',
    cover_image_url: 'https://picsum.photos/seed/project10/800/500',
    duration: '20小时',
    lessons: 10,
    rating: 4.9,
    students: 856,
    modules: [
      { id: 'm10-1', title: '项目概述', description: '了解项目需求和目标，明确业务问题和数据来源', order: 1 },
      { id: 'm10-2', title: '数据获取', description: '从各种来源获取数据，数据库、API、爬虫、文件', order: 2 },
      { id: 'm10-3', title: '数据清洗', description: '处理数据质量问题，缺失值、异常值、重复数据处理', order: 3 },
      { id: 'm10-4', title: '数据分析', description: '进行深入的数据分析，探索性分析和假设检验', order: 4 },
      { id: 'm10-5', title: '数据可视化', description: '创建可视化图表，直观展示分析结果和洞察', order: 5 },
      { id: 'm10-6', title: '报告撰写', description: '撰写分析报告，形成专业的数据分析文档供决策参考', order: 6 }
    ],
    objectives: ['掌握数据分析全流程和项目管理方法', '能够独立完成从数据获取到分析报告的完整项目', '具备数据可视化和专业报告能力', '积累真实项目经验和作品案例'],
    suitable: ['希望成为数据分析师的学员', '需要完成实际项目的分析师', '希望提升实战能力的职场人员'],
    requirements: ['已掌握Python数据分析技能和常用库', '了解基本的数据分析流程和方法', '有一定的数据敏感度和业务理解']
  },
  '11': {
    id: '11',
    title: 'Pandas数据处理',
    description: '深入学习Pandas库，掌握DataFrame操作、数据合并、分组聚合等核心技能。Pandas是数据分析的瑞士军刀，本课程让你成为Pandas高手。',
    category: 'Python基础',
    level: '初级',
    cover_image_url: 'https://picsum.photos/seed/pandas11/800/500',
    duration: '10小时',
    lessons: 20,
    rating: 4.8,
    students: 2876,
    modules: [
      { id: 'm11-1', title: 'Pandas入门', description: '了解Pandas数据结构，Series和DataFrame的基本概念', order: 1 },
      { id: 'm11-2', title: 'DataFrame操作', description: 'DataFrame的基本操作，索引、切片、过滤、修改', order: 2 },
      { id: 'm11-3', title: '数据选择', description: '选择数据的方法，loc、iloc、布尔索引的灵活应用', order: 3 },
      { id: 'm11-4', title: '数据合并', description: '合并和连接数据，merge、join、concat、append', order: 4 },
      { id: 'm11-5', title: '数据聚合', description: '分组和聚合操作，groupby、agg、transform', order: 5 },
      { id: 'm11-6', title: '数据透视表', description: '创建和使用透视表，pivot_table和交叉表', order: 6 }
    ],
    objectives: ['精通Pandas的基本操作和常用方法', '熟练进行数据选择、过滤和修改', '能够合并、连接和重塑数据集', '独立完成复杂的数据处理任务'],
    suitable: ['Python基础学员和数据分析师', '需要处理大量数据的职场人员', '希望提升数据处理能力的学习者'],
    requirements: ['具备Python基础和编程知识', '了解基本的数据概念和结构', '有一定的数据分析需求']
  },
  '12': {
    id: '12',
    title: '模型评估与调优',
    description: '学习模型评估指标、交叉验证、超参数调优方法，构建更优秀的机器学习模型。本课程教你如何让模型性能达到最大化。',
    category: '机器学习',
    level: '高级',
    cover_image_url: 'https://picsum.photos/seed/model12/800/500',
    duration: '12小时',
    lessons: 24,
    rating: 4.7,
    students: 1123,
    modules: [
      { id: 'm12-1', title: '评估指标', description: '准确率、精确率、召回率、F1分数、AUC/ROC', order: 1 },
      { id: 'm12-2', title: '交叉验证', description: 'K折交叉验证，sklearn的cross_val_score应用', order: 2 },
      { id: 'm12-3', title: '学习曲线', description: '分析模型表现，诊断过拟合和欠拟合问题', order: 3 },
      { id: 'm12-4', title: '超参数调优', description: '网格搜索GridSearchCV、随机搜索RandomizedSearchCV', order: 4 },
      { id: 'm12-5', title: '模型选择', description: '选择最佳模型，比较不同算法的性能', order: 5 },
      { id: 'm12-6', title: '实战项目', description: '模型评估综合实战，对比多种模型并优化最佳模型', order: 6 }
    ],
    objectives: ['掌握各种机器学习评估指标和含义', '能够进行交叉验证和模型性能评估', '熟练使用超参数调优方法进行模型优化', '综合比较选择最佳模型并进行集成'],
    suitable: ['数据科学家和机器学习工程师', '希望提升模型性能的分析师', '准备数据竞赛或高级项目的学习者'],
    requirements: ['具备机器学习基础知识', '了解常见的机器学习算法和sklearn库', '有一定的建模实践经验']
  }
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();

  // 直接从mock数据获取，不等待网络请求
  const course = useMemo(() => id ? mockCoursesDetail[id] : null, [id]);
  const modules = course?.modules || [];

  const getModuleProgress = (moduleId: string) => {
    // 模拟进度（实际使用中应该从本地存储获取）
    return 0;
  };

  const isModuleCompleted = (moduleId: string) => {
    return false;
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case '初级': return 'bg-green-100 text-green-800';
      case '中级': return 'bg-blue-100 text-blue-800';
      case '高级': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 不使用loading，直接显示内容

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Book className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">课程不存在</h3>
          <p className="text-gray-400 mb-6">该课程可能已被删除或不存在。</p>
          <Link 
            to="/courses" 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
          >
            <ChevronRight className="h-5 w-5" />
            <span>返回课程列表</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-12">
      <div className="container mx-auto px-4">
        {/* 课程头部 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden mb-8 border border-white/20">
          <div className="md:flex">
            <div className="md:w-2/5">
              <div className="relative h-64 md:h-full">
                {course.cover_image_url ? (
                  <img 
                    src={course.cover_image_url} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Book className="h-20 w-20 text-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`${getLevelColor(course.level)} px-3 py-1 rounded-full text-sm font-semibold`}>
                      {course.level}
                    </span>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                      {course.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-3/5 p-6 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-gray-300 mb-6 text-lg">{course.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <Clock className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                  <p className="text-white font-semibold">{course.duration}</p>
                  <p className="text-gray-400 text-xs">课程时长</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <Book className="h-6 w-6 text-green-400 mx-auto mb-1" />
                  <p className="text-white font-semibold">{course.lessons}节</p>
                  <p className="text-gray-400 text-xs">课时数</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-white font-semibold">{course.rating}</span>
                  </div>
                  <p className="text-gray-400 text-xs">课程评分</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Users className="h-6 w-6 text-purple-400" />
                    <span className="text-white font-semibold">{course.students.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-400 text-xs">学习人数</p>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                <PlayCircle className="h-5 w-5" />
                <span>开始学习</span>
              </button>
            </div>
          </div>
        </div>

        {/* 课程模块 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Book className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">课程模块</h2>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">共{modules.length}个模块</span>
          </div>
          
          <div className="space-y-4">
            {modules.map((module, index) => {
              const progress = getModuleProgress(module.id);
              const completed = isModuleCompleted(module.id);
              
              return (
                <div key={module.id} className="bg-white/5 hover:bg-white/10 rounded-xl p-5 transition-all duration-300 border border-white/10 hover:border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/20 text-white'
                    }`}>
                      {completed ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{module.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{module.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                completed ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                              }`}
                              style={{ width: `${completed ? 100 : progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-gray-400 text-sm whitespace-nowrap">
                          {completed ? '已完成' : `${progress}%`}
                        </span>
                      </div>
                    </div>
                    <Link 
                      to={`/learning/${course.id}/${module.id}`}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        completed 
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                      }`}
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>{completed ? '复习' : '开始学习'}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 课程信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 课程目标 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">课程目标</h2>
            </div>
            <ul className="space-y-3">
              {(course.objectives || []).map((obj: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 适合人群 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">适合人群</h2>
            </div>
            <ul className="space-y-3">
              {(course.suitable || []).map((item: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 前置要求 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">前置要求</h2>
            </div>
            <ul className="space-y-3">
              {(course.requirements || []).map((req: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
