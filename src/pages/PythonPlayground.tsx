import { useState, useEffect, useRef } from 'react';
import { loadPyodide, PyodideInterface } from 'pyodide';
import { Play, RotateCcw, Code2, BarChart3, BookOpen } from 'lucide-react';

// 使用字符串数组存储 Python 代码，避免 JS 模板字符串解析 ${...} 导致的问题
// 每个字符串用单引号或双引号包裹，不使用反引号 `
const example1 = [
  '# 销售数据分析示例',
  'import pandas as pd',
  'import numpy as np',
  '',
  '# 创建示例销售数据',
  'data = {',
  '    "产品": ["手机", "电脑", "平板", "耳机", "音箱", "充电器", "保护壳", "数据线"],',
  '    "销量": [1250, 890, 450, 2100, 780, 3200, 4500, 2800],',
  '    "单价": [2999, 5999, 1999, 299, 499, 69, 29, 19],',
  '    "类别": ["电子设备", "电子设备", "电子设备", "配件", "配件", "配件", "配件", "配件"],',
  '    "月份": ["1月", "1月", "1月", "1月", "1月", "1月", "1月", "1月"]',
  '}',
  '',
  'df = pd.DataFrame(data)',
  'df["销售额"] = df["销量"] * df["单价"]',
  '',
  'print("=" * 50)',
  'print("销售数据分析报告")',
  'print("=" * 50)',
  'print()',
  'print("原始数据：")',
  'print(df.to_string(index=False))',
  'print()',
  '',
  '# 基本统计信息',
  'print("-" * 50)',
  'print("基本统计信息：")',
  'total_qty = df["销量"].sum()',
  'total_sales = df["销售额"].sum()',
  'avg_price = df["单价"].mean()',
  'max_qty_idx = df["销量"].idxmax()',
  'max_sales_idx = df["销售额"].idxmax()',
  'print("总销量：%d 件" % total_qty)',
  'print("总销售额：%.2f 元" % total_sales)',
  'print("平均单价：%.2f 元" % avg_price)',
  'print("最高销量产品：%s (%d 件)" % (df.loc[max_qty_idx, "产品"], df["销量"].max()))',
  'print("最高销售额产品：%s (%.2f 元)" % (df.loc[max_sales_idx, "产品"], df["销售额"].max()))',
  'print()',
  '',
  '# 按类别分析',
  'print("-" * 50)',
  'print("按类别分析：")',
  'category_stats = df.groupby("类别").agg({',
  '    "销量": "sum",',
  '    "销售额": "sum"',
  '}).sort_values("销售额", ascending=False)',
  'print(category_stats.to_string())',
  'print()',
  '',
  '# 销量排名',
  'print("-" * 50)',
  'print("销量排名（前5名）：")',
  'sales_rank = df.sort_values("销量", ascending=False).head(5)[["产品", "销量", "销售额"]]',
  'print(sales_rank.to_string(index=False))',
  'print()',
  '',
  '# 销售额排名',
  'print("-" * 50)',
  'print("销售额排名（前5名）：")',
  'revenue_rank = df.sort_values("销售额", ascending=False).head(5)[["产品", "销量", "销售额"]]',
  'print(revenue_rank.to_string(index=False))',
  'print()',
  '',
  'print("=" * 50)',
  'print("分析完成！")',
  'print("=" * 50)'
].join('\n');

