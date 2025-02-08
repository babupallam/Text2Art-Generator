from flask import Flask, request, jsonify, send_from_directory
from diffusers import StableDiffusionPipeline
import torch
import os

app = Flask(__name__)

# Create a directory to store generated images
OUTPUT_FOLDER = "static"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load Stable Diffusion Model
model = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
model.to("cuda" if torch.cuda.is_available() else "cpu")

@app.route('/generate', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get("prompt", "A futuristic cityscape at sunset")

    # Generate image
    image = model(prompt).images[0]
    image_path = os.path.join(OUTPUT_FOLDER, "generated.png")
    image.save(image_path)

    return jsonify({"image_url": f"/static/generated.png"})

# Serve static images
@app.route('/static/<filename>')
def serve_image(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
