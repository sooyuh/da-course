from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.api.routes import api_bp
from app.api.auth import auth_bp
from app.api.projects import projects_bp
from app.api.community import community_bp
from app.api.learning_paths import learning_paths_bp
from app.config.config import Config
from app.models.models import db

app = Flask(__name__)
app.config.from_object(Config)

# 初始化数据库
db.init_app(app)

# 初始化JWT
jwt = JWTManager(app)

# 启用CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# 注册API蓝图
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(projects_bp, url_prefix='/api/projects')
app.register_blueprint(community_bp, url_prefix='/api/community')
app.register_blueprint(learning_paths_bp, url_prefix='/api/learning-paths')

@app.route('/api/hello')
def hello():
    return jsonify({"message": "后端服务运行正常！"})

# 创建数据库表
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)