const example2 = [
  '# NumPy 基础运算示例',
  'import numpy as np',
  '',
  'print("=" * 50)',
  'print("NumPy 基础运算演示")',
  'print("=" * 50)',
  'print()',
  '',
  '# 创建数组',
  'print("-" * 50)',
  'print("1. 创建数组")',
  'a = np.array([1, 2, 3, 4, 5])',
  'b = np.array([[1, 2, 3], [4, 5, 6]])',
  'print("一维数组 a：", a)',
  'print("二维数组 b：")',
  'print(b)',
  'print("a 的形状：", a.shape)',
  'print("b 的形状：", b.shape)',
  'print("a 的数据类型：", a.dtype)',
  'print()',
  '',
  '# 特殊数组',
  'print("-" * 50)',
  'print("2. 特殊数组")',
  'zeros = np.zeros((2, 3))',
  'ones = np.ones((2, 3))',
  'identity = np.eye(3)',
  'rand = np.random.rand(3, 3)',
  'print("零矩阵：")',
  'print(zeros)',
  'print("单位矩阵：")',
  'print(identity)',
  'print("随机矩阵：")',
  'print(rand)',
  'print()',
  '',
  '# 数组运算',
  'print("-" * 50)',
  'print("3. 数组运算")',
  'x = np.array([1, 2, 3, 4, 5])',
  'y = np.array([10, 20, 30, 40, 50])',
  'print("x =", x)',
  'print("y =", y)',
  'print("x + y =", x + y)',
  'print("x - y =", x - y)',
  'print("x * y =", x * y)',
  'print("x / y =", x / y)',
  'print("x ** 2 =", x ** 2)',
  'print("np.sqrt(x) =", np.sqrt(x))',
  'print()',
  '',
  '# 统计运算',
  'print("-" * 50)',
  'print("4. 统计运算")',
  'data = np.array([12, 15, 18, 22, 25, 28, 30, 32, 35, 40])',
  'print("数据：", data)',
  'print("平均值：%.2f" % np.mean(data))',
  'print("中位数：%.2f" % np.median(data))',
  'print("标准差：%.4f" % np.std(data))',
  'print("方差：%.4f" % np.var(data))',
  'print("最小值：%d" % np.min(data))',
  'print("最大值：%d" % np.max(data))',
  'print("总和：%d" % np.sum(data))',
  'print()',
  '',
  '# 矩阵运算',
  'print("-" * 50)',
  'print("5. 矩阵运算")',
  'A = np.array([[1, 2], [3, 4]])',
  'B = np.array([[5, 6], [7, 8]])',
  'print("A =")',
  'print(A)',
  'print("B =")',
  'print(B)',
  'print("A * B (元素相乘)：")',
  'print(A * B)',
  'print("A @ B (矩阵乘法)：")',
  'print(A @ B)',
  'print("A 的转置：")',
  'print(A.T)',
  'print("A 的行列式：%.2f" % np.linalg.det(A))',
  'print()',
  '',
  'print("=" * 50)',
  'print("NumPy 运算演示完成！")',
  'print("=" * 50)'
].join('\n');

