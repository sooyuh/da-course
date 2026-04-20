from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# 初始化数据库
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    # 关系
    course_progresses = db.relationship('CourseProgress', backref='user', lazy=True)
    discussions = db.relationship('Discussion', backref='user', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)
    user_interests = db.relationship('UserInterest', backref='user', lazy=True)
    recommended_paths = db.relationship('RecommendedPath', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    difficulty = db.Column(db.String(50), nullable=True)  # 难度级别
    duration = db.Column(db.Integer, nullable=True)  # 预计时长（小时）
    category = db.Column(db.String(100), nullable=True)  # 分类
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    # 关系
    course_progresses = db.relationship('CourseProgress', backref='project', lazy=True)
    discussions = db.relationship('Discussion', backref='project', lazy=True)
    path_steps = db.relationship('PathStep', backref='project', lazy=True)

    def __repr__(self):
        return f'<Project {self.name}>'

class CourseProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    progress = db.Column(db.Float, default=0.0)  # 0-100
    completed = db.Column(db.Boolean, default=False)
    last_accessed = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    def __repr__(self):
        return f'<CourseProgress User:{self.user_id} Project:{self.project_id} Progress:{self.progress}>'

class Discussion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    views = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    # 关系
    comments = db.relationship('Comment', backref='discussion', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Discussion {self.title}>'

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    discussion_id = db.Column(db.Integer, db.ForeignKey('discussion.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=True)  # 支持嵌套评论
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    # 关系
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]), lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Comment User:{self.user_id} Discussion:{self.discussion_id}>'

class LearningPath(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), nullable=True)  # 路径分类
    difficulty = db.Column(db.String(50), nullable=True)  # 难度级别
    total_duration = db.Column(db.Integer, nullable=True)  # 总时长（小时）
    total_steps = db.Column(db.Integer, nullable=True)  # 总步骤数
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    # 关系
    path_steps = db.relationship('PathStep', backref='learning_path', lazy=True)
    recommended_paths = db.relationship('RecommendedPath', backref='learning_path', lazy=True)

    def __repr__(self):
        return f'<LearningPath {self.name}>'

class PathStep(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path_id = db.Column(db.Integer, db.ForeignKey('learning_path.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    step_order = db.Column(db.Integer, nullable=False)  # 步骤顺序
    description = db.Column(db.Text, nullable=True)  # 步骤描述
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self):
        return f'<PathStep Path:{self.path_id} Step:{self.step_order} Project:{self.project_id}>'

class UserInterest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)  # 兴趣类别
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    def __repr__(self):
        return f'<UserInterest User:{self.user_id} Category:{self.category}>'

class RecommendedPath(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    path_id = db.Column(db.Integer, db.ForeignKey('learning_path.id'), nullable=False)
    score = db.Column(db.Float, default=0.0)  # 推荐分数
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self):
        return f'<RecommendedPath User:{self.user_id} Path:{self.path_id} Score:{self.score}>'