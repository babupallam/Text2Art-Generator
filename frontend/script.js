document.addEventListener("DOMContentLoaded", function () {
    let generateBtn = document.getElementById("generateBtn");
    let loadingOverlay = document.getElementById("loadingOverlay");

    // Ensure loading screen is hidden on page load
    loadingOverlay.style.display = "none";

    // Load existing images on page load
    loadExistingImages();

    // Ensure function runs only when button is clicked
    generateBtn.addEventListener("click", function () {
        generateImage();
    });
});

// Function to set input field when clicking a suggested example
function setPrompt(element) {
    document.getElementById("prompt").value = element.textContent;
}

// ✅ Load existing images with correct names
async function loadExistingImages() {
    try {
        let response = await fetch("http://127.0.0.1:5000/list-images");
        let data = await response.json();

        if (data.images.length > 0) {
            data.images.forEach(image => {
                addImageToGallery(image.url, image.name);
            });
        }
    } catch (error) {
        console.error("Error loading images:", error);
    }
}

async function generateImage() {
    let prompt = document.getElementById("prompt").value.trim();
    let generateBtn = document.getElementById("generateBtn");
    let loadingOverlay = document.getElementById("loadingOverlay");

    if (prompt === "") {
        alert("Please enter a text prompt before generating an image.");
        return;
    }

    // ✅ Show loader before sending the request
    loadingOverlay.style.display = "flex";

    try {
        let response = await fetch("http://127.0.0.1:5000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt })
        });

        let data = await response.json();

        if (data.image_url) {
            addImageToGallery(data.image_url, data.image_name);
        } else {
            alert("Error generating image: " + data.error);
        }

    } catch (error) {
        alert("Failed to connect to the server.");
    } finally {
        loadingOverlay.style.display = "none";
        generateBtn.disabled = false;
    }
}

// ✅ Show correct name for each image with no hyphens or hash codes
function addImageToGallery(imageUrl, promptText) {
    let gallery = document.getElementById("gallery");

    let card = document.createElement("div");
    card.className = "image-card";
    card.onclick = function () { openModal(imageUrl); };

    let img = document.createElement("img");
    img.src = imageUrl;
    img.className = "gallery-image";

    // Remove hash at end and replace underscores/hyphens with spaces
    let cleanName = promptText.replace(/[_-]/g, " ").replace(/\s+\S{6,}$/, "");

    let caption = document.createElement("p");
    caption.className = "image-caption";
    caption.textContent = cleanName;

    card.appendChild(img);
    card.appendChild(caption);
    gallery.prepend(card);
}


// Open Modal to View Large Image
function openModal(imageSrc) {
    let modal = document.getElementById("imageModal");
    let modalImage = document.getElementById("modalImage");
    let downloadBtn = document.getElementById("downloadBtn");

    modal.style.display = "block";
    modalImage.src = imageSrc;
    downloadBtn.href = imageSrc;
}

// Close Modal
function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}
