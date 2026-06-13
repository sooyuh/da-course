import { useState, useEffect, useRef } from 'react';
import { loadPyodide, PyodideInterface } from 'pyodide';
import { Play, RotateCcw, Code2, BarChart3, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

// 使用字符串数组存储 Python 代码，用单引号包裹，避免 JS 模板字符串解析 ${...} 导致的问题
// 每个示例都是一个字符串数组，.join('\n') 合成完整代码
const example1 = [
  '# ========================================',
  '# 销售数据分析示例',
  '# ========================================',
  'import pandas as pd',
  'import numpy as np',
  '',
  '# 创建示例销售数据',
  'products = ["手机", "电脑", "平板", "耳机", "音箱", "充电器", "保护壳", "数据线"]',
  'sales_qty = [1250, 890, 450, 2100, 780, 3200, 4500, 2800]',
  'unit_price = [2999, 5999, 1999, 299, 499, 69, 29, 19]',
  'categories = ["电子设备", "电子设备", "电子设备", "配件", "配件", "配件", "配件", "配件"]',
  '',
  '# 构建 DataFrame',
  'data = {',
  '    "产品": products,',
  '    "销量": sales_qty,',
  '    "单价": unit_price,',
  '    "类别": categories',
  '}',
  '',
  'df = pd.DataFrame(data)',
  'df["销售额"] = df["销量"] * df["单价"]',
  '',
  '# ========== 开始输出分析结果 ==========',
  'print("=" * 60)',
  'print("            销售数据分析报告")',
  'print("=" * 60)',
  'print()',
  '',
  'print("【原始数据】")',
  'print(df.to_string(index=False))',
  'print()',
  '',
  '# 基本统计信息',
  'print("-" * 60)',
  'print("【基本统计信息】")',
  'total_qty = int(df["销量"].sum())',
  'total_revenue = float(df["销售额"].sum())',
  'avg_price = float(df["单价"].mean())',
  '',
  'print("商品种类数：%d 种" % len(df))',
  'print("总销量：    %d 件" % total_qty)',
  'print("总销售额：   %.2f 元" % total_revenue)',
  'print("平均单价：   %.2f 元" % avg_price)',
  '',
  '# 找出最高最低',
  'max_qty_row = df.loc[df["销量"].idxmax()]',
  'min_qty_row = df.loc[df["销量"].idxmin()]',
  'max_rev_row = df.loc[df["销售额"].idxmax()]',
  'print()',
  'print("最高销量产品：%s（销量 %d 件）" % (max_qty_row["产品"], int(max_qty_row["销量"])))',
  'print("最低销量产品：%s（销量 %d 件）" % (min_qty_row["产品"], int(min_qty_row["销量"])))',
  'print("最高销售额产品：%s（销售额 %.2f 元）" % (max_rev_row["产品"], float(max_rev_row["销售额"])))',
  'print()',
  '',
  '# 按类别分析',
  'print("-" * 60)',
  'print("【按类别分析】")',
  'cat_stats = df.groupby("类别").agg({',
  '    "产品": "count",',
  '    "销量": "sum",',
  '    "销售额": "sum"',
  '}).rename(columns={"产品": "商品数"})',
  'cat_stats["平均单价"] = cat_stats["销售额"] / cat_stats["销量"]',
  'cat_stats_sorted = cat_stats.sort_values("销售额", ascending=False)',
  'print(cat_stats_sorted.to_string())',
  'print()',
  '',
  '# 销量排名 Top 5',
  'print("-" * 60)',
  'print("【销量排名 Top 5】")',
  'top_sales = df.sort_values("销量", ascending=False).head(5)[["产品", "类别", "销量", "销售额"]]',
  'top_sales["排名"] = range(1, len(top_sales) + 1)',
  'cols = ["排名", "产品", "类别", "销量", "销售额"]',
  'print(top_sales[cols].to_string(index=False))',
  'print()',
  '',
  '# 销售额排名 Top 5',
  'print("-" * 60)',
  'print("【销售额排名 Top 5】")',
  'top_rev = df.sort_values("销售额", ascending=False).head(5)[["产品", "类别", "销量", "销售额"]]',
  'top_rev["排名"] = range(1, len(top_rev) + 1)',
  'print(top_rev[cols].to_string(index=False))',
  'print()',
  '',
  '# 销量分布统计',
  'print("-" * 60)',
  'print("【销量分布统计】")',
  'q25 = int(df["销量"].quantile(0.25))',
  'q50 = int(df["销量"].quantile(0.50))',
  'q75 = int(df["销量"].quantile(0.75))',
  'print("25%% 分位：%d 件" % q25)',
  'print("50%% 分位(中位数)：%d 件" % q50)',
  'print("75%% 分位：%d 件" % q75)',
  'print("标准差：%.2f" % float(df["销量"].std()))',
  'print()',
  '',
  'print("=" * 60)',
  'print("            分析完成！")',
  'print("=" * 60)',
].join('\n');

const example2 = [
  '# ========================================',
  '# NumPy 基础运算演示',
  '# ========================================',
  'import numpy as np',
  '',
  'print("=" * 60)',
  'print("          NumPy 基础运算演示")',
  'print("=" * 60)',
  'print()',
  '',
  '# 1. 创建数组',
  'print("-" * 60)',
  'print("【1. 创建数组】")',
  'a = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])',
  'b = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])',
  'print("一维数组 a：")',
  'print(a)',
  'print("形状：", a.shape, "  维度：", a.ndim, "  元素数：", a.size)',
  'print()',
  'print("二维数组 b：")',
  'print(b)',
  'print("形状：", b.shape, "  维度：", b.ndim, "  元素数：", b.size)',
  'print()',
  '',
  '# 2. 特殊数组',
  'print("-" * 60)',
  'print("【2. 特殊数组生成】")',
  'print("零矩阵 np.zeros((2,4))：")',
  'print(np.zeros((2, 4)))',
  'print()',
  'print("单位矩阵 np.eye(4)：")',
  'print(np.eye(4))',
  'print()',
  'print("np.arange(0, 20, 2)：")',
  'print(np.arange(0, 20, 2))',
  'print()',
  'print("np.linspace(0, 1, 10)：")',
  'print(np.linspace(0, 1, 10))',
  'print()',
  'print("随机矩阵 np.random.rand(3, 3)（0~1 均匀分布）：")',
  'np.random.seed(42)',
  'rand_m = np.random.rand(3, 3)',
  'print(rand_m)',
  'print()',
  '',
  '# 3. 数组运算',
  'print("-" * 60)',
  'print("【3. 数组元素级运算】")',
  'x = np.array([1, 2, 3, 4, 5])',
  'y = np.array([10, 20, 30, 40, 50])',
  'print("x =", x)',
  'print("y =", y)',
  'print()',
  'print("x + y  =", x + y)',
  'print("x - y  =", x - y)',
  'print("x * y  =", x * y)',
  'print("x / y  =", x / y)',
  'print("x ** 2 =", x ** 2)',
  'print("x % 3  =", x % 3)',
  'print("√x     =", np.sqrt(x).round(3))',
  'print("e^x    =", np.exp(x).round(2))',
  'print()',
  '',
  '# 4. 统计运算',
  'print("-" * 60)',
  'print("【4. 统计运算 - 某门店 10 天销售数据】")',
  'daily_sales = np.array([1280, 1450, 1100, 2200, 1890, 1560, 3100, 2800, 1760, 2050])',
  'print("数据：", daily_sales)',
  'print()',
  'print("总和：     %.2f 元" % float(np.sum(daily_sales)))',
  'print("平均值：   %.2f 元" % float(np.mean(daily_sales)))',
  'print("中位数：   %.2f 元" % float(np.median(daily_sales)))',
  'print("最大值：   %.2f 元 (第 %d 天)" % (float(np.max(daily_sales)), int(np.argmax(daily_sales)) + 1))',
  'print("最小值：   %.2f 元 (第 %d 天)" % (float(np.min(daily_sales)), int(np.argmin(daily_sales)) + 1))',
  'print("标准差：   %.2f" % float(np.std(daily_sales)))',
  'print("方差：     %.2f" % float(np.var(daily_sales)))',
  'print("极差：     %.2f" % float(np.max(daily_sales) - np.min(daily_sales)))',
  'print()',
  '',
  '# 5. 矩阵运算',
  'print("-" * 60)',
  'print("【5. 矩阵运算】")',
  'A = np.array([[1, 2], [3, 4]])',
  'B = np.array([[5, 6], [7, 8]])',
  'print("A =")',
  'print(A)',
  'print("B =")',
  'print(B)',
  'print()',
  'print("A * B （元素级相乘）：")',
  'print(A * B)',
  'print()',
  'print("A @ B （矩阵乘法）：")',
  'print(A @ B)',
  'print()',
  'print("A 的转置 A.T：")',
  'print(A.T)',
  'print()',
  'print("A 的逆矩阵 np.linalg.inv(A)：")',
  'print(np.linalg.inv(A).round(4))',
  'print()',
  'print("A 的行列式 det(A) = %.2f" % float(np.linalg.det(A)))',
  'print()',
  '',
  '# 6. 布尔索引',
  'print("-" * 60)',
  'print("【6. 布尔索引 - 筛选销量 > 2000 的日期】")',
  'above_2000 = daily_sales[daily_sales > 2000]',
  'print("原始数据：", daily_sales)',
  'print("> 2000 的值：", above_2000)',
  'print("共有 %d 天销量超过 2000" % len(above_2000))',
  'print()',
  '',
  'print("=" * 60)',
  'print("          NumPy 演示完成！")',
  'print("=" * 60)',
].join('\n');

const example3 = [
  '# ========================================',
  '# 数据清洗实战演示',
  '# ========================================',
  'import pandas as pd',
  'import numpy as np',
  '',
  'print("=" * 60)',
  'print("          数据清洗实战演示")',
  'print("=" * 60)',
  'print()',
  '',
  '# 1. 创建包含各种问题的数据（员工信息）',
  'print("-" * 60)',
  'print("【1. 原始数据 - 员工信息表】")',
  'names = ["张三", "李四", "王五", "赵六", "张三", "孙七", "周八", "吴九", "郑十", "钱一"]',
  'ages = [25, 30, None, 28, 25, 35, 200, 27, None, 32]',
  'salary = [8000, 12000, None, 15000, 8000, 20000, 9500, 11000, None, 13500]',
  'dept = ["技术部", "市场部", "技术部", "技术部", "技术部", "市场部", "财务部", "技术部", "技术部", "市场部"]',
  'city = ["北京", "上海", None, "北京", "北京", "深圳", "北京", "上海", "深圳", "北京"]',
  '',
  'data = {',
  '    "姓名": names,',
  '    "年龄": ages,',
  '    "薪资": salary,',
  '    "部门": dept,',
  '    "城市": city',
  '}',
  'df = pd.DataFrame(data)',
  'print("原始数据（共 %d 行）：" % len(df))',
  'print(df.to_string())',
  'print()',
  '',
  '# 2. 检查缺失值',
  'print("-" * 60)',
  'print("【2. 缺失值检查】")',
  'missing_count = df.isnull().sum()',
  'print("各字段缺失值数量：")',
  'for col in df.columns:',
  '    cnt = int(missing_count[col])',
  '    pct = float(missing_count[col] / len(df) * 100)',
  '    if cnt > 0:',
  '        print("  %s：%d 个 (%.1f%%)" % (col, cnt, pct))',
  '    else:',
  '        print("  %s：0 个" % col)',
  'print()',
  'print("总缺失单元格数：%d" % int(df.isnull().sum().sum()))',
  'print("完整数据行：%d 行" % int(df.dropna().shape[0]))',
  'print()',
  '',
  '# 3. 检查重复值',
  'print("-" * 60)',
  'print("【3. 重复值检查】")',
  'dup_mask = df.duplicated()',
  'dup_count = int(dup_mask.sum())',
  'print("发现 %d 条重复记录：" % dup_count)',
  'if dup_count > 0:',
  '    print(df[dup_mask].to_string())',
  'print()',
  '',
  '# 4. 检查异常值',
  'print("-" * 60)',
  'print("【4. 异常值检查 - 年龄字段】")',
  'age_valid = df["年龄"].dropna()',
  'print("年龄列统计：")',
  'print("  样本数: %d" % len(age_valid))',
  'print("  最小值: %.0f" % float(age_valid.min()))',
  'print("  最大值: %.0f" % float(age_valid.max()))',
  'print("  平均值: %.2f" % float(age_valid.mean()))',
  'print("  中位数: %.2f" % float(age_valid.median()))',
  'q1 = float(age_valid.quantile(0.25))',
  'q3 = float(age_valid.quantile(0.75))',
  'iqr = q3 - q1',
  'print("  Q1=%.2f, Q3=%.2f, IQR=%.2f" % (q1, q3, iqr))',
  'lower_bound = q1 - 1.5 * iqr',
  'upper_bound = q3 + 1.5 * iqr',
  'print("  正常范围: [%.1f, %.1f]" % (lower_bound, upper_bound))',
  '',
  '# 找出异常的年龄',
  'age_outliers = df[(df["年龄"].notna()) & ((df["年龄"] < lower_bound) | (df["年龄"] > upper_bound))]',
  'if len(age_outliers) > 0:',
  '    print("  发现 %d 个异常值：" % len(age_outliers))',
  '    print(age_outliers[["姓名", "年龄"]].to_string())',
  'else:',
  '    print("  无异常值")',
  'print()',
  '',
  '# 5. 执行清洗',
  'print("-" * 60)',
  'print("【5. 开始数据清洗】")',
  'df_clean = df.copy()',
  '',
  '# 删除重复行',
  'before_dup = len(df_clean)',
  'df_clean = df_clean.drop_duplicates()',
  'after_dup = len(df_clean)',
  'print("✓ 删除重复行：%d → %d (删除 %d 条)" % (before_dup, after_dup, before_dup - after_dup))',
  '',
  '# 填充缺失值 - 数值用中位数，字符串用众数',
  'age_median = float(df_clean["年龄"].median())',
  'salary_median = float(df_clean["薪资"].median())',
  'city_mode = df_clean["城市"].mode().iloc[0] if not df_clean["城市"].mode().empty else "未知"',
  '',
  'df_clean["年龄"] = df_clean["年龄"].fillna(age_median)',
  'df_clean["薪资"] = df_clean["薪资"].fillna(salary_median)',
  'df_clean["城市"] = df_clean["城市"].fillna(city_mode)',
  'print("✓ 填充缺失值：年龄→%.0f, 薪资→%.0f, 城市→%s" % (age_median, salary_median, city_mode))',
  '',
  '# 处理异常值 - 年龄超过 100 视为异常，用中位数替换',
  'abnormal_age_mask = (df_clean["年龄"] < 18) | (df_clean["年龄"] > 80)',
  'if abnormal_age_mask.any():',
  '    df_clean.loc[abnormal_age_mask, "年龄"] = age_median',
  '    print("✓ 年龄异常修正：%d 条 → %.0f" % (int(abnormal_age_mask.sum()), age_median))',
  'print()',
  '',
  '# 6. 清洗结果',
  'print("-" * 60)',
  'print("【6. 清洗后的数据】")',
  'print("清洗后共 %d 行" % len(df_clean))',
  'print(df_clean.to_string(index=False))',
  'print()',
  'print("缺失值校验：")',
  'after_missing = df_clean.isnull().sum()',
  'print("  各字段缺失数量：", dict(after_missing))',
  'print()',
  '',
  '# 7. 清洗后的数据统计分析',
  'print("-" * 60)',
  'print("【7. 清洗后的数据统计分析】")',
  'print("平均年龄：%.2f 岁" % float(df_clean["年龄"].mean()))',
  'print("平均薪资：%.2f 元" % float(df_clean["薪资"].mean()))',
  'print("最高薪资：%.0f 元" % float(df_clean["薪资"].max()))',
  'print("最低薪资：%.0f 元" % float(df_clean["薪资"].min()))',
  'print()',
  'print("各部门统计：")',
  'dept_agg = df_clean.groupby("部门").agg({',
  '    "姓名": "count",',
  '    "年龄": "mean",',
  '    "薪资": "mean"',
  '}).rename(columns={"姓名": "人数", "年龄": "平均年龄", "薪资": "平均薪资"})',
  'print(dept_agg.round(1).to_string())',
  'print()',
  '',
  'print("各城市人员分布：")',
  'city_count = df_clean.groupby("城市").size().sort_values(ascending=False)',
  'for c, cnt in city_count.items():',
  '    print("  %s：%d 人" % (c, int(cnt)))',
  'print()',
  '',
  'print("=" * 60)',
  'print("          数据清洗完成！")',
  'print("=" * 60)',
].join('\n');

const examples = {
  sales: {
    title: '销售数据分析',
    description: '使用 Pandas 对销售数据进行汇总统计、排名、分组分析',
    code: example1
  },
  numpy: {
    title: 'NumPy 基础运算',
    description: 'NumPy 数组创建、矩阵运算、统计方法完整演示',
    code: example2
  },
  clean: {
    title: '数据清洗实战',
    description: '处理缺失值、异常值、重复数据的完整流程 + 清洗后分析',
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

        // 加载 pandas 和 numpy
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

  // 输出区自动滚动到底部
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, error]);

  const runCode = async () => {
    if (!pyodide) return;

    setIsRunning(true);
    setError('');
    setOutput('▶ 正在执行 Python 代码，请稍候...\n');

    try {
      // 方法：将用户代码字符串写入 Pyodide 全局变量
      // 然后执行一个固定的 runner 脚本（通过 JS 普通字符串传递，避免反引号解析）
      // 用户代码在 Python 内部通过 exec 执行，全局作用域用字典隔离

      pyodide.globals.set('input_source_code', code);

      // runner 脚本 - 通过 JS 字符串数组拼接到 Python
      // 注意：这里全部用单引号字符串，Python 字符串中的 \n、\t 会被 JS 正确转义
      const runnerLines = [
        'import sys',
        'from io import StringIO',
        '',
        '# 捕获标准输出',
        '_buf = StringIO()',
        '_old = sys.stdout',
        'sys.stdout = _buf',
        '',
        '# 定义一个干净的全局命名空间（模拟 __main__）',
        '_exec_globals = {"__name__": "__main__"}',
        '',
        'try:',
        '    # exec 在指定的全局命名空间中执行用户代码',
        '    exec(input_source_code, _exec_globals)',
        'except Exception as _exc:',
        '    import traceback',
        '    sys.stdout = _old',
        '    print("")',
        '    print("=" * 60)',
        '    print("程序运行出错！")',
        '    print("=" * 60)',
        '    print("错误类型:", type(_exc).__name__)',
        '    print("错误信息:", str(_exc))',
        '    print("-" * 60)',
        '    print("详细调用栈:")',
        '    traceback.print_exc()',
        '    print("=" * 60)',
        'finally:',
        '    sys.stdout = _old',
        '',
        '# 获取所有输出',
        '_final_output = _buf.getvalue()',
        '',
        '# 返回给 JS',
        '_final_output',
      ];
      const runner = runnerLines.join('\n');

      const result = pyodide.runPython(runner);
      const resultStr = String(result);

      if (resultStr && resultStr.trim().length > 0) {
        setOutput(resultStr);
      } else {
        setOutput('✓ 代码执行成功，但没有产生任何输出。\n\n提示：在代码中使用 print() 函数输出结果。');
      }
    } catch (err: any) {
      const msg = err.message || String(err);
      setError('执行错误: ' + msg);
      // 如果有部分输出也显示出来
      setOutput((prev) => prev + '\n[系统] 运行时发生异常，请检查代码。');
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(examples[currentExample as keyof typeof examples].code);
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
            使用 Pandas 和 NumPy 进行数据分析，直接在浏览器中运行代码并查看分析结果
          </p>
        </div>

        {/* 示例选择器 */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <BookOpen className="h-5 w-5 text-gray-700" />
            <span className="font-medium text-gray-800">选择示例（点击切换）：</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(examples).map(([key, ex]) => (
              <button
                key={key}
                onClick={() => switchExample(key)}
                className={
                  'text-left p-4 rounded-xl border-2 transition-all ' +
                  (currentExample === key
                    ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
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
            <p className="text-gray-500 text-sm mt-2">首次加载可能需要约 30-60 秒</p>
            <p className="text-gray-400 text-xs mt-1">正在下载并初始化 Pandas + NumPy 运行库</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 代码编辑器 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code2 className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Python 代码编辑器</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetCode}
                    className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors text-sm"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>重置</span>
                  </button>
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className={
                      'flex items-center space-x-1 px-4 py-1.5 rounded-lg text-white text-sm font-medium transition-colors ' +
                      (isRunning ? 'bg-orange-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600')
                    }
                  >
                    <Play className="h-4 w-4" />
                    <span>{isRunning ? '运行中...' : '运行 ▶'}</span>
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[500px] p-4 font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
                placeholder="# 在这里编写 Python 代码...\nimport pandas as pd\nprint('Hello!')"
              />
            </div>

            {/* 运行结果 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">运行结果</span>
                </div>
                {output && (
                  <span className="text-white/80 text-xs flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>已执行</span>
                  </span>
                )}
              </div>
              <div
                ref={outputRef}
                className="w-full h-[500px] p-4 font-mono text-sm bg-gray-900 overflow-auto leading-relaxed"
              >
                {error && (
                  <div className="text-red-400 whitespace-pre-wrap mb-2 flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {output && (
                  <div className="text-green-400 whitespace-pre-wrap">{output}</div>
                )}
                {!output && !error && (
                  <div className="text-gray-500 whitespace-pre-wrap">
                    <div className="mb-2">━ 欢迎使用 Python 数据可视化练习场 ━</div>
                    <div className="text-sm">
                      {`\n操作说明：\n\n1. 点击右上角「运行 ▶」按钮执行当前 Python 代码\n2. 分析结果会显示在这里\n3. 顶部可切换 3 个不同示例代码\n4. 也可以自己修改左侧代码进行实验\n\n示例代码使用 Pandas 和 NumPy 进行数据分析\n基于 Pyodide（浏览器端 Python 运行环境）`}
                    </div>
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
