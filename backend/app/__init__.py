from .routes import openai_vision
from flask import Flask
from flask_cors import CORS

def create_app():
  app = Flask(__name__)
  CORS(app) # enable CORS for all domains on all routes

# import and register blueprints

  from .routes import openai_vision
  app.register_blueprint(openai_vision.bp, url_prefix='/openai_vision')

  return app
