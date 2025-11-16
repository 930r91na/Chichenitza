/**
 * CHICHEN ITZA VIRTUAL TOURS - Tourist Tour Page
 * Handles virtual tour functionality, zone management, and membership features
 */

// Tour state variables
let tiempoInicio = Date.now();
let zonasVisitadasSet = new Set();
let puntos = 0;
let nivelUsuario = 'free';

/**
 * Initialize tour page
 */
window.onload = function() {
    const sesion = JSON.parse(localStorage.getItem('sesionActual') || '{}');

    if (sesion.tipo !== 'turista') {
        window.location.href = '../login.html';
        return;
    }

    // Load user data
    document.getElementById('userName').textContent = sesion.nombreAvatar || sesion.nombre;
    nivelUsuario = sesion.nivel || 'free';

    // Update membership badge
    const badges = {
        free: { icon: '🆓', text: 'FREE', class: 'free' },
        premium: { icon: '⭐', text: 'PREMIUM', class: 'premium' },
        vip: { icon: '💎', text: 'VIP', class: 'vip' }
    };

    const badge = badges[nivelUsuario];
    document.getElementById('membershipBadge').className = `membership-display ${badge.class}`;
    document.getElementById('membershipLevel').innerHTML = `${badge.icon} ${badge.text}`;
    document.getElementById('userMembership').textContent = `Plan ${badge.text}`;

    // Show avatar if has image
    if (sesion.avatarImage) {
        document.querySelector('.avatar-img').innerHTML = `<img src="${sesion.avatarImage}" alt="Avatar">`;
    }

    // Enable guide button if premium or vip
    if (nivelUsuario === 'premium' || nivelUsuario === 'vip') {
        document.getElementById('guideBtn').disabled = false;
        document.getElementById('guideBtn').classList.add('enabled');
    }

    // Hide upgrade section if VIP
    if (nivelUsuario === 'vip') {
        document.getElementById('upgradeSection').style.display = 'none';
    }

    // Load events based on membership level
    cargarEventos();

    // Start timer
    iniciarTemporizador();

    // Unlock zones based on membership level
    desbloquearZonas();
};

/**
 * Unlock zones based on user's membership level
 */
function desbloquearZonas() {
    if (nivelUsuario === 'premium' || nivelUsuario === 'vip') {
        document.querySelectorAll('.zone-item-tour.locked[onclick*="premium"]').forEach(zone => {
            zone.classList.remove('locked');
            zone.classList.add('accessible');
            zone.querySelector('.zone-lock').textContent = '→';
            zone.onclick = function() {
                const zoneName = this.querySelector('h4').textContent;
                const zoneId = zoneName.toLowerCase().replace(/\s/g, '');
                visitarZona(zoneId, 'premium');
            };
        });
    }

    if (nivelUsuario === 'vip') {
        document.querySelectorAll('.zone-item-tour.locked[onclick*="vip"]').forEach(zone => {
            zone.classList.remove('locked');
            zone.classList.add('accessible');
            zone.querySelector('.zone-lock').textContent = '→';
            zone.onclick = function() {
                visitarZona('cenote', 'vip');
            };
        });
    }
}

/**
 * Visit a zone and update user stats
 * @param {string} zonaId - Zone identifier
 * @param {string} nivelRequerido - Required membership level
 */
function visitarZona(zonaId, nivelRequerido) {
    // Use centralized config
    const zona = window.ChichenItzaConfig?.zones?.[zonaId];
    if (!zona) return;

    // Update scene with image background
    const sceneBg = document.querySelector('.tour-scene-bg');
    if (sceneBg && zona.image) {
        // Adjust path for Tourist subdirectory
        const imagePath = '../' + zona.image;
        sceneBg.style.backgroundImage = `url('${imagePath}')`;
        sceneBg.style.backgroundSize = 'cover';
        sceneBg.style.backgroundPosition = 'center';
    }

    // Update scene text
    document.getElementById('zoneName').textContent = zona.name;
    document.getElementById('zoneDescription').textContent = zona.description;

    // Add visited zone
    if (!zonasVisitadasSet.has(zonaId)) {
        zonasVisitadasSet.add(zonaId);
        puntos += zona.points;
        ChichenItzaNotifications.success(`¡+${zona.points} puntos! Has visitado ${zona.name}`);
    }

    // Update stats
    document.getElementById('zonasVisitadas').textContent = `${zonasVisitadasSet.size}/6`;
    document.getElementById('puntosUsuario').textContent = puntos;
}

/**
 * Verify access to a zone based on membership level
 * @param {string} zonaId - Zone identifier
 * @param {string} nivelRequerido - Required membership level
 */
