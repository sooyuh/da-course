from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.models import db, Discussion, Comment, Project, User
from datetime import datetime

community_bp = Blueprint('community', __name__)

# 获取项目的讨论列表
@community_bp.route('/discussions/<int:project_id>', methods=['GET'])
def get_project_discussions(project_id):
    try:
        discussions = Discussion.query.filter_by(project_id=project_id).order_by(Discussion.created_at.desc()).all()
        result = []
        for discussion in discussions:
            result.append({
                'id': discussion.id,
                'title': discussion.title,
                'content': discussion.content,
                'user_id': discussion.user_id,
                'username': discussion.user.username,
                'project_id': discussion.project_id,
                'views': discussion.views,
                'likes': discussion.likes,
                'created_at': discussion.created_at.isoformat(),
                'comment_count': len(discussion.comments)
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 创建新讨论
@community_bp.route('/discussions', methods=['POST'])
@jwt_required()
def create_discussion():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        discussion = Discussion(
            title=data['title'],
            content=data['content'],
            user_id=user_id,
            project_id=data['project_id']
        )
        
        db.session.add(discussion)
        db.session.commit()
        
        return jsonify({
            'id': discussion.id,
            'title': discussion.title,
            'content': discussion.content,
            'user_id': discussion.user_id,
            'username': discussion.user.username,
            'project_id': discussion.project_id,
            'views': discussion.views,
            'likes': discussion.likes,
            'created_at': discussion.created_at.isoformat(),
            'comment_count': 0
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 获取讨论详情
@community_bp.route('/discussions/detail/<int:discussion_id>', methods=['GET'])
def get_discussion_detail(discussion_id):
    try:
        discussion = Discussion.query.get(discussion_id)
        if not discussion:
            return jsonify({'message': '讨论不存在'}), 404
        
        # 增加浏览量
        discussion.views += 1
        db.session.commit()
        
        # 构建评论树
        def build_comment_tree(comments):
            comment_dict = {}
            for comment in comments:
                comment_dict[comment.id] = {
                    'id': comment.id,
                    'content': comment.content,
                    'user_id': comment.user_id,
                    'username': comment.user.username,
                    'discussion_id': comment.discussion_id,
                    'parent_id': comment.parent_id,
                    'likes': comment.likes,
                    'created_at': comment.created_at.isoformat(),
                    'replies': []
                }
            
            # 构建回复树
            result = []
            for comment in comments:
                if comment.parent_id is None:
                    result.append(comment_dict[comment.id])
                else:
                    if comment.parent_id in comment_dict:
                        comment_dict[comment.parent_id]['replies'].append(comment_dict[comment.id])
            
            return result
        
        comments = Comment.query.filter_by(discussion_id=discussion_id).order_by(Comment.created_at.asc()).all()
        comment_tree = build_comment_tree(comments)
        
        return jsonify({
            'id': discussion.id,
            'title': discussion.title,
            'content': discussion.content,
            'user_id': discussion.user_id,
            'username': discussion.user.username,
            'project_id': discussion.project_id,
            'views': discussion.views,
            'likes': discussion.likes,
            'created_at': discussion.created_at.isoformat(),
            'comments': comment_tree
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 添加评论
@community_bp.route('/comments', methods=['POST'])
@jwt_required()
def add_comment():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        comment = Comment(
            content=data['content'],
            user_id=user_id,
            discussion_id=data['discussion_id'],
            parent_id=data.get('parent_id')
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify({
            'id': comment.id,
            'content': comment.content,
            'user_id': comment.user_id,
            'username': comment.user.username,
            'discussion_id': comment.discussion_id,
            'parent_id': comment.parent_id,
            'likes': comment.likes,
            'created_at': comment.created_at.isoformat(),
            'replies': []
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 点赞讨论
@community_bp.route('/discussions/like/<int:discussion_id>', methods=['POST'])
@jwt_required()
def like_discussion(discussion_id):
    try:
        discussion = Discussion.query.get(discussion_id)
        if not discussion:
            return jsonify({'message': '讨论不存在'}), 404
        
        discussion.likes += 1
        db.session.commit()
        
        return jsonify({'likes': discussion.likes}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 点赞评论
@community_bp.route('/comments/like/<int:comment_id>', methods=['POST'])
@jwt_required()
def like_comment(comment_id):
    try:
        comment = Comment.query.get(comment_id)
        if not comment:
            return jsonify({'message': '评论不存在'}), 404
        
        comment.likes += 1
        db.session.commit()
        
        return jsonify({'likes': comment.likes}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 删除讨论
@community_bp.route('/discussions/<int:discussion_id>', methods=['DELETE'])
@jwt_required()
def delete_discussion(discussion_id):
    try:
        user_id = get_jwt_identity()
        discussion = Discussion.query.get(discussion_id)
        
        if not discussion:
            return jsonify({'message': '讨论不存在'}), 404
        
        if discussion.user_id != user_id:
            return jsonify({'message': '无权限删除此讨论'}), 403
        
        db.session.delete(discussion)
        db.session.commit()
        
        return jsonify({'message': '讨论删除成功'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 删除评论
@community_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    try:
        user_id = get_jwt_identity()
        comment = Comment.query.get(comment_id)
        
        if not comment:
            return jsonify({'message': '评论不存在'}), 404
        
        if comment.user_id != user_id:
            return jsonify({'message': '无权限删除此评论'}), 403
        
        db.session.delete(comment)
        db.session.commit()
        
        return jsonify({'message': '评论删除成功'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