const example3 = [
  '# 数据清洗实战示例',
  'import pandas as pd',
  'import numpy as np',
  '',
  'print("=" * 50)',
  'print("数据清洗实战演示")',
  'print("=" * 50)',
  'print()',
  '',
  '# 创建包含问题的数据',
  'print("-" * 50)',
  'print("1. 创建包含问题的数据")',
  'data = {',
  '    "姓名": ["张三", "李四", "王五", "赵六", "张三", "孙七", "周八", "吴九"],',
  '    "年龄": [25, 30, None, 28, 25, 35, 200, 27],',
  '    "工资": [8000, 12000, None, 15000, 8000, 20000, 9500, 11000],',
  '    "部门": ["技术部", "市场部", "技术部", "技术部", "技术部", "市场部", "财务部", "技术部"],',
  '    "入职日期": ["2020-01-15", "2019-06-20", "2021-03-10", "2020-08-05", "2020-01-15", "2018-11-20", "2022-01-01", "2021-09-15"]',
  '}',
  'df = pd.DataFrame(data)',
  'print("原始数据：")',
  'print(df.to_string())',
  'print()',
  'print("数据形状：", df.shape)',
  'print("数据类型：")',
  'print(df.dtypes)',
  'print()',
  '',
  '# 检查缺失值',
  'print("-" * 50)',
  'print("2. 检查缺失值")',
  'print("每列缺失值数量：")',
  'print(df.isnull().sum())',
  'print()',
  'print("缺失值占比：")',
  'for col in df.columns:',
  '    missing_pct = df[col].isnull().sum() / len(df) * 100',
  '    print("%s：%.1f%%" % (col, missing_pct))',
  'print()',
  '',
  '# 检查重复值',
  'print("-" * 50)',
  'print("3. 检查重复值")',
  'duplicates = df.duplicated()',
  'print("重复行数：%d" % duplicates.sum())',
  'if duplicates.sum() > 0:',
  '    print("重复的行：")',
  '    print(df[duplicates].to_string())',
  'print()',
  '',
  '# 检查异常值',
  'print("-" * 50)',
  'print("4. 检查异常值")',
  'print("年龄列统计：")',
  'print("最小值：%.0f" % df["年龄"].min(skipna=True))',
  'print("最大值：%.0f" % df["年龄"].max(skipna=True))',
  'print("平均值：%.2f" % df["年龄"].mean(skipna=True))',
  'age_q1 = df["年龄"].quantile(0.25)',
  'age_q3 = df["年龄"].quantile(0.75)',
  'age_iqr = age_q3 - age_q1',
  'print("Q1：%.2f, Q3：%.2f, IQR：%.2f" % (age_q1, age_q3, age_iqr))',
  'age_outliers = df[(df["年龄"] < age_q1 - 1.5 * age_iqr) | (df["年龄"] > age_q3 + 1.5 * age_iqr)]',
  'print("年龄异常值：")',
  'if len(age_outliers) > 0:',
  '    print(age_outliers[["姓名", "年龄"]].to_string())',
  'else:',
  '    print("无异常值")',
  'print()',
  '',
  '# 数据清洗',
  'print("-" * 50)',
  'print("5. 开始数据清洗")',
  'df_clean = df.copy()',
  '',
  '# 删除重复行',
  'df_clean = df_clean.drop_duplicates()',
  'print("删除重复行后剩余：%d 行" % len(df_clean))',
  '',
  '# 填充缺失值（用中位数）',
  'df_clean["年龄"] = df_clean["年龄"].fillna(df_clean["年龄"].median())',
  'df_clean["工资"] = df_clean["工资"].fillna(df_clean["工资"].median())',
  'print("已填充缺失值")',
  '',
  '# 处理异常值（把大于100的年龄替换为中位数）',
  'age_median = df_clean["年龄"].median()',
  'df_clean.loc[df_clean["年龄"] > 100, "年龄"] = age_median',
  'print("已处理年龄异常值")',
  'print()',
  '',
  '# 清洗结果',
  'print("-" * 50)',
  'print("6. 清洗后的数据")',
  'print(df_clean.to_string(index=False))',
  'print()',
  '',
  '# 简单分析',
  'print("-" * 50)',
  'print("7. 清洗后的数据统计")',
  'print("平均年龄：%.2f 岁" % df_clean["年龄"].mean())',
  'print("平均工资：%.2f 元" % df_clean["工资"].mean())',
  'print()',
  'dept_stats = df_clean.groupby("部门").agg({',
  '    "姓名": "count",',
  '    "年龄": "mean",',
  '    "工资": "mean"',
  '}).rename(columns={"姓名": "人数", "年龄": "平均年龄", "工资": "平均工资"})',
  'print("各部门统计：")',
  'print(dept_stats.round(2).to_string())',
  'print()',
  '',
  'print("=" * 50)',
  'print("数据清洗完成！")',
  'print("=" * 50)'
].join('\n');

const examples = {
  sales: {
    title: '销售数据分析',
    description: '使用 Pandas 对销售数据进行汇总统计分析',
    code: example1
  },
  numpy: {
    title: 'NumPy 基础运算',
    description: 'NumPy 数组、矩阵运算和统计方法演示',
    code: example2
  },
  clean: {
    title: '数据清洗实战',
    description: '处理缺失值、异常值、重复数据的完整流程',
    code: example3
  }
};

