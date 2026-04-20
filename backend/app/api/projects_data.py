# 项目详细数据
projects_data = [
    {
        "id": 1,
        "title": "电商销售数据清洗与质量诊断",
        "description": "某电商平台提供了包含12万条记录的销售数据CSV文件，但数据存在缺失值、重复记录、格式不一致、异常值等多种质量问题，严重影响后续分析。作为数据分析师，你需要对原始数据进行全面的清洗与质量诊断，输出一份数据质量报告。",
        "difficulty": "入门",
        "category": "数据清洗",
        "duration": "4小时",
        "popularity": 95,
        "learningObjectives": [
            "掌握pandas读取CSV文件、查看数据概况的方法",
            "学会识别和处理缺失值（isnull()、fillna()、dropna()）",
            "掌握重复值检测与去重（duplicated()、drop_duplicates()）",
            "学会数据类型转换与格式统一（astype()、pd.to_datetime()）",
            "掌握异常值识别方法（箱线图、分位数法）"
        ],
        "coreTasks": [
            "使用pd.read_csv()加载数据，通过info()和describe()进行初步诊断",
            "统计各列缺失值数量，根据业务规则对数值列用均值/中位数填充，对类别列用众数填充",
            "基于订单号检测并删除重复记录",
            "将日期列转换为datetime类型，提取年/月/日/星期信息",
            "使用箱线图识别销售额中的异常值（如大于3倍标准差的数据），结合业务规则判断是否剔除",
            "输出一份\"数据清洗报告\"，包含清洗前后的数据质量对比表"
        ],
        "technicalPoints": [
            "pd.read_csv(), df.info(), df.describe()",
            "isnull(), sum(), fillna(), dropna()",
            "duplicated(), drop_duplicates()",
            "astype(), pd.to_datetime(), dt.year等",
            "箱线图：sns.boxplot() 或 df.boxplot()",
            "条件筛选与赋值"
        ],
        "taskSteps": [
            "加载数据，查看前5行",
            "检查每列缺失比例，绘制缺失值热力图",
            "对数值列缺失值：用该列中位数填充；对分类列缺失值：用众数填充",
            "检查订单号是否有重复，删除重复订单",
            "将订单日期转为datetime，新增\"星期几\"列",
            "计算销售额的Z-score，标记异常值，按业务规则（如销售额<=0或>10000）进行过滤",
            "生成清洗前后的对比统计表"
        ],
        "dataDescription": "数据源：可下载Kaggle上的\"E-commerce Sales Dataset\"或使用老师提供的模拟数据sales_raw.csv。关键字段：订单号、用户ID、商品ID、商品品类、销售数量、单价、销售金额、订单日期、用户年龄、用户性别等。",
        "extensionThinking": [
            "如果某商品单价异常高但销售数量很少，应如何处理？",
            "数据清洗的步骤顺序对结果有什么影响？",
            "如何用编程自动生成数据质量报告（含表格和图表）？"
        ],
        "codeExamples": [
            {
                "title": "加载数据并查看概况",
                "code": "import pandas as pd\n\n# 加载数据\ndf = pd.read_csv('sales_raw.csv')\n\n# 查看数据前5行\nprint(df.head())\n\n# 查看数据基本信息\nprint(df.info())\n\n# 查看数据统计描述\nprint(df.describe())"
            },
            {
                "title": "处理缺失值",
                "code": "# 统计各列缺失值数量\nprint(df.isnull().sum())\n\n# 对数值列用中位数填充\nnumeric_cols = df.select_dtypes(include=['int64', 'float64']).columns\ndf[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())\n\n# 对分类列用众数填充\ncategorical_cols = df.select_dtypes(include=['object']).columns\ndf[categorical_cols] = df[categorical_cols].fillna(df[categorical_cols].mode().iloc[0])"
            },
            {
                "title": "处理重复记录",
                "code": "# 检查重复订单\nduplicate_orders = df[df.duplicated('订单号')]\nprint(f'重复订单数: {len(duplicate_orders)}')\n\n# 删除重复订单\ndf = df.drop_duplicates('订单号')\nprint(f'去重后订单数: {len(df)}')"
            },
            {
                "title": "日期处理和异常值检测",
                "code": "# 将日期列转换为datetime类型\ndf['订单日期'] = pd.to_datetime(df['订单日期'])\n\n# 提取年/月/日/星期信息\ndf['年'] = df['订单日期'].dt.year\ndf['月'] = df['订单日期'].dt.month\ndf['日'] = df['订单日期'].dt.day\ndf['星期几'] = df['订单日期'].dt.dayofweek\n\n# 计算Z-score检测异常值\nfrom scipy import stats\ndf['销售额_Zscore'] = stats.zscore(df['销售金额'])\n\n# 标记异常值（Z-score绝对值大于3）\ndf['异常值标记'] = abs(df['销售额_Zscore']) > 3\n\n# 过滤异常值\ndf_clean = df[~df['异常值标记']]\nprint(f'过滤前记录数: {len(df)}')\nprint(f'过滤后记录数: {len(df_clean)}')"
            }
        ],
        "datasetLink": "https://www.kaggle.com/datasets/carrie1/ecommerce-data"
    },
    {
        "id": 2,
        "title": "用户行为日志分析与漏斗转化",
        "description": "电商平台记录了用户在双十一活动期间的行为日志，包含用户ID、商品ID、行为类型（点击/收藏/加购/支付）、时间戳等信息。运营团队希望了解用户从浏览到最终支付的全链路转化情况，找出流失最严重的环节，并计算PV、UV、付费率等核心指标。",
        "difficulty": "中级",
        "category": "用户分析",
        "duration": "6小时",
        "popularity": 88,
        "learningObjectives": [
            "掌握时间戳数据的解析与特征提取",
            "学会按用户聚合统计行为数据",
            "掌握漏斗分析的实现方法",
            "学会计算PV、UV、付费率、复购率等核心指标",
            "掌握基础数据可视化（matplotlib/seaborn）"
        ],
        "coreTasks": [
            "加载用户行为日志数据，将时间戳解析为日期和小时，计算每日/每小时的PV和UV",
            "按用户统计行为序列，分析\"点击→收藏/加购→支付\"各环节的转化率和流失率，绘制漏斗图",
            "计算整体付费率（付费用户数/活跃用户总数）和复购率（购买两次及以上的用户数/总用户数）",
            "识别\"只加购不支付\"的用户群体，分析其行为特征（如加购时间、商品类目分布）",
            "输出转化率优化建议"
        ],
        "technicalPoints": [
            "pd.to_datetime() 解析时间戳",
            "groupby() 聚合计数（PV/UV）",
            "pivot_table() 构建用户行为漏斗矩阵",
            "漏斗图绘制：可使用plotly或手动计算比例后用matplotlib绘制条形图",
            "条件筛选：df[df.behavior_type==4]"
        ],
        "taskSteps": [
            "加载数据，将timestamp转为datetime，提取日期和小时",
            "计算每小时PV和UV，绘制折线图",
            "统计每个用户的行为序列：如果用户有点击、收藏、加购、支付中的任意行为，按时间排序，判断其转化路径",
            "计算各环节转化率：点击→收藏、收藏→加购、加购→支付，绘制漏斗图",
            "计算付费率 = 有支付行为的用户数 / 总用户数；复购率 = 购买次数≥2的用户数 / 总支付用户数",
            "筛选出\"加购但从未支付\"的用户，分析其加购时间分布和商品品类偏好"
        ],
        "dataDescription": "数据源：淘宝双十一用户行为公开数据集（User Behavior Data from Taobao），或老师提供的user_behavior.csv。关键字段：user_id, item_id, behavior_type（1=点击,2=收藏,3=加购,4=支付）, timestamp。",
        "extensionThinking": [
            "如果用户跨天完成购买，漏斗分析应该如何处理？",
            "如何计算不同渠道（如PC端/移动端）的转化率差异？",
            "漏斗分析中，如何定义\"有效会话\"？"
        ],
        "codeExamples": [
            {
                "title": "数据加载与时间处理",
                "code": "import pandas as pd\n\n# 加载数据\ndf = pd.read_csv('user_behavior.csv')\n\n# 将timestamp转为datetime\ndf['datetime'] = pd.to_datetime(df['timestamp'], unit='s')\n\n# 提取日期和小时\ndf['date'] = df['datetime'].dt.date\ndf['hour'] = df['datetime'].dt.hour"
            },
            {
                "title": "计算PV和UV",
                "code": "# 计算每小时PV\nhourly_pv = df.groupby(['date', 'hour']).size().reset_index(name='pv')\n\n# 计算每小时UV\nhourly_uv = df.groupby(['date', 'hour'])['user_id'].nunique().reset_index(name='uv')\n\n# 合并PV和UV数据\nhourly_metrics = pd.merge(hourly_pv, hourly_uv, on=['date', 'hour'])"
            },
            {
                "title": "漏斗分析",
                "code": "# 计算各行为的用户数\nclick_users = df[df['behavior_type'] == 1]['user_id'].nunique()\ncollect_users = df[df['behavior_type'] == 2]['user_id'].nunique()\ncart_users = df[df['behavior_type'] == 3]['user_id'].nunique()\nbuy_users = df[df['behavior_type'] == 4]['user_id'].nunique()\n\n# 计算转化率\nclick_to_collect = collect_users / click_users\nclick_to_cart = cart_users / click_users\ncollect_to_buy = buy_users / collect_users\ncart_to_buy = buy_users / cart_users\n\nprint(f'点击到收藏转化率: {click_to_collect:.2f}')\nprint(f'点击到加购转化率: {click_to_cart:.2f}')\nprint(f'收藏到购买转化率: {collect_to_buy:.2f}')\nprint(f'加购到购买转化率: {cart_to_buy:.2f}')"
            },
            {
                "title": "识别只加购不支付的用户",
                "code": "# 提取加购用户\ncart_users = set(df[df['behavior_type'] == 3]['user_id'])\n\n# 提取支付用户\nbuy_users = set(df[df['behavior_type'] == 4]['user_id'])\n\n# 只加购不支付的用户\nonly_cart_users = cart_users - buy_users\n\nprint(f'只加购不支付的用户数: {len(only_cart_users)}')\n\n# 分析这些用户的加购时间分布\nonly_cart_df = df[(df['user_id'].isin(only_cart_users)) & (df['behavior_type'] == 3)]\nhourly_cart_dist = only_cart_df.groupby('hour').size().reset_index(name='count')"
            }
        ],
        "datasetLink": "https://tianchi.aliyun.com/dataset/dataDetail?dataId=649"
    },
    {
        "id": 3,
        "title": "商品销售趋势分析与库存预警",
        "description": "电商运营团队需要掌握各品类商品的销售趋势，识别畅销品与滞销品，建立库存预警机制，为采购和促销策略提供数据支持。",
        "difficulty": "中级",
        "category": "销售分析",
        "duration": "5小时",
        "popularity": 82,
        "learningObjectives": [
            "掌握按时间维度的聚合分析（日/周/月）",
            "学会计算移动平均和环比增长率",
            "掌握TopN分析与分组排名",
            "学会使用pandas进行数据透视与多维度分组统计"
        ],
        "coreTasks": [
            "按日期聚合每日销售额，绘制销售趋势折线图，计算7日移动平均平滑趋势",
            "按商品品类分组，计算各品类月度销售额环比增长率，识别增长最快和下滑最严重的品类",
            "找出销售额Top10的商品，以及滞销（连续30天无销售）的商品列表",
            "建立简单的库存预警规则：当某商品库存量低于过去30天日均销量的3倍时，标记为\"需补货\"",
            "输出一份商品运营报告，包含畅销榜、滞销榜和补货建议清单"
        ],
        "technicalPoints": [
            "groupby() + resample() 按日期重采样",
            "rolling(window=7).mean() 移动平均",
            "pct_change() 计算环比增长率",
            "nlargest() / nsmallest() 获取TopN",
            "条件判断与标记"
        ],
        "taskSteps": [
            "按日期聚合销售额，绘制每日销售额折线图，并叠加7日移动平均线",
            "按月聚合品类销售额，计算各品类环比增长率，筛选出增长最快/下降最多的前3名品类",
            "计算每个商品的总销售额，找出Top10商品；计算每个商品最近一次销售日期，筛选出距今≥30天无销售的商品作为滞销品",
            "对每个商品，计算过去30天的日均销量（排除滞销期），与当前库存比较，若库存 < 日均销量*3，则标记为\"需补货\"",
            "生成Excel报告，包含多个sheet"
        ],
        "dataDescription": "基于项目一清洗后的销售数据，并增加\"库存量\"字段（可模拟生成）。关键字段：商品ID、商品品类、销售日期、销售数量、销售额、当前库存。",
        "extensionThinking": [
            "节假日效应如何影响销售趋势？如何剔除周期性因素？",
            "库存预警阈值（3倍）是否合理？如何通过历史数据优化阈值？",
            "如何将补货建议与采购成本优化结合？"
        ],
        "codeExamples": [
            {
                "title": "销售趋势分析",
                "code": "import pandas as pd\nimport matplotlib.pyplot as plt\n\n# 加载数据\ndf = pd.read_csv('sales_clean.csv')\ndf['销售日期'] = pd.to_datetime(df['销售日期'])\n\n# 按日期聚合销售额\ndaily_sales = df.groupby('销售日期')['销售金额'].sum().reset_index()\ndaily_sales = daily_sales.set_index('销售日期')\n\n# 计算7日移动平均\ndaily_sales['7日移动平均'] = daily_sales['销售金额'].rolling(window=7).mean()\n\n# 绘制趋势图\nplt.figure(figsize=(12, 6))\nplt.plot(daily_sales['销售金额'], label='每日销售额')\nplt.plot(daily_sales['7日移动平均'], label='7日移动平均', linewidth=2)\nplt.title('销售趋势分析')\nplt.xlabel('日期')\nplt.ylabel('销售额')\nplt.legend()\nplt.show()"
            },
            {
                "title": "品类销售分析",
                "code": "# 按月和品类聚合销售额\nmonthly_category_sales = df.groupby([pd.Grouper(key='销售日期', freq='M'), '商品品类'])['销售金额'].sum().reset_index()\n\n# 计算各品类环比增长率\nmonthly_category_sales['环比增长率'] = monthly_category_sales.groupby('商品品类')['销售金额'].pct_change() * 100\n\n# 筛选增长最快的前3个品类\ntop_growth_categories = monthly_category_sales.sort_values('环比增长率', ascending=False).head(3)\n\n# 筛选下滑最严重的前3个品类\ntop_decline_categories = monthly_category_sales.sort_values('环比增长率').head(3)\n\nprint('增长最快的品类:')\nprint(top_growth_categories)\nprint('\n下滑最严重的品类:')\nprint(top_decline_categories)"
            },
            {
                "title": "畅销品和滞销品分析",
                "code": "# 计算每个商品的总销售额\nproduct_sales = df.groupby('商品ID')['销售金额'].sum().reset_index()\n\n# 找出Top10商品\ntop10_products = product_sales.nlargest(10, '销售金额')\n\n# 计算每个商品最近一次销售日期\nlast_sale_date = df.groupby('商品ID')['销售日期'].max().reset_index()\n\n# 计算距今天数\ntoday = pd.Timestamp('2026-04-20')  # 假设当前日期\nlast_sale_date['滞销天数'] = (today - last_sale_date['销售日期']).dt.days\n\n# 筛选滞销品（连续30天无销售）\nslow_moving_products = last_sale_date[last_sale_date['滞销天数'] >= 30]\n\nprint('Top10畅销商品:')\nprint(top10_products)\nprint('\n滞销商品:')\nprint(slow_moving_products)"
            },
            {
                "title": "库存预警",
                "code": "# 假设我们有库存数据\ninventory_data = pd.read_csv('inventory.csv')\n\n# 计算过去30天的日均销量\nthirty_days_ago = today - pd.Timedelta(days=30)\nrecent_sales = df[df['销售日期'] >= thirty_days_ago]\ndaily_avg_sales = recent_sales.groupby('商品ID')['销售数量'].mean().reset_index()\ndaily_avg_sales.columns = ['商品ID', '日均销量']\n\n# 合并库存数据\ninventory_analysis = pd.merge(inventory_data, daily_avg_sales, on='商品ID', how='left')\n\n# 填充缺失值（无销量的商品）\ninventory_analysis['日均销量'] = inventory_analysis['日均销量'].fillna(0)\n\n# 计算预警阈值\ninventory_analysis['预警阈值'] = inventory_analysis['日均销量'] * 3\n\n# 标记需补货商品\ninventory_analysis['需补货'] = inventory_analysis['当前库存'] < inventory_analysis['预警阈值']\n\n# 筛选需补货商品\nneed_replenish = inventory_analysis[inventory_analysis['需补货']]\n\nprint('需补货商品:')\nprint(need_replenish)"
            }
        ],
        "datasetLink": "https://www.kaggle.com/datasets/kyanyoga/sample-sales-data"
    },
    {
        "id": 4,
        "title": "购物篮分析与关联规则挖掘",
        "description": "运营团队发现某些商品经常被一起购买，希望通过数据分析发现商品之间的关联规律，优化捆绑销售策略和商品货架布局。这是电商数据分析中最经典的购物篮分析（Market Basket Analysis）场景。",
        "difficulty": "中级",
        "category": "数据挖掘",
        "duration": "6小时",
        "popularity": 79,
        "learningObjectives": [
            "掌握将订单明细转换为订单-商品交易矩阵的方法",
            "理解支持度（Support）、置信度（Confidence）、提升度（Lift）的含义与计算",
            "学会使用mlxtend库实现Apriori算法进行关联规则挖掘",
            "掌握关联规则的可视化与业务解读"
        ],
        "coreTasks": [
            "从订单明细数据中提取订单ID和商品ID，去重后构建订单-商品交易矩阵（每个订单一行，每个商品一列，值为0/1表示是否购买）",
            "使用apriori()函数设置min_support阈值，挖掘频繁项集",
            "使用association_rules()生成关联规则，按提升度（Lift）降序排列，筛选Lift>1且有意义的规则",
            "分析挖掘出的强关联规则（如\"购买A的用户有70%会同时购买B\"），给出捆绑销售建议",
            "绘制支持度-置信度散点图，可视化规则分布",
            "输出购物篮分析报告，包含Top10关联规则及营销策略建议"
        ],
        "technicalPoints": [
            "groupby() + unstack() 构建交易矩阵",
            "mlxtend.frequent_patterns.apriori()",
            "mlxtend.frequent_patterns.association_rules()",
            "支持度、置信度、提升度的业务含义",
            "散点图：plt.scatter()"
        ],
        "taskSteps": [
            "数据预处理：删除退货订单（InvoiceNo含C的），只保留正常交易",
            "每个订单内商品去重（一个订单多次购买同一商品视为一次），生成订单-商品列表",
            "使用pandas的crosstab()或pivot_table()生成交易矩阵（one-hot编码）",
            "调用apriori()，设置min_support=0.01（根据数据稀疏程度调整）",
            "调用association_rules()，按lift降序，筛选lift > 1且confidence > 0.5的规则",
            "解读Top10规则：例如\"{全脂牛奶} → {酸奶}\"，提升度2.5表示购买全脂牛奶的用户购买酸奶的概率是普通用户的2.5倍",
            "绘制支持度-置信度散点图，用颜色表示提升度"
        ],
        "dataDescription": "数据源：Kaggle上的\"Online Retail Dataset\"（在线零售数据集），或老师提供的online_retail.csv。关键字段：InvoiceNo（订单号）、StockCode（商品代码）、Description（商品描述）、Quantity（数量）、InvoiceDate（日期）。",
        "extensionThinking": [
            "如何处理大量商品导致的矩阵稀疏问题？",
            "关联规则挖掘结果中可能出现冗余规则（如A→B和A,B→C），如何精简？",
            "如何将关联规则与个性化推荐系统结合？"
        ],
        "codeExamples": [
            {
                "title": "数据预处理",
                "code": "import pandas as pd\n\n# 加载数据\ndf = pd.read_csv('online_retail.csv')\n\n# 删除退货订单（InvoiceNo含C的）\ndf = df[~df['InvoiceNo'].str.contains('C', na=False)]\n\n# 删除缺失值\ndf = df.dropna(subset=['InvoiceNo', 'StockCode', 'Description'])\n\n# 每个订单内商品去重\ndf = df.drop_duplicates(subset=['InvoiceNo', 'StockCode'])\n\n# 只保留数量为正的记录\ndf = df[df['Quantity'] > 0]"
            },
            {
                "title": "构建交易矩阵",
                "code": "# 构建交易矩阵（one-hot编码）\nbasket = (df.groupby(['InvoiceNo', 'Description'])['Quantity']\n          .sum().unstack().reset_index().fillna(0)\n          .set_index('InvoiceNo'))\n\n# 将数量转换为0/1（是否购买）\ndef encode_units(x):\n    if x <= 0:\n        return 0\n    else:\n        return 1\n\nbasket_sets = basket.applymap(encode_units)\n\n# 删除购买次数较少的商品（可选）\nbasket_sets = basket_sets[basket_sets.sum(axis=0) >= 5]"
            },
            {
                "title": "Apriori算法挖掘频繁项集",
                "code": "from mlxtend.frequent_patterns import apriori, association_rules\n\n# 挖掘频繁项集\nfrequent_itemsets = apriori(basket_sets, min_support=0.01, use_colnames=True)\n\n# 生成关联规则\nrules = association_rules(frequent_itemsets, metric='lift', min_threshold=1)\n\n# 按提升度降序排序\nrules = rules.sort_values('lift', ascending=False)\n\n# 筛选置信度大于0.5的规则\nrules = rules[rules['confidence'] > 0.5]\n\nprint('Top10关联规则:')\nprint(rules.head(10))"
            },
            {
                "title": "可视化关联规则",
                "code": "import matplotlib.pyplot as plt\nimport seaborn as sns\n\n# 绘制支持度-置信度散点图\nplt.figure(figsize=(10, 6))\nsns.scatterplot(x='support', y='confidence', hue='lift', size='lift',\n                data=rules, palette='viridis', sizes=(10, 200))\nplt.title('关联规则支持度-置信度散点图')\nplt.xlabel('支持度')\nplt.ylabel('置信度')\nplt.legend(title='提升度')\nplt.show()"
            }
        ],
        "datasetLink": "https://www.kaggle.com/datasets/mashlyn/online-retail-ii-uci"
    },
    {
        "id": 5,
        "title": "RFM用户价值分层与精细化运营",
        "description": "电商平台的用户量已达数十万，但不同用户的价值差异巨大。运营团队希望建立一套用户价值分层体系，识别高价值用户、潜力用户和流失风险用户，实现差异化运营。",
        "difficulty": "中级",
        "category": "用户分析",
        "duration": "5小时",
        "popularity": 85,
        "learningObjectives": [
            "掌握RFM模型（最近购买时间R、购买频率F、消费金额M）的构建方法",
            "学会对连续数值进行离散化分箱（pd.cut()、qcut()）",
            "掌握用户分层打分与分群逻辑",
            "学会分析不同用户群体的消费行为差异"
        ],
        "coreTasks": [
            "基于订单数据，按用户计算三个RFM指标：R（最近一次购买距离当前日期的天数）、F（购买总次数）、M（消费总金额）",
            "对R、F、M分别进行分箱打分（如1-5分，分数越高代表表现越好）",
            "计算每个用户的RFM综合得分或得分组合（如\"R5F5M5\"），将用户划分为：高价值用户、重点保持用户、重点挽留用户、一般用户、流失用户",
            "分析各层级用户的人数占比、消费贡献占比、平均客单价等特征",
            "针对不同用户群体输出运营策略建议"
        ],
        "technicalPoints": [
            "groupby().agg() 聚合计算R/F/M",
            "pd.to_datetime() 计算日期差",
            "pd.cut() / qcut() 分箱打分",
            "用户分层标签生成",
            "分组统计与可视化"
        ],
        "taskSteps": [
            "设定分析时间点（如数据中最大日期+1天），计算每个用户的R、F、M",
            "分别对R、F、M进行分箱：R值越小越好（近期购买），可逆向打分；F和M越大越好，正向打分。使用qcut分为5等份，赋予1-5分",
            "构建RFM总分 = R_score + F_score + M_score（或加权），或保留三位组合",
            "根据业务经验定义分层规则：高价值用户（R>=4且F>=4且M>=4）、重点保持用户（R<=2但F>=4且M>=4）、重点挽留用户（R<=2且F<=2但M>=4）、一般用户（其他）、流失用户（R=1且F=1且M=1）",
            "统计各层人数、总消费金额、客单价、平均购买次数",
            "输出策略：高价值用户→专属客服；重点挽留用户→发送优惠券；流失用户→召回活动"
        ],
        "dataDescription": "项目一清洗后的销售数据（含订单日期、用户ID、订单金额）。关键字段：user_id, order_date, amount。",
        "extensionThinking": [
            "RFM分箱用等频分箱还是等宽分箱？各有什么优缺点？",
            "如何引入货币的时间价值（例如近期的消费权重更高）？",
            "除了RFM，还可以加入哪些行为指标（如浏览深度、优惠券使用率）？"
        ],
        "codeExamples": [
            {
                "title": "计算RFM指标",
                "code": "import pandas as pd\n\n# 加载数据\ndf = pd.read_csv('sales_clean.csv')\ndf['订单日期'] = pd.to_datetime(df['订单日期'])\n\n# 设定分析时间点\nanalysis_date = df['订单日期'].max() + pd.Timedelta(days=1)\n\n# 计算RFM指标\nrfm = df.groupby('用户ID').agg(\n    R=('订单日期', lambda x: (analysis_date - x.max()).days),\n    F=('订单号', 'nunique'),\n    M=('销售金额', 'sum')\n).reset_index()\n\nprint('RFM指标计算结果:')\nprint(rfm.head())"
            },
            {
                "title": "RFM分箱打分",
                "code": "# 对R、F、M进行分箱打分\n# R值越小越好，逆向打分\nrfm['R_score'] = pd.qcut(rfm['R'], 5, labels=[5, 4, 3, 2, 1])\n\n# F值越大越好，正向打分\nrfm['F_score'] = pd.qcut(rfm['F'], 5, labels=[1, 2, 3, 4, 5])\n\n# M值越大越好，正向打分\nrfm['M_score'] = pd.qcut(rfm['M'], 5, labels=[1, 2, 3, 4, 5])\n\n# 转换为数值类型\nrfm['R_score'] = rfm['R_score'].astype(int)\nrfm['F_score'] = rfm['F_score'].astype(int)\nrfm['M_score'] = rfm['M_score'].astype(int)\n\n# 计算RFM总分\nrfm['RFM_score'] = rfm['R_score'] + rfm['F_score'] + rfm['M_score']\n\n# 生成RFM组合标签\nrfm['RFM_label'] = rfm['R_score'].astype(str) + rfm['F_score'].astype(str) + rfm['M_score'].astype(str)"
            },
            {
                "title": "用户分层",
                "code": "# 定义用户分层规则\ndef user_segment(row):\n    r = row['R_score']\n    f = row['F_score']\n    m = row['M_score']\n    \n    if r >= 4 and f >= 4 and m >= 4:\n        return '高价值用户'\n    elif r <= 2 and f >= 4 and m >= 4:\n        return '重点保持用户'\n    elif r <= 2 and f <= 2 and m >= 4:\n        return '重点挽留用户'\n    elif r == 1 and f == 1 and m == 1:\n        return '流失用户'\n    else:\n        return '一般用户'\n\n# 应用分层规则\nrfm['用户分层'] = rfm.apply(user_segment, axis=1)\n\n# 统计各层用户数量\nsegment_counts = rfm['用户分层'].value_counts()\nprint('各层用户数量:')\nprint(segment_counts)"
            },
            {
                "title": "用户分层分析",
                "code": "# 分析各层用户的特征\nsegment_analysis = rfm.groupby('用户分层').agg(\n    用户数=('用户ID', 'count'),\n    总消费金额=('M', 'sum'),\n    平均消费金额=('M', 'mean'),\n    平均购买频率=('F', 'mean'),\n    平均最近购买天数=('R', 'mean')\n).round(2)\n\nprint('各层用户特征分析:')\nprint(segment_analysis)\n\n# 计算各层用户的消费贡献占比\ntotal_revenue = rfm['M'].sum()\nsegment_analysis['消费贡献占比'] = (segment_analysis['总消费金额'] / total_revenue * 100).round(2)\n\nprint('\n各层用户消费贡献占比:')\nprint(segment_analysis[['用户数', '总消费金额', '消费贡献占比']])"
            }
        ],
        "datasetLink": "https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce"
    },
    {
        "id": 6,
        "title": "用户留存分析与复购行为预测",
        "description": "电商平台发现新用户的复购率持续偏低，影响了平台的长期增长。数据分析团队需要深入了解用户的复购行为模式，识别影响复购的关键因素，并为运营团队提供改善留存的建议。",
        "difficulty": "中级",
        "category": "用户分析",
        "duration": "6小时",
        "popularity": 81,
        "learningObjectives": [
            "掌握留存率的计算方法和留存曲线绘制",
            "学会按用户生命周期阶段分析行为特征",
            "掌握基于历史行为的简单预测方法",
            "学会从多维度对比分析用户行为差异"
        ],
        "coreTasks": [
            "计算新用户的次日留存、7日留存、30日留存率，绘制留存曲线",
            "按用户首次购买时间分组（Cohort），计算各Cohort的后续复购率，绘制Cohort留存矩阵热力图",
            "对比复购用户与一次性购买用户在以下维度的差异：购买品类分布、平均客单价、浏览深度、促销参与度",
            "分析用户的复购周期规律（如母婴类用户每XX天复购一次），输出各品类的典型复购周期",
            "基于用户历史行为特征（如过去30天购买次数、是否使用优惠券、平均浏览时长），构建简单的复购倾向评分模型"
        ],
        "technicalPoints": [
            "Cohort分析（按首次购买月份分组，计算后续各月的复购率）",
            "留存率计算：自定义聚合函数",
            "热力图：seaborn.heatmap()",
            "分组对比：groupby().mean() 等",
            "简单评分模型：使用加权评分或逻辑回归（可选）"
        ],
        "taskSteps": [
            "确定每个用户首次购买日期，标记为新用户获取时间",
            "对于每个用户，计算其在注册后第1天、第7天、第30天是否再次购买，得出留存率",
            "按月份进行Cohort分析：建立矩阵，行=首次购买月份，列=注册后第n个月，值=该月复购用户数/该cohort总用户数",
            "将用户分为\"复购用户\"（购买≥2次）和\"一次性用户\"，对比两者的平均客单价、品类偏好（饼图/柱状图）、促销参与率",
            "对每个品类，计算用户两次购买之间的平均间隔天数",
            "构建简单复购倾向评分：如分数 = 过去30天登录次数*0.3 + 收藏商品数*0.2 + 加购次数*0.5，按分数高低将用户分为高/中/低复购潜力"
        ],
        "dataDescription": "项目一清洗后的用户订单数据 + 项目二的用户行为日志（可选）。关键字段：user_id, order_date, amount, category, coupon_used, browse_duration。",
        "extensionThinking": [
            "如何排除促销活动对留存率的干扰？",
            "如果用户第一次购买后很久才第二次购买，应如何定义\"复购\"？",
            "留存分析如何指导产品功能优化？"
        ],
        "codeExamples": [
            {
                "title": "计算留存率",
                "code": "import pandas as pd\n\n# 加载数据\ndf = pd.read_csv('user_orders.csv')\ndf['order_date'] = pd.to_datetime(df['order_date'])\n\n# 确定每个用户的首次购买日期\nfirst_purchase = df.groupby('user_id')['order_date'].min().reset_index()\nfirst_purchase.columns = ['user_id', 'first_purchase_date']\n\n# 合并首次购买日期\ndf = pd.merge(df, first_purchase, on='user_id')\n\n# 计算每个订单距离首次购买的天数\ndf['days_since_first'] = (df['order_date'] - df['first_purchase_date']).dt.days\n\n# 计算留存率\n# 次日留存（第1天）\nday1_retention = df[df['days_since_first'] == 1]['user_id'].nunique() / first_purchase['user_id'].nunique()\n\n# 7日留存\nday7_retention = df[df['days_since_first'] == 7]['user_id'].nunique() / first_purchase['user_id'].nunique()\n\n# 30日留存\nday30_retention = df[df['days_since_first'] == 30]['user_id'].nunique() / first_purchase['user_id'].nunique()\n\nprint(f'次日留存率: {day1_retention:.2f}')\nprint(f'7日留存率: {day7_retention:.2f}')\nprint(f'30日留存率: {day30_retention:.2f}')"
            },
            {
                "title": "Cohort分析",
                "code": "# 按月份分组进行Cohort分析\ndf['cohort_month'] = df['first_purchase_date'].dt.to_period('M')\ndf['order_month'] = df['order_date'].dt.to_period('M')\n\n# 计算每个用户在每个月的购买情况\ncohort_data = df.groupby(['cohort_month', 'user_id'])['order_month'].nunique().reset_index()\ncohort_data.columns = ['cohort_month', 'user_id', 'purchase_in_month']\n\n# 计算每个Cohort的大小\ncohort_sizes = df.groupby('cohort_month')['user_id'].nunique()\n\n# 计算每个Cohort在后续各月的留存率\nretention_matrix = []\nfor cohort in cohort_sizes.index:\n    cohort_users = df[df['cohort_month'] == cohort]['user_id'].unique()\n    cohort_retention = []\n    for i in range(12):  # 假设分析12个月\n        target_month = cohort + i\n        if target_month in df['order_month'].unique():\n            retained_users = df[(df['user_id'].isin(cohort_users)) & (df['order_month'] == target_month)]['user_id'].nunique()\n            retention_rate = retained_users / len(cohort_users)\n        else:\n            retention_rate = 0\n        cohort_retention.append(retention_rate)\n    retention_matrix.append(cohort_retention)\n\n# 构建留存矩阵DataFrame\nretention_df = pd.DataFrame(retention_matrix, index=cohort_sizes.index, columns=[f'Month {i+1}' for i in range(12)])\nprint('Cohort留存矩阵:')\nprint(retention_df)"
            },
            {
                "title": "复购用户与一次性用户对比",
                "code": "# 计算每个用户的购买次数\nuser_purchase_count = df.groupby('user_id')['order_id'].nunique().reset_index()\nuser_purchase_count.columns = ['user_id', 'purchase_count']\n\n# 标记用户类型\nuser_purchase_count['user_type'] = user_purchase_count['purchase_count'].apply(lambda x: '复购用户' if x >= 2 else '一次性用户')\n\n# 合并用户类型\ndf = pd.merge(df, user_purchase_count[['user_id', 'user_type']], on='user_id')\n\n# 对比分析\nuser_type_analysis = df.groupby('user_type').agg(\n    平均客单价=('amount', 'mean'),\n    平均浏览时长=('browse_duration', 'mean'),\n    促销参与率=('coupon_used', 'mean')\n).round(2)\n\nprint('复购用户与一次性用户对比:')\nprint(user_type_analysis)\n\n# 分析品类偏好\ncategory_preference = df.groupby(['user_type', 'category'])['order_id'].nunique().reset_index()\ncategory_preference = category_preference.pivot(index='user_type', columns='category', values='order_id').fillna(0)\nprint('\n品类偏好:')\nprint(category_preference)"
            },
            {
                "title": "复购周期分析",
                "code": "# 计算用户的复购间隔\nuser_orders = df.sort_values(['user_id', 'order_date']).groupby('user_id')['order_date'].apply(list).reset_index()\n\ndef calculate_intervals(dates):\n    intervals = []\n    for i in range(1, len(dates)):\n        interval = (dates[i] - dates[i-1]).days\n        intervals.append(interval)\n    return intervals\n\nuser_orders['intervals'] = user_orders['order_date'].apply(calculate_intervals)\n\n# 展开间隔数据\ninterval_data = []\nfor _, row in user_orders.iterrows():\n    user_id = row['user_id']\n    for interval in row['intervals']:\n        interval_data.append({'user_id': user_id, 'interval_days': interval})\n\ninterval_df = pd.DataFrame(interval_data)\n\n# 按品类分析复购周期\nuser_category = df.groupby('user_id')['category'].agg(lambda x: x.mode().iloc[0]).reset_index()\ninterval_df = pd.merge(interval_df, user_category, on='user_id')\n\n# 计算各品类的平均复购周期\ncategory_interval = interval_df.groupby('category')['interval_days'].mean().reset_index()\ncategory_interval = category_interval.sort_values('interval_days')\n\nprint('各品类平均复购周期:')\nprint(category_interval)"
            }
        ],
        "datasetLink": "https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce"
    },
    {
        "id": 7,
        "title": "用户画像构建与精准营销标签体系",
        "description": "市场部门需要深入了解不同用户群体的特征，建立可落地的用户画像标签体系，为精准营销提供数据支撑。项目需要从人口属性、消费行为、偏好特征等多个维度构建完整的用户画像。",
        "difficulty": "高级",
        "category": "用户分析",
        "duration": "7小时",
        "popularity": 78,
        "learningObjectives": [
            "掌握多源数据融合与特征工程方法",
            "学会构建用户画像标签体系（基础属性、行为标签、价值标签、偏好标签）",
            "掌握基于规则和基于统计的用户标签计算方法",
            "学会用户画像的可视化呈现"
        ],
        "coreTasks": [
            "融合用户基础信息表（年龄、性别、地域）、行为日志表、订单表，构建用户级宽表",
            "构建多维用户标签：基础标签（年龄段、性别、城市等级）、行为标签（活跃时段、登录频率）、价值标签（客单价分层、生命周期阶段）、偏好标签（偏好品类Top3、价格敏感度）",
            "统计各标签维度的用户分布情况，绘制用户画像看板（如年龄分布饼图、品类偏好词云、地域分布地图）",
            "针对\"高价值-母婴品类偏好\"这一特定用户群体，输出完整的群体画像分析报告",
            "基于用户画像，为营销团队设计3个精准营销场景"
        ],
        "technicalPoints": [
            "多表合并：pd.merge()",
            "标签分箱：pd.cut()",
            "聚合统计：groupby().agg()",
            "可视化：饼图、柱状图、地图（如pyecharts或plotly）",
            "词云：wordcloud库"
        ],
        "taskSteps": [
            "读取用户信息表、订单表、行为日志表，通过user_id进行左连接，得到用户级宽表",
            "定义标签函数：年龄段、活跃时段、客单价分层、偏好品类",
            "统计各标签人数占比，绘制图表",
            "筛选条件：value_level='高' 且 favorite_category='母婴'，输出该群体的人数、平均客单价、主要地域、活跃时段等",
            "设计三个营销场景示例：向价格敏感型用户推送优惠券、向夜猫子型用户推送深夜限时秒杀、向母婴偏好用户推送亲子活动或新品"
        ],
        "dataDescription": "整合项目一至六的数据，并补充用户基础信息表（可模拟生成）。关键字段：user_id, age, gender, city, registration_date, last_login, total_amount, favorite_category, price_sensitivity等。",
        "extensionThinking": [
            "用户标签的时效性如何管理？是否需要衰减？",
            "如何处理跨品类偏好的用户（多个偏好）？",
            "如何用机器学习自动生成标签（如聚类标签）？"
        ],
        "codeExamples": [
            {
                "title": "数据融合",
                "code": "import pandas as pd\n\n# 加载各表数据\nuser_info = pd.read_csv('user_info.csv')  # 包含用户基础信息\norders = pd.read_csv('orders.csv')  # 订单数据\nbehavior_logs = pd.read_csv('behavior_logs.csv')  # 行为日志\n\n# 计算用户消费总金额和购买次数\nuser_purchase = orders.groupby('user_id').agg(\n    total_amount=('amount', 'sum'),\n    purchase_count=('order_id', 'nunique'),\n    last_purchase_date=('order_date', 'max')\n).reset_index()\n\n# 计算用户行为指标\nuser_behavior = behavior_logs.groupby('user_id').agg(\n    login_count=('action', lambda x: (x == 'login').sum()),\n    browse_count=('action', lambda x: (x == 'browse').sum()),\n    collect_count=('action', lambda x: (x == 'collect').sum()),\n    cart_count=('action', lambda x: (x == 'cart').sum()),\n    avg_browse_duration=('duration', 'mean')\n).reset_index()\n\n# 构建用户级宽表\nuser_profile = pd.merge(user_info, user_purchase, on='user_id', how='left')\nuser_profile = pd.merge(user_profile, user_behavior, on='user_id', how='left')\n\n# 填充缺失值\nuser_profile = user_profile.fillna(0)\nprint('用户宽表结构:')\nprint(user_profile.columns)"
            },
            {
                "title": "构建用户标签",
                "code": "# 1. 基础标签\n# 年龄段标签\nuser_profile['age_group'] = pd.cut(user_profile['age'], bins=[0,18,26,36,45,100], labels=['<18','18-25','26-35','36-45','45+'])\n\n# 城市等级标签（假设已有城市等级信息）\n# 这里简化处理，实际应根据城市规模划分\nuser_profile['city_level'] = user_profile['city'].apply(lambda x: '一线' if x in ['北京', '上海', '广州', '深圳'] else '二线' if x in ['杭州', '南京', '武汉', '成都'] else '其他')\n\n# 2. 行为标签\n# 活跃时段标签（基于最后登录时间）\nuser_profile['last_login'] = pd.to_datetime(user_profile['last_login'])\nuser_profile['login_hour'] = user_profile['last_login'].dt.hour\n\ndef get_active_period(hour):\n    if 5 <= hour < 11:\n        return '早'\n    elif 11 <= hour < 14:\n        return '午'\n    elif 17 <= hour < 22:\n        return '晚'\n    else:\n        return '夜'\n\nuser_profile['active_period'] = user_profile['login_hour'].apply(get_active_period)\n\n# 登录频率标签\nuser_profile['login_frequency'] = pd.qcut(user_profile['login_count'], 3, labels=['低频', '中频', '高频'])\n\n# 3. 价值标签\n# 客单价分层\nuser_profile['avg_order_value'] = user_profile['total_amount'] / user_profile['purchase_count'].replace(0, 1)\nuser_profile['value_level'] = pd.qcut(user_profile['avg_order_value'], 3, labels=['低', '中', '高'])\n\n# 生命周期阶段\ndef get_life_cycle(row):\n    if row['purchase_count'] == 0:\n        return '新客'\n    elif row['purchase_count'] < 5:\n        return '成长'\n    elif (pd.Timestamp.now() - pd.to_datetime(row['last_purchase_date'])).days <= 30:\n        return '成熟'\n    else:\n        return '流失'\n\nuser_profile['life_cycle'] = user_profile.apply(get_life_cycle, axis=1)\n\n# 4. 偏好标签\n# 偏好品类（基于订单数据）\ncategory_pref = orders.groupby(['user_id', 'category'])['amount'].sum().reset_index()\ntop_category = category_pref.sort_values(['user_id', 'amount'], ascending=[True, False]).groupby('user_id').head(1)\ntop_category = top_category[['user_id', 'category']].rename(columns={'category': 'favorite_category'})\nuser_profile = pd.merge(user_profile, top_category, on='user_id', how='left')\n\n# 价格敏感度（基于是否使用优惠券）\nuser_profile['price_sensitivity'] = user_profile['coupon_used'].apply(lambda x: '高' if x > 0 else '低')"
            },
            {
                "title": "用户画像可视化",
                "code": "import matplotlib.pyplot as plt\nimport seaborn as sns\nfrom wordcloud import WordCloud\n\n# 1. 年龄分布饼图\nplt.figure(figsize=(8, 6))\nage_dist = user_profile['age_group'].value_counts()\nplt.pie(age_dist, labels=age_dist.index, autopct='%1.1f%%', startangle=90)\nplt.title('用户年龄分布')\nplt.axis('equal')\nplt.show()\n\n# 2. 价值等级分布\nplt.figure(figsize=(8, 6))\nvalue_dist = user_profile['value_level'].value_counts()\nsns.barplot(x=value_dist.index, y=value_dist.values)\nplt.title('用户价值等级分布')\nplt.xlabel('价值等级')\nplt.ylabel('用户数')\nplt.show()\n\n# 3. 活跃时段分布\nplt.figure(figsize=(8, 6))\nactive_dist = user_profile['active_period'].value_counts()\nsns.barplot(x=active_dist.index, y=active_dist.values)\nplt.title('用户活跃时段分布')\nplt.xlabel('活跃时段')\nplt.ylabel('用户数')\nplt.show()\n\n# 4. 品类偏好词云\ncategory_text = ' '.join(user_profile['favorite_category'].dropna().tolist())\nwordcloud = WordCloud(width=800, height=400, background_color='white').generate(category_text)\nplt.figure(figsize=(10, 6))\nplt.imshow(wordcloud, interpolation='bilinear')\nplt.axis('off')\nplt.title('用户品类偏好词云')\nplt.show()"
            },
            {
                "title": "特定用户群体分析",
                "code": "# 筛选高价值-母婴品类偏好用户\ntarget_users = user_profile[(user_profile['value_level'] == '高') & (user_profile['favorite_category'] == '母婴')]\n\nprint(f'高价值-母婴品类偏好用户数: {len(target_users)}')\nprint(f'占总用户比例: {len(target_users)/len(user_profile):.2f}')\n\n# 分析该群体特征\ntarget_analysis = target_users.agg(\n    平均年龄=('age', 'mean'),\n    平均客单价=('avg_order_value', 'mean'),\n    平均购买次数=('purchase_count', 'mean'),\n    平均登录次数=('login_count', 'mean'),\n    女性占比=('gender', lambda x: (x == '女').mean())\n).round(2)\n\nprint('\n高价值-母婴品类偏好用户特征:')\nprint(target_analysis)\n\n# 分析地域分布\nregion_dist = target_users['city_level'].value_counts()\nprint('\n地域分布:')\nprint(region_dist)\n\n# 分析活跃时段\nactive_period_dist = target_users['active_period'].value_counts()\nprint('\n活跃时段分布:')\nprint(active_period_dist)"
            }
        ],
        "datasetLink": "https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce"
    },
    {
        "id": 8,
        "title": "电商用户聚类分析与客户分群",
        "description": "除了基于规则的RFM分层外，数据分析团队希望使用无监督学习算法——K-Means聚类——对用户进行更精细、更科学的群体划分，发现那些通过规则难以识别的隐藏用户模式。",
        "difficulty": "高级",
        "category": "数据挖掘",
        "duration": "8小时",
        "popularity": 76,
        "learningObjectives": [
            "掌握K-Means聚类算法的基本原理与实现",
            "学会数据标准化/归一化（StandardScaler）",
            "掌握肘方法（Elbow Method）确定最佳聚类数",
            "学会聚类结果的解读与可视化",
            "掌握聚类分析结果向业务策略的转化"
        ],
        "coreTasks": [
            "提取每个用户的聚类特征（如消费金额、购买频次、最近购买天数、平均客单价、平均浏览时长等），构造用户特征矩阵",
            "使用StandardScaler对特征进行标准化处理，消除量纲影响",
            "使用肘方法绘制SSE随K值变化的曲线，确定最佳聚类数（建议K=3~5）",
            "使用KMeans对用户进行聚类分群，将聚类标签写回用户表",
            "对每个聚类群体的特征均值进行分析，为每个群体命名（如\"高消费活跃型\"\"低频高价型\"\"高频低价型\"\"沉睡型\"等）",
            "可视化聚类结果（如PCA降维后的散点图、各群体特征雷达图）",
            "输出客户分群分析报告，为每个群体设计针对性的运营策略"
        ],
        "technicalPoints": [
            "sklearn.cluster.KMeans",
            "sklearn.preprocessing.StandardScaler",
            "肘方法：计算不同K值的inertia_，绘制曲线",
            "sklearn.decomposition.PCA 降维可视化",
            "雷达图：matplotlib 或 plotly"
        ],
        "taskSteps": [
            "选取聚类特征，删除缺失值（或填充）",
            "标准化特征矩阵",
            "对K=2到10，分别训练K-Means，记录SSE，绘制肘部图，选择拐点K",
            "使用选定的K值（如4）进行聚类，将labels_赋值给新列cluster",
            "按cluster分组，计算各特征的均值，观察不同群体的特征差异",
            "根据特征均值命名：Cluster0: 高金额、高频率、最近购买天数小 → \"忠诚活跃型\"；Cluster1: 低金额、低频、最近购买天数大 → \"沉睡流失型\"；Cluster2: 高客单价、低频、浏览时长长 → \"精挑细选型\"；Cluster3: 低客单价、高频、优惠券使用多 → \"薅羊毛型\"",
            "使用PCA将特征降维到2维，绘制散点图，不同颜色表示不同簇",
            "绘制雷达图，展示各簇在原始特征上的对比",
            "为每个群体输出运营策略"
        ],
        "dataDescription": "基于项目七构建的用户级宽表。关键特征：总消费金额、购买次数、最近购买天数、平均客单价、平均浏览时长、优惠券使用次数、收藏商品数。",
        "extensionThinking": [
            "K-Means对初始质心敏感，如何解决？（使用K-Means++，sklearn默认已采用）",
            "如果特征中包含分类变量，应如何处理？（使用独热编码或改用K-Prototypes算法）",
            "如何评估聚类效果（轮廓系数、Calinski-Harabasz指数）？"
        ],
        "codeExamples": [
            {
                "title": "特征准备与标准化",
                "code": "import pandas as pd\nfrom sklearn.preprocessing import StandardScaler\n\n# 加载用户数据\nuser_data = pd.read_csv('user_profile.csv')\n\n# 选取聚类特征\nfeatures = ['total_amount', 'purchase_count', 'days_since_last_purchase', 'avg_order_value', 'avg_browse_duration', 'coupon_used', 'collect_count']\n\n# 处理缺失值\nuser_data = user_data.dropna(subset=features)\n\n# 提取特征矩阵\nX = user_data[features]\n\n# 标准化特征\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\n\nprint('特征矩阵形状:', X_scaled.shape)"
            },
            {
                "title": "肘方法确定最佳聚类数",
                "code": "from sklearn.cluster import KMeans\nimport matplotlib.pyplot as plt\n\n# 计算不同K值的SSE\nsse = []\nfor k in range(2, 11):\n    kmeans = KMeans(n_clusters=k, random_state=42)\n    kmeans.fit(X_scaled)\n    sse.append(kmeans.inertia_)\n\n# 绘制肘部图\nplt.figure(figsize=(10, 6))\nplt.plot(range(2, 11), sse, marker='o')\nplt.title('肘方法确定最佳聚类数')\nplt.xlabel('聚类数K')\nplt.ylabel('SSE')\nplt.grid(True)\nplt.show()"
            },
            {
                "title": "K-Means聚类",
                "code": "# 选择最佳K值（假设为4）\noptimal_k = 4\n\n# 训练K-Means模型\nkmeans = KMeans(n_clusters=optimal_k, random_state=42)\ncluster_labels = kmeans.fit_predict(X_scaled)\n\n# 将聚类标签添加到用户数据\nuser_data['cluster'] = cluster_labels\n\n# 分析各聚类的特征均值\ncluster_analysis = user_data.groupby('cluster')[features].mean()\nprint('各聚类特征均值:')\nprint(cluster_analysis)"
            },
            {
                "title": "聚类结果可视化",
                "code": "from sklearn.decomposition import PCA\nimport seaborn as sns\n\n# 使用PCA降维到2维\npca = PCA(n_components=2)\nx_pca = pca.fit_transform(X_scaled)\n\n# 绘制散点图\nplt.figure(figsize=(10, 6))\nsns.scatterplot(x=x_pca[:, 0], y=x_pca[:, 1], hue=cluster_labels, palette='viridis', s=50)\nplt.title('K-Means聚类结果（PCA降维）')\nplt.xlabel('PCA Component 1')\nplt.ylabel('PCA Component 2')\nplt.legend(title='Cluster')\nplt.show()\n\n# 绘制雷达图\nimport numpy as np\n\n# 标准化特征均值用于雷达图\nnormalized_means = (cluster_analysis - cluster_analysis.min()) / (cluster_analysis.max() - cluster_analysis.min())\n\n# 每个特征的角度\nangles = np.linspace(0, 2 * np.pi, len(features), endpoint=False).tolist()\nangles += angles[:1]  # 闭合雷达图\n\nplt.figure(figsize=(10, 8))\nax = plt.subplot(111, polar=True)\n\n# 绘制每个聚类的雷达图\ncolors = ['blue', 'green', 'red', 'purple']\nfor i in range(optimal_k):\n    values = normalized_means.iloc[i].tolist()\n    values += values[:1]  # 闭合雷达图\n    ax.plot(angles, values, color=colors[i], linewidth=2, label=f'Cluster {i}')\n    ax.fill(angles, values, color=colors[i], alpha=0.25)\n\n# 设置标签\nax.set_xticks(angles[:-1])\nax.set_xticklabels(features, rotation=0, ha='center')\nax.set_ylim(0, 1)\nplt.title('各聚类特征雷达图')\nplt.legend(loc='upper right', bbox_to_anchor=(0.1, 0.1))\nplt.show()"
            },
            {
                "title": "聚类结果解读与命名",
                "code": "# 分析各聚类特征并命名\ncluster_names = {\n    0: '忠诚活跃型',  # 高金额、高频率、最近购买天数小\n    1: '沉睡流失型',  # 低金额、低频、最近购买天数大\n    2: '精挑细选型',  # 高客单价、低频、浏览时长长\n    3: '薅羊毛型'     # 低客单价、高频、优惠券使用多\n}\n\n# 添加聚类名称\nuser_data['cluster_name'] = user_data['cluster'].map(cluster_names)\n\n# 统计各聚类用户数量\ncluster_counts = user_data['cluster_name'].value_counts()\nprint('各聚类用户数量:')\nprint(cluster_counts)\n\n# 为每个聚类设计运营策略\nstrategies = {\n    '忠诚活跃型': [\n        '提供专属客服和VIP服务',\n        '定期推送新品和专属优惠',\n        '邀请参与产品测试和反馈'\n    ],\n    '沉睡流失型': [\n        '发送召回优惠券',\n        '个性化推荐曾经感兴趣的商品',\n        '定期发送平台活动信息'\n    ],\n    '精挑细选型': [\n        '提供详细的商品信息和评价',\n        '推荐高品质、高性价比商品',\n        '邀请参与商品评测'\n    ],\n    '薅羊毛型': [\n        '推送限时折扣和优惠券',\n        '设计满减活动',\n        '推荐高折扣商品'\n    ]\n}\n\nprint('\n各聚类运营策略:')\nfor cluster, strategy_list in strategies.items():\n    print(f'\n{cluster}:')\n    for i, strategy in enumerate(strategy_list, 1):\n        print(f'{i}. {strategy}')"
            }
        ],
        "datasetLink": "https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce"
    },
    {
        "id": 9,
        "title": "时间序列分析与销售预测",
        "description": "电商平台需要提前预测未来一周或一个月的销售量，为库存管理、仓储调配和营销活动规划提供决策依据。该项目将带领学生使用时间序列分析方法，探索数据的周期性规律并进行预测。",
        "difficulty": "高级",
        "category": "预测分析",
        "duration": "7小时",
        "popularity": 83,
        "learningObjectives": [
            "掌握时间序列数据的预处理与可视化",
            "学会使用移动平均、指数平滑等方法进行趋势分解",
            "理解自相关性（ACF/PACF）的概念",
            "掌握简单的预测模型（如Holt-Winters、ARIMA或Prophet）",
            "学会评估预测效果（MAE、RMSE）"
        ],
        "coreTasks": [
            "按日聚合历史销售数据，形成时间序列，绘制时间序列图观察整体趋势和周期性（如双十一前后的销售峰值）",
            "分解时间序列的三大成分：趋势（Trend）、季节性（Seasonality）、残差（Residual）",
            "使用Holt-Winters指数平滑模型或Prophet对时间序列进行建模预测",
            "将数据集分为训练集和测试集，使用训练集建模后在测试集上验证预测准确性",
            "输出未来7天/30天的销售预测值，并计算预测误差",
            "识别销售异常的日期（如销量远高于/低于预测区间），分析其背后的可能原因"
        ],
        "technicalPoints": [
            "pd.date_range(), resample('D').sum()",
            "statsmodels.tsa.seasonal.seasonal_decompose",
            "statsmodels.tsa.holtwinters.ExponentialSmoothing",
            "或 prophet (Facebook Prophet)",
            "ACF/PACF图：statsmodels.graphics.tsaplots.plot_acf",
            "评估指标：mean_absolute_error, mean_squared_error"
        ],
        "taskSteps": [
            "按天聚合销售额，确保日期连续（缺失日期填充0）",
            "绘制时间序列图，观察是否有明显的趋势和周期性（如周周期、年周期）",
            "使用seasonal_decompose(model='additive')分解，绘制四张子图",
            "划分训练集（前80%）和测试集（后20%）",
            "训练Holt-Winters模型：ExponentialSmoothing(train, trend='add', seasonal='add', seasonal_periods=7).fit()",
            "预测测试集长度，计算MAE和RMSE",
            "使用模型预测未来7天，输出预测值和置信区间",
            "找出实际销量与预测值偏差超过2倍标准差的日期，结合日历分析原因（如促销、节假日）"
        ],
        "dataDescription": "项目一清洗后的销售数据，按日期聚合。关键字段：date, daily_sales_amount, daily_order_count。",
        "extensionThinking": [
            "如果数据同时存在周周期和年周期，如何处理？",
            "相比简单移动平均，指数平滑的优势在哪里？",
            "如何将外部因素（如天气、促销活动）纳入预测模型？"
        ],
        "codeExamples": [
            {
                "title": "时间序列数据准备",
                "code": "import pandas as pd\nimport matplotlib.pyplot as plt\n\n# 加载数据\ndf = pd.read_csv('sales_clean.csv')\ndf['销售日期'] = pd.to_datetime(df['销售日期'])\n\n# 按日聚合销售额\ndaily_sales = df.groupby('销售日期')['销售金额'].sum().reset_index()\ndaily_sales = daily_sales.set_index('销售日期')\n\n# 确保日期连续，填充缺失日期为0\nfull_date_range = pd.date_range(start=daily_sales.index.min(), end=daily_sales.index.max(), freq='D')\ndaily_sales = daily_sales.reindex(full_date_range, fill_value=0)\ndaily_sales.columns = ['销售额']\n\n# 绘制时间序列图\nplt.figure(figsize=(12, 6))\nplt.plot(daily_sales['销售额'])\nplt.title('每日销售额时间序列')\nplt.xlabel('日期')\nplt.ylabel('销售额')\nplt.grid(True)\nplt.show()"
            },
            {
                "title": "时间序列分解",
                "code": "from statsmodels.tsa.seasonal import seasonal_decompose\n\n# 分解时间序列\ndecomposition = seasonal_decompose(daily_sales['销售额'], model='additive', period=7)  # 假设周周期\n\n# 绘制分解结果\nplt.figure(figsize=(14, 10))\nplt.subplot(411)\nplt.plot(daily_sales['销售额'], label='原始数据')\nplt.legend()\nplt.subplot(412)\nplt.plot(decomposition.trend, label='趋势')\nplt.legend()\nplt.subplot(413)\nplt.plot(decomposition.seasonal, label='季节性')\nplt.legend()\nplt.subplot(414)\nplt.plot(decomposition.resid, label='残差')\nplt.legend()\nplt.tight_layout()\nplt.show()"
            },
            {
                "title": "Holt-Winters模型预测",
                "code": "from statsmodels.tsa.holtwinters import ExponentialSmoothing\nfrom sklearn.metrics import mean_absolute_error, mean_squared_error\nimport numpy as np\n\n# 划分训练集和测试集\ntrain_size = int(len(daily_sales) * 0.8)\ntrain = daily_sales[:train_size]\ntest = daily_sales[train_size:]\n\n# 训练Holt-Winters模型\nmodel = ExponentialSmoothing(train['销售额'], trend='add', seasonal='add', seasonal_periods=7)\nmodel_fit = model.fit()\n\n# 预测测试集\npred = model_fit.forecast(len(test))\n\n# 计算评估指标\nmae = mean_absolute_error(test['销售额'], pred)\nrmse = np.sqrt(mean_squared_error(test['销售额'], pred))\n\nprint(f'MAE: {mae:.2f}')\nprint(f'RMSE: {rmse:.2f}')\n\n# 绘制预测结果\nplt.figure(figsize=(12, 6))\nplt.plot(train.index, train['销售额'], label='训练集')\nplt.plot(test.index, test['销售额'], label='测试集')\nplt.plot(test.index, pred, label='预测值')\nplt.title('Holt-Winters模型预测结果')\nplt.xlabel('日期')\nplt.ylabel('销售额')\nplt.legend()\nplt.show()"
            },
            {
                "title": "使用Prophet预测",
                "code": "from prophet import Prophet\n\n# 准备Prophet所需的数据格式\nprophet_df = daily_sales.reset_index()\nprophet_df.columns = ['ds', 'y']\n\n# 划分训练集和测试集\ntrain_size = int(len(prophet_df) * 0.8)\ntrain_df = prophet_df[:train_size]\ntest_df = prophet_df[train_size:]\n\n# 训练Prophet模型\nm = Prophet()\nm.fit(train_df)\n\n# 预测测试集\nfuture = m.make_future_dataframe(periods=len(test_df))\nforecast = m.predict(future)\n\n# 计算评估指标\npred = forecast.iloc[-len(test_df):]['yhat']\nmae = mean_absolute_error(test_df['y'], pred)\nrmse = np.sqrt(mean_squared_error(test_df['y'], pred))\n\nprint(f'MAE: {mae:.2f}')\nprint(f'RMSE: {rmse:.2f}')\n\n# 绘制预测结果\nfig = m.plot(forecast)\nplt.title('Prophet模型预测结果')\nplt.show()\n\n# 绘制组件图\nfig2 = m.plot_components(forecast)\nplt.show()"
            },
            {
                "title": "预测未来7天",
                "code": "# 使用完整数据训练模型\nm = Prophet()\nm.fit(prophet_df)\n\n# 预测未来7天\nfuture = m.make_future_dataframe(periods=7)\nforecast = m.predict(future)\n\n# 输出未来7天的预测值\nfuture_forecast = forecast.iloc[-7:][['ds', 'yhat', 'yhat_lower', 'yhat_upper']]\nprint('未来7天销售预测:')\nprint(future_forecast)\n\n# 绘制预测结果\nfig = m.plot(forecast)\nplt.title('未来7天销售预测')\nplt.show()"
            }
        ],
        "datasetLink": "https://www.kaggle.com/datasets/kyanyoga/sample-sales-data"
    },
    {
        "id": 10,
        "title": "AI增强的电商用户价值分析系统",
        "description": "本综合实战项目要求你整合前9个项目所学的全部技能，构建一个完整的电商用户价值分析系统。同时引入AI大模型辅助，展示如何利用AI技术增强传统数据分析的效率和深度，充分体现AI时代数据分析的新范式。该项目可作为课程大作业。",
        "difficulty": "高级",
        "category": "综合实战",
        "duration": "10小时",
        "popularity": 90,
        "learningObjectives": [
            "整合数据清洗、特征工程、数据分析、机器学习建模的全流程能力",
            "掌握如何将AI大模型（如通过API调用的LLM）引入数据分析工作流",
            "学会编写完整的数据分析报告与可执行的分析脚本",
            "培养从业务问题到技术方案再到策略输出的端到端数据分析思维"
        ],
        "coreTasks": [
            "数据整合与清洗：融合用户信息表、行为日志表、订单表和商品信息表，构建完整的数据仓库宽表，完成全流程数据清洗与质量校验",
            "多维度分析：基于项目四的购物篮分析，输出商品关联规则及捆绑销售策略；基于项目五的RFM模型，输出用户价值分层结果；基于项目八的聚类分析，输出客户分群结果及群体画像；基于项目九的时间序列预测，输出下一周期的销售预测",
            "AI增强环节：使用大模型API对聚类得到的每个用户群体生成\"群体特征描述与运营策略建议\"的摘要文本；利用大模型对关联规则挖掘结果进行语义化解读；可选：使用大模型辅助生成数据分析报告的初稿和可视化图表的标题/说明文本",
            "综合报告输出：生成一份完整的《电商用户价值分析报告》，包含数据概况与清洗说明、用户分群画像、关联规则发现及解读、销售趋势预测、AI增强分析洞察、运营策略建议",
            "代码与文档：提交完整的Jupyter Notebook代码、README文档和项目说明PPT（可选）"
        ],
        "technicalPoints": [
            "前9个项目的全部技能",
            "LLM API调用（requests库或官方SDK）",
            "Prompt工程：设计有效的提示词以获取高质量的分析文本",
            "综合报告撰写：Markdown + 图片嵌入，或生成PDF",
            "项目文档整理：Git仓库管理、README编写"
        ],
        "taskSteps": [
            "数据准备：下载数据集，使用pandas读取，进行数据清洗（缺失值、异常值、类型转换）",
            "购物篮分析：对订单明细做Apriori，输出Top10关联规则",
            "RFM分层：计算R/F/M，打分，分群，统计各层特征",
            "聚类分析：选择特征，标准化，肘方法选K，聚类，解读群体",
            "时间序列预测：按日聚合销量，使用Prophet或Holt-Winters预测未来30天",
            "AI增强：将聚类结果（各群体特征均值表）作为上下文，调用大模型API，要求：\"请根据以下用户群体特征数据，为每个群体生成一段200字以内的描述，并给出3条运营建议。\"；将关联规则结果（前10条）发给大模型：\"请用通俗易懂的语言解释以下关联规则，并说明可能的业务原因。\"；将生成的文本整合到报告中",
            "报告撰写：使用Jupyter Notebook的Markdown单元格撰写报告，插入图表和AI生成的文本",
            "代码整理：确保Notebook可从头到尾运行，添加必要的注释",
            "提交：将Notebook导出为HTML或PDF，连同数据样例、README一起打包"
        ],
        "dataDescription": "建议使用Kaggle上的公开电商数据集，如\"Online Retail Dataset\"或\"Brazilian E-Commerce Dataset\"（需包含订单、用户、商品、支付等多表）。如果公开数据缺少某些字段（如用户画像），可以合理模拟补充。",
        "extensionThinking": [
            "如何设计Prompt使得AI生成的策略更接地气、更具可执行性？",
            "使用AI时如何保护数据隐私（不发送敏感数据）？是否可以本地部署小模型？",
            "除了生成文本，AI还可以在数据分析中扮演什么角色（如自动选择模型、解释统计结果）？"
        ],
        "codeExamples": [
            {
                "title": "数据整合与清洗",
                "code": "import pandas as pd\nimport numpy as np\n\n# 加载各表数据\norders = pd.read_csv('orders.csv')\nusers = pd.read_csv('users.csv')\nitems = pd.read_csv('items.csv')\nbehavior_logs = pd.read_csv('behavior_logs.csv')\n\n# 数据清洗\n# 订单表清洗\norders = orders.dropna(subset=['order_id', 'user_id', 'item_id', 'amount', 'order_date'])\norders['order_date'] = pd.to_datetime(orders['order_date'])\n\n# 用户表清洗\nusers = users.dropna(subset=['user_id', 'age', 'gender', 'city'])\nusers['age'] = users['age'].astype(int)\n\n# 商品表清洗\nitems = items.dropna(subset=['item_id', 'category', 'price'])\n\n# 行为日志清洗\nbehavior_logs = behavior_logs.dropna(subset=['user_id', 'action', 'timestamp'])\nbehavior_logs['timestamp'] = pd.to_datetime(behavior_logs['timestamp'])\n\n# 数据整合\n# 订单与用户整合\norder_user = pd.merge(orders, users, on='user_id', how='left')\n\n# 订单与商品整合\norder_item = pd.merge(order_user, items, on='item_id', how='left')\n\n# 行为日志与用户整合\nbehavior_user = pd.merge(behavior_logs, users, on='user_id', how='left')\n\nprint('数据整合完成，订单数据形状:', order_item.shape)\nprint('行为日志数据形状:', behavior_user.shape)"
            },
            {
                "title": "多维度分析整合",
                "code": "# 1. 购物篮分析（参考项目四）\nfrom mlxtend.frequent_patterns import apriori, association_rules\n\n# 构建交易矩阵\nbasket = (order_item.groupby(['order_id', 'category'])['quantity']\n          .sum().unstack().reset_index().fillna(0)\n          .set_index('order_id'))\n\n# 转换为0/1编码\nbasket_sets = basket.applymap(lambda x: 1 if x > 0 else 0)\n\n# 挖掘关联规则\nfrequent_itemsets = apriori(basket_sets, min_support=0.01, use_colnames=True)\nrules = association_rules(frequent_itemsets, metric='lift', min_threshold=1)\nrules = rules.sort_values('lift', ascending=False)\n\n# 2. RFM分析（参考项目五）\nanalysis_date = order_item['order_date'].max() + pd.Timedelta(days=1)\nrfm = order_item.groupby('user_id').agg(\n    R=('order_date', lambda x: (analysis_date - x.max()).days),\n    F=('order_id', 'nunique'),\n    M=('amount', 'sum')\n).reset_index()\n\n# 3. 聚类分析（参考项目八）\nfrom sklearn.cluster import KMeans\nfrom sklearn.preprocessing import StandardScaler\n\n# 构建特征矩阵\nuser_features = rfm[['R', 'F', 'M']]\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(user_features)\n\n# K-Means聚类\nkmeans = KMeans(n_clusters=4, random_state=42)\nrfm['cluster'] = kmeans.fit_predict(X_scaled)\n\n# 4. 时间序列预测（参考项目九）\ndaily_sales = order_item.groupby('order_date')['amount'].sum().reset_index()\ndaily_sales = daily_sales.set_index('order_date')\nfull_date_range = pd.date_range(start=daily_sales.index.min(), end=daily_sales.index.max(), freq='D')\ndaily_sales = daily_sales.reindex(full_date_range, fill_value=0)"
            },
            {
                "title": "AI增强分析",
                "code": "import requests\nimport json\n\n# 调用大模型API（以OpenAI为例）\ndef get_llm_response(prompt, api_key):\n    url = 'https://api.openai.com/v1/chat/completions'\n    headers = {\n        'Content-Type': 'application/json',\n        'Authorization': f'Bearer {api_key}'\n    }\n    data = {\n        'model': 'gpt-3.5-turbo',\n        'messages': [{'role': 'user', 'content': prompt}],\n        'temperature': 0.7\n    }\n    response = requests.post(url, headers=headers, json=data)\n    return response.json()['choices'][0]['message']['content']\n\n# 1. 生成用户群体描述和运营建议\ncluster_analysis = rfm.groupby('cluster')[['R', 'F', 'M']].mean().round(2)\ncluster_prompt = f'请根据以下用户群体特征数据，为每个群体生成一段200字以内的描述，并给出3条运营建议。\n\n{cluster_analysis.to_string()}'\n\n# 2. 解释关联规则\ntop_rules = rules.head(10)\nrules_prompt = f'请用通俗易懂的语言解释以下关联规则，并说明可能的业务原因。\n\n{top_rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']].to_string()}'\n\n# 注意：实际使用时需要替换为真实的API密钥\n# api_key = 'your_api_key'\n# cluster_response = get_llm_response(cluster_prompt, api_key)\n# rules_response = get_llm_response(rules_prompt, api_key)\n\n# 模拟API响应\ncluster_response = '基于聚类分析结果，我们识别出四个不同的用户群体...'\nrules_response = '关联规则分析显示，购买电子产品的用户经常同时购买配件...'\n\nprint('AI生成的用户群体分析:')\nprint(cluster_response)\nprint('\nAI生成的关联规则解释:')\nprint(rules_response)"
            },
            {
                "title": "生成综合报告",
                "code": "# 在Jupyter Notebook中，可以使用Markdown单元格撰写报告\n# 以下是报告结构示例\n\nreport_content = '''\n# 电商用户价值分析报告\n\n## 1. 数据概况与清洗说明\n- 数据集包含XX条订单记录，XX个用户，XX个商品\n- 数据清洗主要包括：缺失值处理、异常值检测、类型转换\n\n## 2. 用户分群画像\n### 2.1 RFM分层结果\n- 高价值用户：XX人，占比XX%\n- 重点保持用户：XX人，占比XX%\n- 重点挽留用户：XX人，占比XX%\n- 一般用户：XX人，占比XX%\n- 流失用户：XX人，占比XX%\n\n### 2.2 聚类分析结果\n- 忠诚活跃型：XX人，特征：高消费、高频率\n- 沉睡流失型：XX人，特征：低消费、低频\n- 精挑细选型：XX人，特征：高客单价、浏览时长长\n- 薅羊毛型：XX人，特征：低客单价、高频\n\n## 3. 关联规则发现及解读\n- Top1关联规则：{A} → {B}，提升度XX\n- Top2关联规则：{C} → {D}，提升度XX\n\n## 4. 销售趋势预测\n- 未来7天预测销售额：XX\n- 未来30天预测销售额：XX\n\n## 5. AI增强分析洞察\n[AI生成的分析内容]\n\n## 6. 运营策略建议\n- 针对高价值用户：专属客服、VIP权益\n- 针对沉睡用户：召回活动、个性化推荐\n- 针对精挑细选型用户：详细商品信息、品质保证\n- 针对薅羊毛型用户：限时折扣、满减活动\n'''\n\nprint('综合报告结构已生成')"
            }
        ],
        "datasetLink": "https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce"
    }
]