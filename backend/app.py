from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
import torch
import os

app = Flask(__name__, static_folder="../frontend", static_url_path="")  # Serve frontend files
CORS(app)

# Create a directory to store generated images
OUTPUT_FOLDER = "static"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load Stable Diffusion Model with a compatible scheduler
model = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
model.scheduler = DPMSolverMultistepScheduler.from_config(model.scheduler.config)
model.to("cuda" if torch.cuda.is_available() else "cpu")

# ✅ Serve index.html for the home page
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, "index.html")

@app.route('/generate', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get("prompt", "A futuristic cityscape at sunset")

    try:
        # Generate image
        image = model(prompt, num_inference_steps=50).images[0]
        image_path = os.path.join(OUTPUT_FOLDER, "generated.png")
        image.save(image_path)

        return jsonify({"image_url": f"/static/generated.png"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve static images
@app.route('/static/<filename>')
def serve_image(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
