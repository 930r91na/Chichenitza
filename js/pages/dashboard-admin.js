/**
 * CHICHEN ITZA VIRTUAL TOURS - Admin Dashboard
 * Handles admin panel functionality, section loading, and modal management
 */

// Section titles mapping (NOW WITH ENGLISH KEYS)
const adminSectionTitles = {
    dashboard: 'Dashboard General',
    tourists: 'Gestión de Turistas',
    guides: 'Gestión de Guías Turísticos',
    events: 'Gestión de Eventos',
    zones: 'Gestión de Zonas',
    configuration: 'Configuración del Sistema'
};

/**
 * Initialize admin dashboard
 */
window.onload = function() {
    const sesion = JSON.parse(localStorage.getItem('sesionActual') || '{}');
    if (sesion.tipo !== 'admin') {
        window.location.href = '../login.html';
        return;
    }
    document.getElementById('adminName').textContent = sesion.nombre || 'Admin';
    loadAdminSection('dashboard'); // Load default section
};

/**
 * Dynamically load an admin section's HTML content
 * @param {string} seccion - Section identifier (e.g., 'dashboard', 'guides')
 */
async function loadAdminSection(seccion) {
    const contentContainer = document.getElementById('admin-content-container');
    if (!contentContainer) {
        console.error('Admin content container not found!');
        return;
    }
    
    // Asigna la clase de sección para estilos
    contentContainer.className = `admin-section active ${seccion}-section`;
    contentContainer.innerHTML = '<div class="content-card"><div class="card-body"><p>Cargando...</p></div></div>';
    
    try {
        const response = await fetch(`./sections/${seccion}.html`);
        
        if (!response.ok) {
            throw new Error(`Could not load section: ${seccion}.html (404 Not Found)`);
        }
        
        const html = await response.text();
        contentContainer.innerHTML = html;
        
        // ¡NUEVO! Adjunta los eventos a los botones recién cargados
        bindSectionEvents();
        
        const title = adminSectionTitles[seccion] || 'Dashboard';
        document.getElementById('sectionTitle').textContent = title;
        document.getElementById('breadcrumb').textContent = title;
        
    } catch (error) {
        console.error('Error loading section:', error);
        contentContainer.innerHTML = `<div class="content-card"><div class="card-body"><p style="color: var(--error);">Error al cargar la sección. Por favor, intente de nuevo.</p></div></div>`;
    }
}

/**
 * NUEVA FUNCIÓN
 * Busca botones en el HTML recién inyectado y les adjunta sus funciones de JS.
 */
function bindSectionEvents() {
    
    // --- Para sections/guides.html ---
    const btnAddGuide = document.getElementById('btn-add-guide');
    if (btnAddGuide) {
        btnAddGuide.addEventListener('click', abrirModalGuia);
    }

    // --- Para sections/events.html ---
    const btnAddEvent = document.getElementById('btn-add-event');
    if (btnAddEvent) {
        btnAddEvent.addEventListener('click', abrirModalEvento);
    }

    // --- Para sections/zones.html ---
    const btnAddZone = document.getElementById('btn-add-zone');
    if (btnAddZone) {
        btnAddZone.addEventListener('click', abrirModalZona);
    }
    // Adjunta evento a todos los botones de "Editar" en la tabla de zonas
    const btnsEditZone = document.querySelectorAll('.btn-edit-zone');
    btnsEditZone.forEach(btn => {
        btn.addEventListener('click', abrirModalZona);
    });

    // ... (Aquí puedes agregar más listeners para 'tourists.html', etc.) ...
}


/**
 * Handle sidebar navigation clicks
 * @param {string} seccion - Section identifier
 * @param {Event} event - The click event
 */
function cambiarSeccionAdmin(seccion, event) {
    event.preventDefault(); 
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.currentTarget.classList.add('active');
    loadAdminSection(seccion);
}

// --- FUNCIONES DE MODALES (permanecen igual) ---

function abrirModalGuia() {
    document.getElementById('modalGuia').style.display = 'flex';
}
function cerrarModalGuia() {
    document.getElementById('modalGuia').style.display = 'none';
}
function abrirModalEvento() {
    document.getElementById('modalEvento').style.display = 'flex';
}
function cerrarModalEvento() {
    document.getElementById('modalEvento').style.display = 'none';
}
// Nueva función de modal para Zonas
function abrirModalZona() {
    document.getElementById('modalZona').style.display = 'flex';
}
function cerrarModalZona() {
    document.getElementById('modalZona').style.display = 'none';
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('sesionActual');
        window.location.href = '../login.html';
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