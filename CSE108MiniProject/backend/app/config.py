class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///../instance/appdata.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    SECRET_KEY = "super-secret-key" #security shouldnt  matter 