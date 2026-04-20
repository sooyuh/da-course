from flask import Blueprint, jsonify
from app.models.models import db, Project

projects_bp = Blueprint('projects', __name__)

# 创建项目数据
@projects_bp.route('/create-projects', methods=['POST'])
def create_projects():
    try:
        # 项目数据
        projects = [
            {
                'name': '电商销售数据清洗与质量诊断',
                'description': '清洗和诊断电商销售数据，识别和处理缺失值、重复记录、格式不一致和异常值。',
                'difficulty': '入门',
                'duration': 4,
                'category': '数据清洗'
            },
            {
                'name': '用户行为日志分析与漏斗转化',
                'description': '分析用户行为日志，构建转化漏斗，计算核心指标。',
                'difficulty': '中级',
                'duration': 6,
                'category': '用户分析'
            },
            {
                'name': '商品销售趋势分析与库存预警',
                'description': '分析商品销售趋势，建立库存预警机制。',
                'difficulty': '中级',
                'duration': 5,
                'category': '销售分析'
            },
            {
                'name': '购物篮分析与关联规则挖掘',
                'description': '使用Apriori算法挖掘商品关联规则。',
                'difficulty': '中级',
                'duration': 7,
                'category': '数据挖掘'
            },
            {
                'name': 'RFM用户价值分层与精细化运营',
                'description': '基于RFM模型对用户进行价值分层。',
                'difficulty': '中级',
                'duration': 6,
                'category': '用户分析'
            }
        ]
        
        # 检查是否已存在项目
        if Project.query.count() > 0:
            return jsonify({'message': '项目已存在'}), 200
        
        # 创建项目
        for project_data in projects:
            project = Project(**project_data)
            db.session.add(project)
        
        db.session.commit()
        
        return jsonify({'message': '项目创建成功'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
