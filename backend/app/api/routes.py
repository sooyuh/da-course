from flask import Blueprint, jsonify
from app.api.projects_data import projects_data

api_bp = Blueprint('api', __name__)

@api_bp.route('/projects', methods=['GET'])
def get_projects():
    # 返回项目列表，只包含基本信息
    project_list = []
    for project in projects_data:
        project_list.append({
            "id": project["id"],
            "title": project["title"],
            "description": project["description"],
            "difficulty": project["difficulty"],
            "category": project["category"],
            "duration": project["duration"],
            "popularity": project["popularity"]
        })
    return jsonify(project_list)

@api_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    # 查找指定ID的项目
    for project in projects_data:
        if project["id"] == project_id:
            return jsonify(project)
    return jsonify({"error": "Project not found"})