from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../data.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        from . import models
        from .corrected_code import product_bp
        from .api import alert_bp
        app.register_blueprint(product_bp)
        app.register_blueprint(alert_bp)
        db.create_all()

    return app
