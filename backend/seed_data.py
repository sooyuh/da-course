import sys
import os
from flask import Flask

# 添加backend目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 创建一个简单的Flask应用实例
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 导入数据库模型
from app.models.models import db, LearningPath, PathStep, Project

# 初始化数据库
db.init_app(app)

# 初始学习路径数据
learning_paths = [
    {
        "name": "数据分析师入门路径",
        "description": "从基础到进阶，掌握数据分析核心技能",
        "category": "数据分析师",
        "difficulty": "入门",
        "total_duration": 40,
        "total_steps": 5,
        "steps": [
            {
                "project_id": 1,
                "step_order": 1,
                "description": "学习数据清洗的基本方法和技巧"
            },
            {
                "project_id": 2,
                "step_order": 2,
                "description": "分析用户行为并构建转化漏斗"
            },
            {
                "project_id": 3,
                "step_order": 3,
                "description": "分析销售趋势并建立库存预警机制"
            },
            {
                "project_id": 4,
                "step_order": 4,
                "description": "发现商品之间的关联规律"
            },
            {
                "project_id": 5,
                "step_order": 5,
                "description": "建立用户价值分层体系"
            }
        ]
    },
    {
        "name": "Python数据分析实战路径",
        "description": "通过实战项目，提升Python数据分析能力",
        "category": "Python",
        "difficulty": "中级",
        "total_duration": 60,
        "total_steps": 8,
        "steps": [
            {
                "project_id": 1,
                "step_order": 1,
                "description": "数据清洗与质量诊断"
            },
            {
                "project_id": 2,
                "step_order": 2,
                "description": "用户行为日志分析与漏斗转化"
            },
            {
                "project_id": 3,
                "step_order": 3,
                "description": "商品销售趋势分析与库存预警"
            },
            {
                "project_id": 4,
                "step_order": 4,
                "description": "购物篮分析与关联规则挖掘"
            },
            {
                "project_id": 5,
                "step_order": 5,
                "description": "RFM用户价值分层与精细化运营"
            },
            {
                "project_id": 6,
                "step_order": 6,
                "description": "用户留存分析与复购行为预测"
            },
            {
                "project_id": 7,
                "step_order": 7,
                "description": "用户画像构建与精准营销标签体系"
            },
            {
                "project_id": 8,
                "step_order": 8,
                "description": "电商用户聚类分析与客户分群"
            }
        ]
    },
    {
        "name": "数据可视化专家路径",
        "description": "掌握数据可视化技巧，提升数据表达能力",
        "category": "数据可视化",
        "difficulty": "中级",
        "total_duration": 30,
        "total_steps": 4,
        "steps": [
            {
                "project_id": 2,
                "step_order": 1,
                "description": "用户行为数据可视化"
            },
            {
                "project_id": 3,
                "step_order": 2,
                "description": "销售趋势可视化"
            },
            {
                "project_id": 7,
                "step_order": 3,
                "description": "用户画像可视化"
            },
            {
                "project_id": 8,
                "step_order": 4,
                "description": "聚类结果可视化"
            }
        ]
    }
]

# 插入初始数据
def seed_data():
    with app.app_context():
        # 创建数据库表
        db.create_all()
        
        # 检查是否已有数据
        if LearningPath.query.count() > 0:
            print("数据已存在，跳过插入")
            return
        
        # 插入学习路径和步骤
        for path_data in learning_paths:
            path = LearningPath(
                name=path_data["name"],
                description=path_data["description"],
                category=path_data["category"],
                difficulty=path_data["difficulty"],
                total_duration=path_data["total_duration"],
                total_steps=path_data["total_steps"]
            )
            db.session.add(path)
            db.session.flush()  # 获取path.id
            
            for step_data in path_data["steps"]:
                step = PathStep(
                    path_id=path.id,
                    project_id=step_data["project_id"],
                    step_order=step_data["step_order"],
                    description=step_data["description"]
                )
                db.session.add(step)
        
        db.session.commit()
        print("初始数据插入成功")

if __name__ == "__main__":
    seed_data()
