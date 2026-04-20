from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.models import db, LearningPath, PathStep, User, CourseProgress, UserInterest, RecommendedPath
from datetime import datetime

learning_paths_bp = Blueprint('learning_paths', __name__)

# 获取所有学习路径
@learning_paths_bp.route('/paths', methods=['GET'])
def get_all_paths():
    paths = LearningPath.query.all()
    result = []
    for path in paths:
        steps = PathStep.query.filter_by(path_id=path.id).order_by(PathStep.step_order).all()
        path_data = {
            'id': path.id,
            'name': path.name,
            'description': path.description,
            'category': path.category,
            'difficulty': path.difficulty,
            'total_duration': path.total_duration,
            'total_steps': path.total_steps,
            'steps': [{
                'id': step.id,
                'step_order': step.step_order,
                'project_id': step.project_id,
                'project_name': step.project.name,
                'description': step.description
            } for step in steps]
        }
        result.append(path_data)
    return jsonify(result), 200

# 获取单个学习路径详情
@learning_paths_bp.route('/paths/<int:path_id>', methods=['GET'])
def get_path_detail(path_id):
    path = LearningPath.query.get(path_id)
    if not path:
        return jsonify({'message': '学习路径不存在'}), 404
    
    steps = PathStep.query.filter_by(path_id=path.id).order_by(PathStep.step_order).all()
    path_data = {
        'id': path.id,
        'name': path.name,
        'description': path.description,
        'category': path.category,
        'difficulty': path.difficulty,
        'total_duration': path.total_duration,
        'total_steps': path.total_steps,
        'steps': [{
            'id': step.id,
            'step_order': step.step_order,
            'project_id': step.project_id,
            'project_name': step.project.name,
            'project_description': step.project.description,
            'project_difficulty': step.project.difficulty,
            'project_duration': step.project.duration,
            'description': step.description
        } for step in steps]
    }
    return jsonify(path_data), 200

# 获取用户个性化推荐路径
@learning_paths_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': '用户不存在'}), 404
    
    # 获取用户兴趣
    user_interests = [interest.category for interest in user.user_interests]
    
    # 获取用户已完成的项目
    completed_projects = set()
    progresses = CourseProgress.query.filter_by(user_id=user_id, completed=True).all()
    for progress in progresses:
        completed_projects.add(progress.project_id)
    
    # 计算每个路径的推荐分数
    all_paths = LearningPath.query.all()
    recommended_paths = []
    
    for path in all_paths:
        score = 0.0
        
        # 基于兴趣的分数
        if path.category in user_interests:
            score += 30.0
        
        # 基于难度的分数（假设用户喜欢与当前水平匹配的内容）
        # 这里简化处理，实际可以根据用户历史完成项目的难度来判断
        score += 10.0
        
        # 基于未完成项目的比例
        steps = PathStep.query.filter_by(path_id=path.id).all()
        total_steps = len(steps)
        completed_steps = 0
        
        for step in steps:
            if step.project_id in completed_projects:
                completed_steps += 1
        
        # 如果路径中有未完成的项目，增加推荐分数
        if completed_steps < total_steps:
            score += (total_steps - completed_steps) * 5.0
        
        # 保存推荐分数
        recommended_path = RecommendedPath.query.filter_by(user_id=user_id, path_id=path.id).first()
        if recommended_path:
            recommended_path.score = score
        else:
            recommended_path = RecommendedPath(user_id=user_id, path_id=path.id, score=score)
        db.session.add(recommended_path)
        
        # 构建路径数据
        path_data = {
            'id': path.id,
            'name': path.name,
            'description': path.description,
            'category': path.category,
            'difficulty': path.difficulty,
            'total_duration': path.total_duration,
            'total_steps': path.total_steps,
            'score': score,
            'completed_steps': completed_steps
        }
        recommended_paths.append(path_data)
    
    # 提交数据库更改
    db.session.commit()
    
    # 按分数降序排序
    recommended_paths.sort(key=lambda x: x['score'], reverse=True)
    
    return jsonify(recommended_paths[:5]), 200

# 保存用户兴趣
@learning_paths_bp.route('/interests', methods=['POST'])
@jwt_required()
def save_interests():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'interests' not in data:
        return jsonify({'message': '缺少兴趣数据'}), 400
    
    # 清除用户现有兴趣
    UserInterest.query.filter_by(user_id=user_id).delete()
    
    # 添加新兴趣
    for interest in data['interests']:
        user_interest = UserInterest(user_id=user_id, category=interest)
        db.session.add(user_interest)
    
    db.session.commit()
    return jsonify({'message': '兴趣保存成功'}), 200

# 获取用户兴趣
@learning_paths_bp.route('/interests', methods=['GET'])
@jwt_required()
def get_interests():
    user_id = get_jwt_identity()
    interests = UserInterest.query.filter_by(user_id=user_id).all()
    return jsonify([interest.category for interest in interests]), 200
