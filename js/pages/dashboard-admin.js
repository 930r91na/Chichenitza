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
    // Verify authentication
    const sesion = JSON.parse(localStorage.getItem('sesionActual') || '{}');
    if (sesion.tipo !== 'admin') {
        window.location.href = '../login.html';
        return;
    }

    // Display admin name
    document.getElementById('adminName').textContent = sesion.nombre || 'Admin';
    
    // Load default section (dashboard)
    loadAdminSection('dashboard');
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
    
    // Set loading placeholder
    contentContainer.innerHTML = '<p>Cargando...</p>';
    
    try {
        // Fetch the HTML partial
        const response = await fetch(`./sections/${seccion}.html`);
        
        if (!response.ok) {
            throw new Error(`Could not load section: ${seccion}.html (404 Not Found)`);
        }
        
        const html = await response.text();
        
        // Inject the HTML into the container
        contentContainer.innerHTML = html;
        
        // Update breadcrumb and title
        const title = adminSectionTitles[seccion] || 'Dashboard';
        document.getElementById('sectionTitle').textContent = title;
        document.getElementById('breadcrumb').textContent = title;
        
    } catch (error) {
        console.error('Error loading section:', error);
        contentContainer.innerHTML = `<p style="color: var(--error);">Error al cargar la sección. Por favor, intente de nuevo.</p>`;
    }
}

/**
 * Handle sidebar navigation clicks
 * @param {string} seccion - Section identifier
 * @param {Event} event - The click event
 */
function cambiarSeccionAdmin(seccion, event) {
    event.preventDefault(); // Stop link from navigating
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    // Add active class to clicked item
    event.currentTarget.classList.add('active');
    
    // Load the new section content
    loadAdminSection(seccion);
}

/**
 * Open guide modal
 */
function abrirModalGuia() {
    document.getElementById('modalGuia').style.display = 'flex';
}

/**
 * Close guide modal
 */
function cerrarModalGuia() {
    document.getElementById('modalGuia').style.display = 'none';
}

/**
 * Open event modal
 */
function abrirModalEvento() {
    document.getElementById('modalEvento').style.display = 'flex';
}

/**
 * Close event modal
 */
function cerrarModalEvento() {
    document.getElementById('modalEvento').style.display = 'none';
}

/**
 * Log out admin user
 */
function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('sesionActual');
        window.location.href = '../login.html';
    }
}

// Export functions globally for onclick handlers in HTML
window.cambiarSeccionAdmin = cambiarSeccionAdmin;
window.abrirModalGuia = abrirModalGuia;
window.cerrarModalGuia = cerrarModalGuia;
window.abrirModalEvento = abrirModalEvento;
window.cerrarModalEvento = cerrarModalEvento;
window.cerrarSesion = cerrarSesion;