/**
 * CHICHEN ITZA VIRTUAL TOURS - Login Page
 * Handles login functionality for tourists and administrators
 */

// Verificar si ya hay sesión activa al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  const sesion = ChichenItzaAuth.getSession();
  if (sesion && sesion.tipo) {
    ChichenItzaAuth.redirectByRole();
  }
});

/**
 * Handle tourist login
 * @param {Event} event - Form submit event
 */
async function iniciarSesionTurista(event) {
  event.preventDefault();

  const email = document.getElementById("turistaEmail").value;
  const password = document.getElementById("turistaPassword").value;

  // Use the authentication module
  const result = await ChichenItzaAuth.loginTurista(email, password);

  if (result.success) {
    ChichenItzaNotifications.success(result.message);
    setTimeout(() => {
      window.location.href = "./Tourist/tour-turista.html";
    }, 1500);
  } else {
    ChichenItzaNotifications.error(result.message);
  }
}

/**
 * Handle admin login
 * @param {Event} event - Form submit event
 */
async function iniciarSesionAdmin(event) {
  event.preventDefault();

  const usuario = document.getElementById("adminUsuario").value;
  const password = document.getElementById("adminPassword").value;

  // Use the authentication module
  const result = await ChichenItzaAuth.loginAdmin(usuario, password);

  if (result.success) {
    ChichenItzaNotifications.success(result.message);
    setTimeout(() => {
      window.location.href = "./Admin/dashboard-admin.html";
    }, 1500);
  } else {
    ChichenItzaNotifications.error(result.message);
  }
}

/**
 * Switch between login tabs
 * @param {string} tipo - Tab type ('turista' or 'admin')
 */
function cambiarTabLogin(tipo) {
  // Cambiar tabs activos
  document.querySelectorAll(".login-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  event.target.closest(".login-tab").classList.add("active");

  // Cambiar contenido
  document.querySelectorAll(".login-form-container").forEach((container) => {
    container.classList.remove("active");
  });
  document.getElementById(tipo + "-login").classList.add("active");
}
