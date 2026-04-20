class Config:
    SECRET_KEY = 'your-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///../data.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True
    JWT_SECRET_KEY = 'your-jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = 604800  # 7 days