const PythonPlayground = () => {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentExample, setCurrentExample] = useState<string>('sales');
  const [code, setCode] = useState<string>(examples.sales.code);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPyodide = async () => {
      try {
        const pyodideInstance = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
        });

        await pyodideInstance.loadPackage(['pandas', 'numpy']);
        setPyodide(pyodideInstance);
      } catch (err) {
        setError('初始化失败: ' + String(err));
      } finally {
        setLoading(false);
      }
    };

    initPyodide();
  }, []);

  // 自动滚动输出区到底部
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, error]);

  const runCode = async () => {
    if (!pyodide) return;

    setIsRunning(true);
    setError('');
    setOutput('运行中...\n');

    try {
      // 方式：用 Python 自己的方式捕获 stdout
      const runner = [
        'import sys',
        'from io import StringIO',
        '_old_stdout = sys.stdout',
        'sys.stdout = StringIO()',
        '_result = None',
        'try:',
        '    exec(__user_code__)',
        'except Exception as _e:',
        '    import traceback',
        '    _result = "错误：\\n" + traceback.format_exc()',
        'finally:',
        '    _output = sys.stdout.getvalue()',
        '    sys.stdout = _old_stdout',
        '    if _result is None:',
        '        _result = _output',
        '    else:',
        '        _result = _output + _result',
        '_result'
      ].join('\n');

      // 将用户代码设置到 Pyodide 命名空间
      pyodide.globals.set('__user_code__', code);
      const result = pyodide.runPython(runner);
      setOutput(String(result));
    } catch (err: any) {
      setError('执行错误: ' + (err.message || String(err)));
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(examples[currentExample].code);
    setOutput('');
    setError('');
  };

  const switchExample = (key: string) => {
    setCurrentExample(key);
    setCode(examples[key as keyof typeof examples].code);
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
            <Code2 className="h-5 w-5" />
            <span className="font-medium">Python 数据分析</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Python 数据可视化练习场
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            使用 Pandas 和 NumPy 进行数据分析，支持实时运行和结果展示
          </p>
        </div>

        {/* 示例选择器 */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <BookOpen className="h-5 w-5 text-gray-700" />
            <span className="font-medium text-gray-800">选择示例：</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(examples).map(([key, ex]) => (
              <button
                key={key}
                onClick={() => switchExample(key)}
                className={
                  'text-left p-4 rounded-xl border-2 transition-all ' +
                  (currentExample === key
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50')
                }
              >
                <div className="font-semibold text-gray-800 mb-1">{ex.title}</div>
                <div className="text-sm text-gray-600">{ex.description}</div>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">正在加载 Python 运行环境...</p>
            <p className="text-gray-500 text-sm mt-2">首次加载可能需要一些时间（约 30-60 秒）</p>
            <p className="text-gray-400 text-xs mt-1">正在下载 Pandas 和 NumPy 运行库</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code2 className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Python 代码编辑器</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetCode}
                    className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors"
                    title="重置代码"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="text-sm">重置</span>
                  </button>
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span className="text-sm">{isRunning ? '运行中...' : '运行 ▶'}</span>
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[480px] p-4 font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none"
                spellCheck={false}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">运行结果</span>
                </div>
                {(output || error) && (
                  <span className="text-white/80 text-xs">已运行</span>
                )}
              </div>
              <div
                ref={outputRef}
                className="w-full h-[480px] p-4 font-mono text-sm bg-gray-900 overflow-auto leading-relaxed"
              >
                {error && (
                  <div className="text-red-400 whitespace-pre-wrap mb-2">— 错误信息 —\n{error}</div>
                )}
                {output && (
                  <div className="text-green-400 whitespace-pre-wrap">{output}</div>
                )}
                {!output && !error && (
                  <div className="text-gray-500">
                    点击右上角"运行"按钮执行代码，分析结果将显示在这里\n\n提示：\n• 可以修改左侧代码后点击运行\n• 可在顶部切换不同的示例代码\n• 结果为 Python 标准输出
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 功能介绍 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">在线运行</h3>
            <p className="text-gray-600 text-sm">
              无需安装 Python，直接在浏览器中运行数据分析代码，基于 Pyodide 技术
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">真实数据</h3>
            <p className="text-gray-600 text-sm">
              使用真实场景的数据集，学习销售分析、数据清洗、统计分析等实战应用
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Play className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">即时反馈</h3>
            <p className="text-gray-600 text-sm">
              代码修改后立即运行，快速查看分析结果，支持自己编写代码进行练习
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonPlayground;
