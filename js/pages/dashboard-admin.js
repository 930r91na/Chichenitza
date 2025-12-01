/**
 * CHICHEN ITZA VIRTUAL TOURS - Admin Dashboard
 * Handles admin panel functionality, section loading, and modal management
 */

const adminSectionTitles = {
  dashboard: "Dashboard General",
  tourists: "Gestión de Turistas",
  guides: "Gestión de Guías Turísticos",
  events: "Gestión de Eventos",
  zones: "Gestión de Zonas",
  configuration: "Configuración del Sistema",
};

$(document).ready(function () {
  const sesion = JSON.parse(localStorage.getItem("sesionActual") || "{}");
  if (sesion.tipo !== "admin") {
    window.location.href = "../login.html";
    return;
  }
  $("#adminName").text(sesion.nombre || "Admin");
  loadAdminSection("dashboard");

  // Event Delegation for Modals
  $(document).on("click", "#btn-add-guide", abrirModalGuia);
  $(document).on("click", "#btn-add-event", abrirModalEvento);
  $(document).on("click", "#btn-add-zone", abrirModalZona);
  $(document).on("click", ".btn-edit-zone", abrirModalZona);
});

/**
 * Dynamically load an admin section's HTML content
 * @param {string} seccion - Section identifier (e.g., 'dashboard', 'guides')
 */
function loadAdminSection(seccion) {
  const contentContainer = $("#admin-content-container");

  contentContainer
    .removeClass()
    .addClass(`admin-section active ${seccion}-section`);
  contentContainer.html(
    '<div class="content-card"><div class="card-body"><p>Cargando...</p></div></div>'
  );

  $.get(`./sections/${seccion}.html`)
    .done(function (html) {
      contentContainer.html(html);

      const title = adminSectionTitles[seccion] || "Dashboard";
      $("#sectionTitle").text(title);
      $("#breadcrumb").text(title);

      loadSectionData(seccion);
    })
    .fail(function () {
      contentContainer.html(
        `<div class="content-card"><div class="card-body"><p style="color: var(--error);">Error al cargar la sección.</p></div></div>`
      );
    });
}

/**
 * Fetch and populate data for the section
 * @param {string} seccion - Section identifier
 */
function loadSectionData(seccion) {
  if (seccion === "zones") {
    $.get("http://localhost:3000/api/zones", function (response) {
      const tbody = $(".data-table tbody");
      tbody.empty();
      if (response.data && response.data.length > 0) {
        response.data.forEach((zone) => {
          tbody.append(`
                        <tr>
                            <td><strong>${zone.name}</strong></td>
                            <td><span class="status-badge">${zone.access_level}</span></td>
                            <td>${zone.points}</td>
                            <td>${zone.image_path}</td>
                            <td>
                                <button class="btn-icon btn-edit-zone" title="Editar">✏️</button>
                                <button class="btn-icon delete" title="Eliminar">🗑️</button>
                            </td>
                        </tr>
                    `);
        });
      } else {
        tbody.append('<tr><td colspan="5">No hay zonas registradas.</td></tr>');
      }
    });
  } else if (seccion === "guides") {
    $.get("http://localhost:3000/api/guides", function (response) {
      const grid = $(".guias-grid");
      grid.empty();
      if (response.data && response.data.length > 0) {
        response.data.forEach((guide) => {
          grid.append(`
                        <div class="guia-card">
                            <div class="guia-header">
                                <div class="guia-avatar">
                                    <img src="../images/avatars/default.png" alt="${guide.name}">
                                </div>
                                <span class="status-indicator status-${guide.status}">${guide.status}</span>
                            </div>
                            <h3>${guide.name}</h3>
                            <p class="guia-languages">Idiomas: ${guide.languages}</p>
                            <div class="guia-rating">
                                <span class="stars">⭐⭐⭐⭐⭐</span>
                                <span class="rating-number">${guide.rating}</span>
                            </div>
                            <div class="guia-actions">
                                <button class="btn btn-outline btn-sm">Ver Perfil</button>
                                <button class="btn btn-primary btn-sm">Asignar</button>
                            </div>
                        </div>
                    `);
        });
      } else {
        grid.html("<p>No hay guías registrados.</p>");
      }
    });
  } else if (seccion === "events") {
    $.get("http://localhost:3000/api/events", function (response) {
      const list = $(".eventos-list");
      list.empty();
      if (response.data && response.data.length > 0) {
        response.data.forEach((event) => {
          list.append(`
                        <div class="evento-card">
                            <div class="evento-date">
                                <span class="day">${new Date(
                                  event.date
                                ).getDate()}</span>
                                <span class="month">${new Date(
                                  event.date
                                ).toLocaleString("default", {
                                  month: "short",
                                })}</span>
                            </div>
                            <div class="evento-info">
                                <h4>${event.title}</h4>
                                <p>${event.type} • ${event.status}</p>
                            </div>
                            <div class="evento-stats">
                                <span>👥 ${event.attendees} asistentes</span>
                            </div>
                            <div class="evento-actions">
                                <button class="btn-icon">✏️</button>
                            </div>
                        </div>
                    `);
        });
      } else {
        list.html("<p>No hay eventos registrados.</p>");
      }
    });
  } else if (seccion === "tourists") {
    $.get("http://localhost:3000/api/tourists", function (response) {
      const tbody = $(".data-table tbody");
      tbody.empty();
      if (response.data && response.data.length > 0) {
        response.data.forEach((user) => {
          tbody.append(`
                        <tr>
                            <td><strong>${user.name}</strong></td>
                            <td>${user.email}</td>
                            <td><span class="status-badge">${
                              user.membership_level
                            }</span></td>
                            <td>${new Date(
                              user.created_at
                            ).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-icon" title="Ver Detalles">👁️</button>
                                <button class="btn-icon delete" title="Bloquear">🚫</button>
                            </td>
                        </tr>
                    `);
        });
      } else {
        tbody.append(
          '<tr><td colspan="5">No hay turistas registrados.</td></tr>'
        );
      }
    });
  }
}

/**
 * Handle sidebar navigation clicks
 * @param {string} seccion - Section identifier
 * @param {Event} event - The click event
 */
function cambiarSeccionAdmin(seccion, event) {
  event.preventDefault();
  $(".nav-item").removeClass("active");
  $(event.currentTarget).addClass("active");
  loadAdminSection(seccion);
}

function abrirModalGuia() {
  $("#modalGuia").css("display", "flex");
}
function cerrarModalGuia() {
  $("#modalGuia").css("display", "none");
}
function abrirModalEvento() {
  $("#modalEvento").css("display", "flex");
}
function cerrarModalEvento() {
  $("#modalEvento").css("display", "none");
}
function abrirModalZona() {
  $("#modalZona").css("display", "flex");
}
function cerrarModalZona() {
  $("#modalZona").css("display", "none");
}

function cerrarSesion() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    localStorage.removeItem("sesionActual");
    window.location.href = "../login.html";
  }
}

// Export functions globally
window.cambiarSeccionAdmin = cambiarSeccionAdmin;
window.abrirModalGuia = abrirModalGuia;
window.cerrarModalGuia = cerrarModalGuia;
window.abrirModalEvento = abrirModalEvento;
window.cerrarModalEvento = cerrarModalEvento;
window.abrirModalZona = abrirModalZona;
window.cerrarModalZona = cerrarModalZona;
window.cerrarSesion = cerrarSesion;
