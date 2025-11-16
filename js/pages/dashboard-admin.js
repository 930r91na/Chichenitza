/**
 * CHICHEN ITZA VIRTUAL TOURS - Admin Dashboard
 * Handles admin panel functionality, section navigation, and modal management
 */

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
};

/**
 * Switch between admin panel sections
 * @param {string} seccion - Section identifier
 */
function cambiarSeccionAdmin(seccion) {
    // Remove active class from all sections and nav items
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Activate selected section and nav item
    document.getElementById(seccion + '-section').classList.add('active');
    event.target.closest('.nav-item').classList.add('active');

    // Section titles mapping
    const titles = {
        dashboard: 'Dashboard General',
        turistas: 'Gestión de Turistas',
        guias: 'Gestión de Guías Turísticos',
        eventos: 'Gestión de Eventos',
        zonas: 'Gestión de Zonas',
        servidores: 'Monitoreo de Servidores',
        configuracion: 'Configuración del Sistema'
    };

    // Update page title and breadcrumb
    document.getElementById('sectionTitle').textContent = titles[seccion];
    document.getElementById('breadcrumb').textContent = titles[seccion];
}

/**
 * Open guide modal
 */
function abrirModalGuia() {
    document.getElementById('modalGuia').style.display = 'block';
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
    document.getElementById('modalEvento').style.display = 'block';
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
