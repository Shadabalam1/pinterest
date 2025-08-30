document.getElementById("upload-input").addEventListener("change", function(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("preview-container");
  preview.innerHTML = ""; // reset

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      preview.appendChild(img);
    }
    reader.readAsDataURL(file);
  }
});

// Navbar toggle JS
document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelector(".lines");
  const navLinks = document.querySelector(".navLink");

  lines.addEventListener("click", () => {
    navLinks.classList.toggle("nav-active");  // show/hide links
    lines.classList.toggle("toggle");         // animate lines
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const createBtn = document.getElementById("create-post-btn");
  const formContainer = document.getElementById("post-form-container");

  createBtn.addEventListener("click", () => {
    formContainer.style.display = "block";   // show form
    createBtn.style.display = "none";        // hide button
  });
});
