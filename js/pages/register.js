/**
 * CHICHEN ITZA VIRTUAL TOURS - Registration Page
 * Handles tourist registration form with multi-step validation
 */

// Avatar image data storage
let avatarImageData = null;

/**
 * Navigate to next/previous step
 * @param {number} paso - Step number to navigate to
 */
function siguientePaso(paso) {
  // Validate current step before advancing
  const pasoActual = document.querySelector(".form-step.active").dataset.step;

  if (paso > pasoActual) {
    if (!validarPaso(pasoActual)) {
      return;
    }
  }

  // Hide all steps
  document.querySelectorAll(".form-step").forEach((step) => {
    step.classList.remove("active");
  });
  document.querySelectorAll(".step").forEach((step) => {
    step.classList.remove("active");
  });

  // Show selected step
  document
    .querySelector(`.form-step[data-step="${paso}"]`)
    .classList.add("active");
  document.querySelector(`.step[data-step="${paso}"]`).classList.add("active");

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Validate current step
 * @param {number} paso - Step number to validate
 * @returns {boolean} - True if step is valid
 */
function validarPaso(paso) {
  if (paso == 1) {
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const pais = document.getElementById("pais").value;

    if (!nombre || !email || !password || !confirmPassword || !pais) {
      ChichenItzaNotifications.error(
        "Por favor completa todos los campos obligatorios"
      );
      return false;
    }

    if (password !== confirmPassword) {
      ChichenItzaNotifications.error("Las contraseñas no coinciden");
      return false;
    }

    if (password.length < 8) {
      ChichenItzaNotifications.error(
        "La contraseña debe tener al menos 8 caracteres"
      );
      return false;
    }

    if (!ChichenItzaValidators.validateEmail(email)) {
      ChichenItzaNotifications.error("Por favor ingresa un email válido");
      return false;
    }

    return true;
  }

  if (paso == 2) {
    const nombreAvatar = document.getElementById("nombreAvatar").value;
    if (!nombreAvatar) {
      ChichenItzaNotifications.error("Por favor ingresa un nombre de usuario");
      return false;
    }
    return true;
  }

  return true;
}

/**
 * Load avatar image from file input
 * @param {Event} event - File input change event
 */
function cargarImagenAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.match("image.*")) {
    ChichenItzaNotifications.error("Por favor selecciona una imagen válida");
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    ChichenItzaNotifications.error("La imagen no debe superar los 5MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    avatarImageData = e.target.result;

    const preview = document.getElementById("avatarPreview");
    preview.innerHTML = `<img src="${e.target.result}" alt="Avatar" class="avatar-image-uploaded">`;

    ChichenItzaNotifications.success("Imagen cargada correctamente");
  };
  reader.readAsDataURL(file);
}

/**
 * Remove uploaded avatar image
 */
function eliminarImagenAvatar() {
  avatarImageData = null;
  document.getElementById("avatarImage").value = "";
  document.getElementById("avatarPreview").innerHTML = `
        <div class="avatar-placeholder">
            <span class="placeholder-icon">📷</span>
            <p>Sube tu foto</p>
        </div>
    `;
  ChichenItzaNotifications.info("Imagen eliminada");
}

/**
 * Handle form submission
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registroTuristaForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validarPaso(3)) {
      return;
    }

    // Collect form data
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData.entries());
    datos.avatarImage = avatarImageData;

    // Send to API
    $.ajax({
      url: "http://localhost:3000/api/register",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(datos),
      success: function (response) {
        if (response.success) {
          // Create session
          localStorage.setItem("sesionActual", JSON.stringify(response.user));

          // Show success message
          ChichenItzaNotifications.success(
            "¡Registro exitoso! Bienvenido a Chichen Itzá Virtual Tours"
          );

          // Redirect to tour page
          setTimeout(() => {
            window.location.href = "./tour-turista.html";
          }, 2000);
        } else {
          ChichenItzaNotifications.error(
            "Error en el registro: " + response.message
          );
        }
      },
      error: function (xhr) {
        ChichenItzaNotifications.error(
          "Error de conexión: " + (xhr.responseJSON?.message || xhr.statusText)
        );
      },
    });
  });
});

// Export functions globally for onclick handlers in HTML
window.siguientePaso = siguientePaso;
window.cargarImagenAvatar = cargarImagenAvatar;
window.eliminarImagenAvatar = eliminarImagenAvatar;
