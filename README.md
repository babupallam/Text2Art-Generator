🖼️ AI Image Generator

🚀 Overview

The AI Image Generator is a web-based application that allows users to generate images from text prompts using AI models. Users can view the latest generated image, browse previously created images in a gallery, and download them. The front-end is built with HTML, CSS, and JavaScript, and the back-end is powered by Flask.


---
### 🏗 **Project Structure**

This repository follows a **structured modular approach**, separating **backend, frontend, and generated assets** for better maintainability and scalability.

```
📂 Text2Art-Generator
│── 📂 backend              # Backend logic
│   ├── app.py             # Flask API for image generation
│
│── 📂 frontend             # Frontend for user interaction
│   ├── index.html         # Main user interface
│   ├── script.js          # JavaScript for handling API requests and UI interactions
│   ├── styles.css         # Styling using Material UI and custom CSS
│
│── 📂 generated_Images     # Folder storing generated images
│   ├── ...
│
│── .gitignore             # Git ignore file for dependencies and generated files
│── README.md              # Project documentation
│── README.ipynb           # Jupyter Notebook (if used for experiments)
│
│── 📂 .venv                # Virtual environment for dependency management
│
```

### 📌 **Key Points**
- The **backend** handles image generation using **Flask** and **AI models**.
- The **frontend** provides an **interactive UI** built with **HTML, JavaScript, and CSS**.
- **Generated images** are saved in a dedicated folder to allow easy access.
- The project supports **virtual environments (.venv)** for dependency isolation.

---

### 🛠 **Implementation Specifications**

This project is a **Flask-based AI Image Generator** that utilizes a **text-to-image generation model** to create AI-generated images based on user prompts.

#### 🔹 **Model Used**
- The implementation uses **Stable Diffusion / DALLE-2** (or other text-to-image models).
- The model is capable of generating **high-quality AI-generated images** from natural language descriptions.
- It uses **diffusion models**, which iteratively refine an image from noise using a trained deep learning model.

#### 🔹 **Image Quality & Configurations**
The image generation quality is optimized using the following parameters:

| Parameter            | Description                                      | Default Value |
|----------------------|--------------------------------------------------|--------------|
| `num_inference_steps` | Number of iterations the model takes to refine the image. Higher values improve quality but increase processing time. | **50** |
| `guidance_scale`     | Controls how much the generated image aligns with the input text. Higher values make it more accurate to the prompt. | **7.5** |
| `image_size`         | Determines the resolution of the output image (e.g., **512x512, 768x768**). | **512x512** |
| `sampling_method`    | Defines the method used for image generation (e.g., **DDIM, PLMS, Euler A**). | **DDIM** |
| `seed`              | Enables reproducibility of generated images. If set to `None`, each image is unique. | **Random** |

#### 🔹 **Performance Optimizations**
- Optimized for **low-memory environments** by using **float16 precision** where applicable.
- Runs **asynchronously** to prevent UI freezing during image generation.
- Supports **both CPU and GPU execution** depending on system resources.

#### 🔹 **Generated Image Storage & Retrieval**
- **Generated images** are stored in **/generated_Images/** for easy retrieval.
- Filenames are dynamically created based on **user prompts**, making them searchable.
- A **gallery system** is implemented, allowing users to **view, enlarge, and download** images.

---

### 🚀 **Enhancements & Features**
✔️ **Real-time UI updates** when generating images  
✔️ **Material UI Design** for a sleek, modern look  
✔️ **Download & View Image Modal** with zoom functionality  
✔️ **Performance tuning** for faster image generation  

