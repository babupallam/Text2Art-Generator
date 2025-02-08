async function generateImage() {
    let prompt = document.getElementById("prompt").value;
    let response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt })
    });
    let data = await response.json();
    document.getElementById("output").src = "http://127.0.0.1:5000" + data.image_url;
}