function verificarAcceso(zonaId, nivelRequerido) {
    if (nivelRequerido === 'premium' && (nivelUsuario === 'premium' || nivelUsuario === 'vip')) {
        visitarZona(zonaId, nivelRequerido);
        return;
    }

    if (nivelRequerido === 'vip' && nivelUsuario === 'vip') {
        visitarZona(zonaId, nivelRequerido);
        return;
    }

    // Show upgrade modal
    const mensajes = {
        premium: 'Esta zona requiere una membresía Premium o superior para acceder.',
        vip: 'Esta zona es exclusiva para miembros VIP.'
    };

    document.getElementById('modalMessage').textContent = mensajes[nivelRequerido];
    document.getElementById('upgradeModal').style.display = 'block';
}

/**
 * Show membership plans modal
 */
function mostrarPlanes() {
    document.getElementById('upgradeModal').style.display = 'block';
}

/**
 * Load events based on user's membership level
 */
function cargarEventos() {
    const eventsList = document.getElementById('eventsList');

    if (nivelUsuario === 'free') {
        eventsList.innerHTML = '<p class="no-events">Mejora a Premium para acceder a eventos exclusivos</p>';
    } else if (nivelUsuario === 'premium') {
        eventsList.innerHTML = `
            <div class="event-mini">
                <strong>Taller de Historia Maya</strong>
                <small>22 Nov - 16:00</small>
            </div>
            <div class="event-mini">
                <strong>Tour Familiar</strong>
                <small>25 Nov - 10:00</small>
            </div>
        `;
    } else if (nivelUsuario === 'vip') {
        eventsList.innerHTML = `
            <div class="event-mini vip">
                <strong>Tour Nocturno VIP</strong>
                <small>20 Nov - 20:00</small>
            </div>
            <div class="event-mini vip">
                <strong>Sesión con Arqueólogo</strong>
                <small>23 Nov - 18:00</small>
            </div>
        `;
    }
}

/**
 * Start tour duration timer
 */
function iniciarTemporizador() {
    setInterval(() => {
        const transcurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
        const horas = Math.floor(transcurrido / 3600);
        const minutos = Math.floor((transcurrido % 3600) / 60);
        document.getElementById('tiempoTotal').textContent = `${horas}h ${minutos}m`;
    }, 60000); // Update every minute
}

/**
 * Move avatar in specified direction
 * @param {string} direccion - Direction to move
 */
function moverAvatar(direccion) {
    console.log('Moviendo:', direccion);
    // Movement logic (to be implemented)
}

/**
 * Take a photo in the current zone
 */
function tomarFoto() {
    ChichenItzaNotifications.success('📷 Foto guardada en tu galería');
}

/**
 * Show interactive map
 */
function mostrarMapa() {
    alert('🗺️ Mapa interactivo (función en desarrollo)');
}

/**
 * Show zone information modal
 */
function mostrarInfo() {
    const zonaNombre = document.getElementById('zoneName').textContent;
    document.getElementById('infoContent').innerHTML = `
        <h2>${zonaNombre}</h2>
        <p>Información detallada sobre esta zona...</p>
    `;
    document.getElementById('infoModal').style.display = 'block';
}

/**
 * Open chat window
 */
function abrirChat() {
    alert('💬 Chat (función en desarrollo)');
}

/**
 * Request a tour guide
 */
function solicitarGuia() {
    if (nivelUsuario === 'free') {
        alert('Esta función requiere membresía Premium o superior');
        return;
    }
    alert('👨‍🏫 Solicitando guía turístico...');
}

/**
 * Show user profile
 */
function verPerfil() {
    alert('Perfil de usuario (función en desarrollo)');
}

/**
 * Log out current user
 */
function cerrarSesion() {
    if (confirm('¿Deseas cerrar sesión?')) {
        localStorage.removeItem('sesionActual');
        window.location.href = '../login.html';
    }
}

/**
 * Close modal by ID
 * @param {string} modalId - Modal element ID
 */
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Export functions globally for onclick handlers in HTML
window.desbloquearZonas = desbloquearZonas;
window.visitarZona = visitarZona;
window.verificarAcceso = verificarAcceso;
window.mostrarPlanes = mostrarPlanes;
window.cargarEventos = cargarEventos;
window.moverAvatar = moverAvatar;
window.tomarFoto = tomarFoto;
window.mostrarMapa = mostrarMapa;
window.mostrarInfo = mostrarInfo;
window.abrirChat = abrirChat;
window.solicitarGuia = solicitarGuia;
window.verPerfil = verPerfil;
window.cerrarSesion = cerrarSesion;
window.cerrarModal = cerrarModal;
