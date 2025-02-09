from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
import torch
import os
import uuid
import re

# ✅ Ensure Flask finds `frontend/` and `static/` directories correctly
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_FOLDER = os.path.join(BASE_DIR, "../frontend")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "../generated_Images")

# Create the static directory if it doesn't exist
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app = Flask(__name__, static_folder=FRONTEND_FOLDER, static_url_path="")
CORS(app)

# ✅ Function to sanitize filenames (remove special characters)
def sanitize_filename(text):
    text = re.sub(r'[^a-zA-Z0-9 ]', '', text)  # Remove special characters
    text = text.replace(" ", "_")  # Replace spaces with underscores
    return text[:50]  # Limit length to avoid issues

# ✅ Serve `index.html` from `frontend/`
@app.route('/')
def serve_frontend():
    return send_from_directory(FRONTEND_FOLDER, "index.html")

# ✅ Serve CSS, JS, and other frontend files
@app.route('/<path:filename>')
def serve_static_files(filename):
    return send_from_directory(FRONTEND_FOLDER, filename)

# ✅ Generate images and save with the prompt-based filename
@app.route('/generate', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get("prompt", "A futuristic cityscape at sunset")

    try:
        # Create a sanitized filename
        filename = sanitize_filename(prompt) + "_" + uuid.uuid4().hex[:8] + ".png"
        image_path = os.path.join(OUTPUT_FOLDER, filename)

        # Load Stable Diffusion Model
        model = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
        model.scheduler = DPMSolverMultistepScheduler.from_config(model.scheduler.config)
        model.to("cuda" if torch.cuda.is_available() else "cpu")

        # Generate image
        image = model(prompt, num_inference_steps=1).images[0]
        image.save(image_path)

        return jsonify({"image_url": f"/static/{filename}", "image_name": prompt})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ List all images with filenames
@app.route('/list-images', methods=['GET'])
def list_images():
    files = os.listdir(OUTPUT_FOLDER)
    images = [{"url": f"/static/{file}", "name": file.split("_")[0].replace("_", " ")}
              for file in files if file.endswith((".png", ".jpg", ".jpeg"))]
    return jsonify({"images": images})

# ✅ Serve generated static images
@app.route('/static/<filename>')
def serve_image(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
