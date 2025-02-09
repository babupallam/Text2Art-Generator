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
            addImageToGallery(data.image_url, data.image_name, true);
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

// ✅ Function to add images correctly (Latest + Gallery)
function addImageToGallery(imageUrl, promptText, isLatest = false) {
    let container = isLatest
        ? document.getElementById("latest-image-section")  // Show latest image separately
        : document.getElementById("gallery");              // Keep older images in gallery

    let card = document.createElement("div");
    card.className = "image-card";
    card.onclick = function () { openModal(imageUrl); };

    let img = document.createElement("img");
    img.src = imageUrl;
    img.className = "gallery-image";

    let caption = document.createElement("p");
    caption.className = "image-caption";
    caption.textContent = promptText;

    card.appendChild(img);
    card.appendChild(caption);

    if (isLatest) {
        container.innerHTML = ""; // ✅ Clear previous latest image
        document.getElementById("latest-image-container").style.display = "block"; // ✅ Show section when an image is generated
    }


    container.prepend(card);
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
