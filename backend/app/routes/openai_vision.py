# app/routes/openai_vision.py

from flask import Blueprint, request, jsonify
from ..services.openai_vision_service import OpenAIVisionService

bp = Blueprint('openai_vision', __name__)
openai_vision_service = OpenAIVisionService() # create instance of OCRService

@bp.route('/process-receipt', methods=['POST'])
def process_receipt():
  if not request.content_type == 'application/json':
     return jsonify({"error": "Unsupported media type"}), 415
  
  data = request.json
  if 'image' not in data:
    return jsonify({"error": "No image data"}), 400
    
  try:
    image_data = data['image']
    result = openai_vision_service.process_image_data(image_data)
    return jsonify({"result": result}), 200
  except Exception as e:
      return jsonify({"error": str(e)}), 500

