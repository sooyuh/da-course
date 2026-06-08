import { useState, useEffect, useRef } from 'react';
import { loadPyodide, PyodideInterface } from 'pyodide';
import { Play, RotateCcw, Code2, BarChart3 } from 'lucide-react';

const PythonPlayground = () => {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const [code, setCode] = useState(`# 销售数据分析示例
import pandas as pd
import numpy as np

# 创建示例销售数据
data = {
    '产品': ['手机', '电脑', '平板', '耳机', '音箱', '充电器', '保护壳', '数据线'],
    '销量': [1250, 890, 450, 2100, 780, 3200, 4500, 2800],
    '单价': [2999, 5999, 1999, 299, 499, 69, 29, 19],
    '类别': ['电子设备', '电子设备', '电子设备', '配件', '配件', '配件', '配件', '配件'],
    '月份': ['1月', '1月', '1月', '1月', '1月', '1月', '1月', '1月']
}

df = pd.DataFrame(data)
df['销售额'] = df['销量'] * df['单价']

print('=' * 50)
print('销售数据分析报告')
print('=' * 50)
print()
print('原始数据：')
print(df.to_string(index=False))
print()

# 基本统计信息
print('-' * 50)
print('基本统计信息：')
print(f'总销量：{df["销量"].sum():.0f} 件')
print(f'总销售额：{df["销售额"].sum():,.2f} 元')
print(f'平均单价：{df["单价"].mean():.2f} 元')
print(f'最高销量产品：{df.loc[df["销量"].idxmax(), "产品"]} ({df["销量"].max()} 件)')
print(f'最高销售额产品：{df.loc[df["销售额"].idxmax(), "产品"]} ({df["销售额"].max():,.2f} 元)')
print()

# 按类别分析
print('-' * 50)
print('按类别分析：')
category_stats = df.groupby('类别').agg({
    '销量': 'sum',
    '销售额': 'sum'
}).sort_values('销售额', ascending=False)
print(category_stats.to_string())
print()

# 销量排名
print('-' * 50)
print('销量排名（前5名）：')
sales_rank = df.sort_values('销量', ascending=False).head(5)[['产品', '销量', '销售额']]
print(sales_rank.to_string(index=False))
print()

print('=' * 50)
print('分析完成！')
print('=' * 50)`);

  useEffect(() => {
    const initPyodide = async () => {
      try {
        const pyodideInstance = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
        });
        
        await pyodideInstance.loadPackage(['pandas', 'numpy']);
        setPyodide(pyodideInstance);
      } catch (err) {
        setError(`初始化失败: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    initPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodide) return;

    setIsRunning(true);
    setError('');
    setOutput('');

    try {
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);

      pyodide.runPython(code);

      const result = pyodide.runPython('sys.stdout.getvalue()');
      setOutput(result);
    } catch (err: any) {
      setError(`执行错误: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(`# 销售数据分析示例
import pandas as pd
import numpy as np

# 创建示例销售数据
data = {
    '产品': ['手机', '电脑', '平板', '耳机', '音箱', '充电器', '保护壳', '数据线'],
    '销量': [1250, 890, 450, 2100, 780, 3200, 4500, 2800],
    '单价': [2999, 5999, 1999, 299, 499, 69, 29, 19],
    '类别': ['电子设备', '电子设备', '电子设备', '配件', '配件', '配件', '配件', '配件'],
    '月份': ['1月', '1月', '1月', '1月', '1月', '1月', '1月', '1月']
}

df = pd.DataFrame(data)
df['销售额'] = df['销量'] * df['单价']

print('=' * 50)
print('销售数据分析报告')
print('=' * 50)
print()
print('原始数据：')
print(df.to_string(index=False))
print()

# 基本统计信息
print('-' * 50)
print('基本统计信息：')
print(f'总销量：{df["销量"].sum():.0f} 件')
print(f'总销售额：{df["销售额"].sum():,.2f} 元')
print(f'平均单价：{df["单价"].mean():.2f} 元')
print(f'最高销量产品：{df.loc[df["销量"].idxmax(), "产品"]} ({df["销量"].max()} 件)')
print(f'最高销售额产品：{df.loc[df["销售额"].idxmax(), "产品"]} ({df["销售额"].max():,.2f} 元)')
print()

# 按类别分析
print('-' * 50)
print('按类别分析：')
category_stats = df.groupby('类别').agg({
    '销量': 'sum',
    '销售额': 'sum'
}).sort_values('销售额', ascending=False)
print(category_stats.to_string())
print()

# 销量排名
print('-' * 50)
print('销量排名（前5名）：')
sales_rank = df.sort_values('销量', ascending=False).head(5)[['产品', '销量', '销售额']]
print(sales_rank.to_string(index=False))
print()

print('=' * 50)
print('分析完成！')
print('=' * 50)`);
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">正在加载 Python 运行环境...</p>
            <p className="text-gray-500 text-sm mt-2">首次加载可能需要一些时间</p>
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
                    <span className="text-sm">{isRunning ? '运行中...' : '运行'}</span>
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none"
                spellCheck={false}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">运行结果</span>
                </div>
              </div>
              <div
                ref={outputRef}
                className="w-full h-96 p-4 font-mono text-sm bg-gray-900 overflow-auto"
              >
                {error && (
                  <div className="text-red-400 whitespace-pre-wrap">{error}</div>
                )}
                {output && (
                  <div className="text-green-400 whitespace-pre-wrap">{output}</div>
                )}
                {!output && !error && (
                  <div className="text-gray-500">
                    点击"运行"按钮执行代码，结果将显示在这里
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">在线运行</h3>
            <p className="text-gray-600 text-sm">
              无需安装 Python，直接在浏览器中运行数据分析代码
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">真实数据</h3>
            <p className="text-gray-600 text-sm">
              使用真实的销售数据示例，学习数据分析的实际应用
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Play className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">即时反馈</h3>
            <p className="text-gray-600 text-sm">
              代码修改后立即运行，快速查看分析结果和可视化效果
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonPlayground;
