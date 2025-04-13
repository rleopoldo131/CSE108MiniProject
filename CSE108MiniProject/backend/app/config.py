class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///../instance/appdata.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    SECRET_KEY = "super-secret-key" #security shouldnt  matter 

    JWT_SECRET_KEY = "super-secret-key"  # used by flask_jwt_extended
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"