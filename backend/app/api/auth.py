from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.models import db, User, CourseProgress, Project
from passlib.hash import pbkdf2_sha256
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

# 注册API
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        # 验证数据
        if not username or not email or not password:
            return jsonify({'error': '缺少必要的注册信息'}), 400
        
        # 检查用户名是否已存在
        if User.query.filter_by(username=username).first():
            return jsonify({'error': '用户名已存在'}), 400
        
        # 检查邮箱是否已存在
        if User.query.filter_by(email=email).first():
            return jsonify({'error': '邮箱已被注册'}), 400
        
        # 哈希密码
        password_hash = pbkdf2_sha256.hash(password)
        
        # 创建用户
        new_user = User(
            username=username,
            email=email,
            password_hash=password_hash
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'message': '注册成功'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 登录API
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # 验证数据
        if not email or not password:
            return jsonify({'error': '缺少邮箱或密码'}), 400
        
        # 查找用户
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': '邮箱或密码错误'}), 401
        
        # 验证密码
        if not pbkdf2_sha256.verify(password, user.password_hash):
            return jsonify({'error': '邮箱或密码错误'}), 401
        
        # 创建访问令牌
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=7)
        )
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 获取当前用户信息
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': '用户不存在'}), 404
        
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'created_at': user.created_at
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 更新用户信息
@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': '用户不存在'}), 404
        
        data = request.get_json()
        
        # 更新用户名
        if 'username' in data:
            # 检查用户名是否已存在
            if User.query.filter_by(username=data['username']).filter(User.id != user_id).first():
                return jsonify({'error': '用户名已存在'}), 400
            user.username = data['username']
        
        # 更新密码
        if 'password' in data:
            user.password_hash = pbkdf2_sha256.hash(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 学习进度API
@auth_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_progress():
    try:
        user_id = get_jwt_identity()
        progress_list = CourseProgress.query.filter_by(user_id=user_id).all()
        
        result = []
        for progress in progress_list:
            project = Project.query.get(progress.project_id)
            if project:
                result.append({
                    'project_id': progress.project_id,
                    'project_name': project.name,
                    'progress': progress.progress,
                    'completed': progress.completed,
                    'last_accessed': progress.last_accessed
                })
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 更新学习进度
@auth_bp.route('/progress/<int:project_id>', methods=['POST'])
@jwt_required()
def update_progress(project_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        progress = data.get('progress', 0)
        
        # 检查项目是否存在
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': '项目不存在'}), 404
        
        # 查找或创建学习进度记录
        course_progress = CourseProgress.query.filter_by(
            user_id=user_id,
            project_id=project_id
        ).first()
        
        if not course_progress:
            course_progress = CourseProgress(
                user_id=user_id,
                project_id=project_id,
                progress=progress,
                completed=progress >= 100
            )
            db.session.add(course_progress)
        else:
            course_progress.progress = progress
            course_progress.completed = progress >= 100
        
        db.session.commit()
        
        return jsonify({
            'project_id': project_id,
            'progress': course_progress.progress,
            'completed': course_progress.completed
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
