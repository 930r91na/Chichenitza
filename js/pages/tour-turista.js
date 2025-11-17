/**
 * CHICHEN ITZA VIRTUAL TOURS - Tourist Tour Page
 * Handles virtual tour functionality, zone management, and modal logic.
 *
 * This file follows the modular pattern:
 * 1. No global functions (all wrapped in DOMContentLoaded).
 * 2. Event listeners are bound in bindEventListeners().
 * 3. No inline 'onclick' attributes are used in the HTML.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- STATE VARIABLES ---
    let tiempoInicio = Date.now();
    let zonasVisitadasSet = new Set();
    let galleryPhotos = [];
    let puntos = 0;
    let nivelUsuario = 'free';
    let sesion = {};
    let currentZoneId = null;

    // Three.js scene variables
    let scene, camera, renderer, controls, sphere;

    // --- ELEMENT REFERENCES ---
    const elements = {
        userName: document.getElementById('userName'),
        userMembership: document.getElementById('userMembership'),
        membershipBadge: document.getElementById('membershipBadge'),
        membershipLevel: document.getElementById('membershipLevel'),
        avatarDisplay: document.querySelector('.avatar-img'),
        guideBtn: document.getElementById('guideBtn'),
        upgradeSection: document.getElementById('upgradeSection'),
        eventsList: document.getElementById('eventsList'),
        zonasVisitadas: document.getElementById('zonasVisitadas'),
        puntosUsuario: document.getElementById('puntosUsuario'),
        tiempoTotal: document.getElementById('tiempoTotal'),
        zoneName: document.getElementById('zoneName'),
        zoneDescription: document.getElementById('zoneDescription'),
        welcomeMessage: document.getElementById('tour-scene-welcome'),
        canvasContainer: document.getElementById('tour-scene-canvas-container'),
        // Modals
        upgradeModal: document.getElementById('upgradeModal'),
        modalMessage: document.getElementById('modalMessage'),
        infoModal: document.getElementById('infoModal'),
        infoContent: document.getElementById('infoContent'),
        profileModal: document.getElementById('profileModal'),
        galleryModal: document.getElementById('galleryModal'),
        mapModal: document.getElementById('mapModal'),
        chatModal: document.getElementById('chatModal'),
        chatBody: document.getElementById('chatBody'),
        chatInput: document.getElementById('chatInput'),
        // Profile Modal Elements
        profileModalAvatar: document.getElementById('profileModalAvatar'),
        profileModalName: document.getElementById('profileModalName'),
        profileModalEmail: document.getElementById('profileModalEmail'),
        profileModalMembershipBadge: document.getElementById('profileModalMembershipBadge'),
        profileModalMembershipLevel: document.getElementById('profileModalMembershipLevel'),
        profileModalZones: document.getElementById('profileModalZones'),
        profileModalPoints: document.getElementById('profileModalPoints'),
        profileModalJoinDate: document.getElementById('profileModalJoinDate'),
        // Gallery Modal Elements
        galleryGrid: document.getElementById('galleryGrid'),
        galleryPlaceholder: document.getElementById('galleryPlaceholder')
    };

    /**
     * Main initialization function. Runs on page load.
     */
    function init() {
        sesion = JSON.parse(localStorage.getItem('sesionActual') || '{}');

        if (sesion.tipo !== 'turista') {
            window.location.href = '../login.html';
            return;
        }

        nivelUsuario = sesion.nivel || 'free';

        loadUserData();
        cargarEventos(); // <-- ¡CORREGIDO! De loadEvents() a cargarEventos()
        iniciarTemporizador();
        desbloquearZonas();
        bindEventListeners();
        initThreeScene();
    }

    /**
     * Loads user data from session into the UI.
     */
    function loadUserData() {
        elements.userName.textContent = sesion.nombreAvatar || sesion.nombre;

        const badges = {
            free: { icon: '🆓', text: 'FREE', class: 'free' },
            premium: { icon: '⭐', text: 'PREMIUM', class: 'premium' },
            vip: { icon: '💎', text: 'VIP', class: 'vip' }
        };
        const badge = badges[nivelUsuario] || badges.free;

        elements.membershipBadge.className = `membership-display ${badge.class}`;
        elements.membershipLevel.innerHTML = `${badge.icon} ${badge.text}`;
        elements.userMembership.textContent = `Plan ${badge.text}`;

        if (sesion.avatarImage) {
            elements.avatarDisplay.innerHTML = `<img src="${sesion.avatarImage}" alt="Avatar">`;
        }

        if (nivelUsuario === 'premium' || nivelUsuario === 'vip') {
            elements.guideBtn.disabled = false;
            elements.guideBtn.classList.add('enabled');
        }

        if (nivelUsuario === 'vip') {
            elements.upgradeSection.style.display = 'none';
        }
    }

    /**
     * Attaches all event listeners to buttons and interactive elements.
     * This follows the "Golden Rule" from DEVELOPMENT_GUIDE.md.
     */
    function bindEventListeners() {
        // Navbar
        document.getElementById('btn-profile').addEventListener('click', verPerfil);
        document.getElementById('btn-logout').addEventListener('click', cerrarSesion);
        document.getElementById('btn-show-gallery').addEventListener('click', mostrarGaleria);

        // Action Bar
        document.getElementById('btn-take-photo').addEventListener('click', tomarFoto);
        document.getElementById('btn-show-map').addEventListener('click', mostrarMapa);
        document.getElementById('btn-show-info').addEventListener('click', mostrarInfo);
        document.getElementById('btn-open-chat').addEventListener('click', abrirChat);
        elements.guideBtn.addEventListener('click', solicitarGuia);

        // Zone List
        document.querySelectorAll('.zone-item-tour').forEach(zone => {
            zone.addEventListener('click', handleZoneClick);
        });

        // Upgrade Button
        document.getElementById('btn-show-plans').addEventListener('click', mostrarPlanes);
        
        // Modal Close Buttons
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-target-modal');
                cerrarModal(modalId);
            });
        });

        // Chat Send Button
        document.getElementById('btn-send-chat').addEventListener('click', enviarMensajeChat);
        elements.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') enviarMensajeChat();
        });
        
        // Window resize
        window.addEventListener('resize', onWindowResize);
    }

    /**
     * Initializes the Three.js 3D scene.
     */
    function initThreeScene() {
        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(75, elements.canvasContainer.clientWidth / elements.canvasContainer.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 0.1); // Start at the center
        scene.add(camera);

        // Renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(elements.canvasContainer.clientWidth, elements.canvasContainer.clientHeight);
        elements.canvasContainer.appendChild(renderer.domElement);

        // Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false; // Disable zooming
        controls.enablePan = false;  // Disable panning
        controls.enableDamping = true; // Smooth motion
        controls.dampingFactor = 0.1;
        controls.rotateSpeed = -0.25; // Invert direction for natural dragging

        // Initial render
        animate();
    }
    
    /**
     * Handles window resize to keep 3D scene aspect ratio correct.
     */
    function onWindowResize() {
        if (renderer && camera) {
            const width = elements.canvasContainer.clientWidth;
            const height = elements.canvasContainer.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    }

    /**
     * Animation loop for Three.js
     */
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Update controls for damping
        if (renderer) renderer.render(scene, camera);
    }

    /**
     * Handles a click on any zone item.
     * @param {Event} event - The click event
     */
    function handleZoneClick(event) {
        const zoneEl = event.currentTarget;
        const zonaId = zoneEl.getAttribute('data-zone-id');
        const nivelRequerido = zoneEl.getAttribute('data-zone-tier');

        // Check access
        if (verificarAcceso(zonaId, nivelRequerido)) {
            visitarZona(zonaId);
        }
    }

    /**
     * Unlocks zones in the UI based on membership level.
     */
    function desbloquearZonas() {
        const allZones = document.querySelectorAll('.zone-item-tour.locked');
        
        allZones.forEach(zone => {
            const tier = zone.getAttribute('data-zone-tier');
            let hasAccess = false;

            if (tier === 'free') hasAccess = true;
            if (tier === 'premium' && (nivelUsuario === 'premium' || nivelUsuario === 'vip')) hasAccess = true;
            if (tier === 'vip' && nivelUsuario === 'vip') hasAccess = true;

            if (hasAccess) {
                zone.classList.remove('locked');
                zone.classList.add('accessible');
                zone.querySelector('.zone-lock').textContent = '→';
            }
        });
    }

    /**
     * Visits a zone and updates the 3D scene and user stats.
     * @param {string} zonaId - Zone identifier
     */
    function visitarZona(zonaId) {
        const zona = window.ChichenItzaConfig?.zones?.[zonaId];
        if (!zona) return;
        
        currentZoneId = zonaId; // Store current zone
        elements.welcomeMessage.style.display = 'none'; // Hide welcome text

        // --- Update 3D Scene ---
        const loader = new THREE.TextureLoader();
        const imagePath = '../' + zona.image;
        
        loader.load(imagePath, (texture) => {
            // Create a sphere geometry
            const geometry = new THREE.SphereGeometry(500, 60, 40);
            // Invert the geometry on the x-axis so we see it from the inside
            geometry.scale(-1, 1, 1);

            // Create material with the new texture
            const material = new THREE.MeshBasicMaterial({ map: texture });
            
            // Remove old sphere if it exists
            if (sphere) scene.remove(sphere);

            // Create new mesh and add to scene
            sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);
        });

        // Update scene text (now hidden, but good for state)
        elements.zoneName.textContent = zona.name;
        elements.zoneDescription.textContent = zona.description;

        // Add visited zone and points
        if (!zonasVisitadasSet.has(zonaId)) {
            zonasVisitadasSet.add(zonaId);
            puntos += zona.points;
            ChichenItzaNotifications.success(`¡+${zona.points} puntos! Has visitado ${zona.name}`);
        }

        // Update stats
        elements.zonasVisitadas.textContent = `${zonasVisitadasSet.size}/6`;
        elements.puntosUsuario.textContent = puntos;
    }

    /**
     * Verifies if the user has access to a zone.
     * @param {string} zonaId - Zone identifier
     * @param {string} nivelRequerido - Required membership level
     * @returns {boolean} - True if user has access, false otherwise.
     */
    function verificarAcceso(zonaId, nivelRequerido) {
        let hasAccess = false;
        if (nivelRequerido === 'free') hasAccess = true;
        if (nivelRequerido === 'premium' && (nivelUsuario === 'premium' || nivelUsuario === 'vip')) hasAccess = true;
        if (nivelRequerido === 'vip' && nivelUsuario === 'vip') hasAccess = true;

        if (hasAccess) {
            return true;
        }

        // Show upgrade modal if no access
        const mensajes = {
            premium: 'Esta zona requiere una membresía Premium o superior para acceder.',
            vip: 'Esta zona es exclusiva para miembros VIP.'
        };
        elements.modalMessage.textContent = mensajes[nivelRequerido];
        abrirModal('upgradeModal');
        return false;
    }

    /**
     * Loads events based on membership.
     */
    function cargarEventos() {
        if (nivelUsuario === 'free') {
            elements.eventsList.innerHTML = '<p class="no-events">Mejora a Premium para acceder a eventos exclusivos</p>';
        } else if (nivelUsuario === 'premium') {
            elements.eventsList.innerHTML = `
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
            elements.eventsList.innerHTML = `
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
     * Starts the tour duration timer.
     */
    function iniciarTemporizador() {
        setInterval(() => {
            const transcurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
            const horas = Math.floor(transcurrido / 3600);
            const minutos = Math.floor((transcurrido % 3600) / 60);
            elements.tiempoTotal.textContent = `${horas}h ${minutos}m`;
        }, 60000); // Update every minute
    }

    /**
     * Simulates taking a photo of the current zone.
     */
    function tomarFoto() {
        if (!currentZoneId) {
            ChichenItzaNotifications.error('Debes estar en una zona para tomar una foto.');
            return;
        }
        
        const zona = window.ChichenItzaConfig?.zones?.[currentZoneId];
        if (!zona) return;

        // Add photo to gallery array
        galleryPhotos.push({
            id: `photo_${Date.now()}`,
            name: zona.name,
            image: `../${zona.image}`
        });
        
        ChichenItzaNotifications.success(`📷 Foto de "${zona.name}" guardada en tu galería.`);
        
        // Update placeholder if it's the first photo
        if (galleryPhotos.length === 1) {
            elements.galleryPlaceholder.style.display = 'none';
        }

        // Add to gallery grid dynamically
        const photoEl = document.createElement('div');
        photoEl.className = 'gallery-item';
        photoEl.innerHTML = `
            <img src="${`../${zona.image}`}" alt="${zona.name}">
            <div class="gallery-item-caption">${zona.name}</div>
        `;
        elements.galleryGrid.appendChild(photoEl);
    }

    /**
     * Opens the gallery modal and displays saved photos.
     */
    function mostrarGaleria() {
        abrirModal('galleryModal');
    }

    /**
     * Opens the map modal.
     */
    function mostrarMapa() {
        abrirModal('mapModal');
    }

    /**
     * Opens the info modal with data from the current zone.
     */
    function mostrarInfo() {
        if (!currentZoneId) {
            ChichenItzaNotifications.error('Visita una zona para ver su información.');
            return;
        }
        const zona = window.ChichenItzaConfig?.zones?.[currentZoneId];
        if (!zona) return;
        
        elements.infoContent.innerHTML = `
            <h2>${zona.name}</h2>
            <p>${zona.description}</p>
            <hr>
            <div class="stat-row">
                <span class="stat-icon">⭐</span>
                <span class="stat-label">Puntos por visitar:</span>
                <span class="stat-value">${zona.points}</span>
            </div>
            <div class="stat-row">
                <span class="stat-icon">🎟️</span>
                <span class="stat-label">Nivel de Acceso:</span>
                <span class="stat-value">${zona.tier}</span>
            </div>
        `;
        abrirModal('infoModal');
    }

    /**
     * Opens the chat modal.
     */
    function abrirChat() {
        abrirModal('chatModal');
    }

    /**
     * Simulates sending a chat message.
     */
    function enviarMensajeChat() {
        const input = elements.chatInput;
        const message = input.value.trim();
        if (message === '') return;

        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `<p>${message}</p>`;
        elements.chatBody.appendChild(userMessage);

        input.value = '';
        elements.chatBody.scrollTop = elements.chatBody.scrollHeight; // Scroll to bottom

        // Simulate bot response
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            botMessage.innerHTML = `
                <span class="chat-avatar">🤖</span>
                <p>Gracias por tu mensaje. Un guía humano revisará tu consulta pronto.</p>
            `;
            elements.chatBody.appendChild(botMessage);
            elements.chatBody.scrollTop = elements.chatBody.scrollHeight;
        }, 1000);
    }

    /**
     * Opens the profile modal with user data.
     */
    function verPerfil() {
        const badges = {
            free: { icon: '🆓', text: 'FREE', class: 'free' },
            premium: { icon: '⭐', text: 'PREMIUM', class: 'premium' },
            vip: { icon: '💎', text: 'VIP', class: 'vip' }
        };
        const badge = badges[nivelUsuario] || badges.free;
        
        if (sesion.avatarImage) {
            elements.profileModalAvatar.innerHTML = `<img src="${sesion.avatarImage}" alt="Avatar">`;
        }
        elements.profileModalName.textContent = sesion.nombreAvatar || sesion.nombre;
        elements.profileModalEmail.textContent = sesion.email;
        elements.profileModalMembershipBadge.className = `membership-display ${badge.class}`;
        elements.profileModalMembershipLevel.innerHTML = `${badge.icon} ${badge.text}`;
        elements.profileModalZones.textContent = `${zonasVisitadasSet.size}/6`;
        elements.profileModalPoints.textContent = puntos;
        
        // Format join date
        const joinDate = new Date(sesion.fechaRegistro);
        elements.profileModalJoinDate.textContent = joinDate.toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        abrirModal('profileModal');
    }

    /**
     * Simulates requesting a guide.
     */
    function solicitarGuia() {
        if (nivelUsuario === 'free') {
            ChichenItzaNotifications.error('Esta función requiere membresía Premium o superior.');
            return;
        }
        ChichenItzaNotifications.info('👨‍🏫 Buscando un guía turístico disponible...');
    }

    /**
     * Logs out the user.
     */
    function cerrarSesion() {
        // Use custom confirm modal instead of browser default
        ChichenItzaNotifications.show('¿Estás seguro de que deseas cerrar sesión?', 'warning');
        // For a real app, this would be a custom modal, but for now, we'll use confirm
        if (confirm('¿Deseas cerrar sesión?')) {
            localStorage.removeItem('sesionActual');
            window.location.href = '../login.html';
        }
    }

    /**
     * Opens a modal by its ID.
     * @param {string} modalId - The ID of the modal element to open.
     */
    function abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    /**
     * Closes a modal by its ID.
     * @param {string} modalId - The ID of the modal element to close.
     */
    function cerrarModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function mostrarPlanes() {
        abrirModal('upgradeModal');
    }
    
    // --- STARTUP ---
    init();
});