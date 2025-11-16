// Main JavaScript file for Chichen Itzá Virtual Tours

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize statistics counter animation on home page
    if (document.getElementById('visitors')) {
        animateStats();
    }
    
    // Mobile menu toggle (if needed)
    setupMobileMenu();
    
    // Initialize any tooltips or popovers
    initializeTooltips();
});

// Animate statistics counters
function animateStats() {
    const stats = [
        { id: 'visitors', target: 248, suffix: '' },
        { id: 'tours', target: 15, suffix: '' },
        { id: 'guides', target: 12, suffix: '' },
        { id: 'servers', target: 6, suffix: '' }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            animateCounter(element, 0, stat.target, 2000, stat.suffix);
        }
    });
}

// Counter animation function
function animateCounter(element, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Mobile menu setup
function setupMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // Create mobile menu button if screen is small
    if (window.innerWidth <= 768) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '☰';
        menuBtn.style.cssText = 'background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; display: none;';
        
        const navbar = document.querySelector('.navbar .container');
        navbar.appendChild(menuBtn);
        
        menuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-active');
        });
    }
}

// Initialize tooltips
function initializeTooltips() {
    // Add tooltip functionality if needed
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = event.target.dataset.tooltip;
    tooltip.style.cssText = `
        position: absolute;
        background: #1a202c;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
    `;
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Form validation helpers
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefono(telefono) {
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(telefono);
}

// Local storage helpers
function guardarDatos(clave, datos) {
    try {
        localStorage.setItem(clave, JSON.stringify(datos));
        return true;
    } catch (e) {
        console.error('Error al guardar datos:', e);
        return false;
    }
}

function obtenerDatos(clave) {
    try {
        const datos = localStorage.getItem(clave);
        return datos ? JSON.parse(datos) : null;
    } catch (e) {
        console.error('Error al obtener datos:', e);
        return null;
    }
}

function eliminarDatos(clave) {
    try {
        localStorage.removeItem(clave);
        return true;
    } catch (e) {
        console.error('Error al eliminar datos:', e);
        return false;
    }
}

// Sistema de notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${tipo === 'success' ? '#48bb78' : tipo === 'error' ? '#f56565' : '#667eea'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .mobile-active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        padding: 1rem;
        border-radius: 0 0 8px 8px;
    }
`;
document.head.appendChild(style);

// Simulación de conexión con servidor
class ServidorVirtual {
    constructor() {
        this.conectado = false;
        this.latencia = 0;
        this.usuarios = 0;
    }
    
    conectar(servidorId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.conectado = true;
                this.latencia = Math.floor(Math.random() * 100) + 20;
                this.usuarios = Math.floor(Math.random() * 50) + 10;
                
                console.log(`Conectado al servidor ${servidorId}`);
                console.log(`Latencia: ${this.latencia}ms`);
                console.log(`Usuarios: ${this.usuarios}`);
                
                resolve({
                    conectado: true,
                    latencia: this.latencia,
                    usuarios: this.usuarios
                });
            }, 1000);
        });
    }
    
    desconectar() {
        this.conectado = false;
        console.log('Desconectado del servidor');
    }
    
    obtenerEstado() {
        return {
            conectado: this.conectado,
            latencia: this.latencia,
            usuarios: this.usuarios
        };
    }
}

// Instancia global del servidor
const servidorVirtual = new ServidorVirtual();

// Sistema de avatares
class Avatar {
    constructor(nombre, rol, apariencia) {
        this.nombre = nombre;
        this.rol = rol;
        this.apariencia = apariencia;
        this.reputacion = 0;
        this.zonasVisitadas = [];
        this.tiempoTotal = 0;
    }
    
    visitarZona(zona) {
        if (!this.zonasVisitadas.includes(zona)) {
            this.zonasVisitadas.push(zona);
            this.reputacion += 50;
        }
    }
    
    aumentarReputacion(puntos) {
        this.reputacion += puntos;
        if (this.reputacion > 1000) {
            this.reputacion = 1000;
        }
    }
    
    obtenerDatos() {
        return {
            nombre: this.nombre,
            rol: this.rol,
            apariencia: this.apariencia,
            reputacion: this.reputacion,
            zonasVisitadas: this.zonasVisitadas,
            tiempoTotal: this.tiempoTotal
        };
    }
}

// Gestión de tours
class GestorTours {
    constructor() {
        this.toursActivos = [];
        this.participantes = [];
    }
    
    crearTour(tipo, zonas, duracion) {
        const tour = {
            id: Date.now(),
            tipo: tipo,
            zonas: zonas,
            duracion: duracion,
            participantes: [],
            estado: 'activo',
            inicio: new Date()
        };
        
        this.toursActivos.push(tour);
        return tour;
    }
    
    agregarParticipante(tourId, participante) {
        const tour = this.toursActivos.find(t => t.id === tourId);
        if (tour) {
            tour.participantes.push(participante);
            this.participantes.push(participante);
        }
    }
    
    obtenerToursActivos() {
        return this.toursActivos.filter(t => t.estado === 'activo');
    }
    
    finalizarTour(tourId) {
        const tour = this.toursActivos.find(t => t.id === tourId);
        if (tour) {
            tour.estado = 'finalizado';
            tour.fin = new Date();
        }
    }
}

// Instancia global del gestor de tours
const gestorTours = new GestorTours();

// Sistema de eventos
class EventBus {
    constructor() {
        this.eventos = {};
    }
    
    on(evento, callback) {
        if (!this.eventos[evento]) {
            this.eventos[evento] = [];
        }
        this.eventos[evento].push(callback);
    }
    
    emit(evento, datos) {
        if (this.eventos[evento]) {
            this.eventos[evento].forEach(callback => callback(datos));
        }
    }
    
    off(evento, callback) {
        if (this.eventos[evento]) {
            this.eventos[evento] = this.eventos[evento].filter(cb => cb !== callback);
        }
    }
}

// Instancia global del bus de eventos
const eventBus = new EventBus();

// Escuchar eventos de conexión
eventBus.on('servidor:conectado', (datos) => {
    console.log('Evento: Servidor conectado', datos);
    mostrarNotificacion('Conectado al servidor exitosamente', 'success');
});

eventBus.on('zona:cambiada', (datos) => {
    console.log('Evento: Zona cambiada', datos);
});

eventBus.on('participante:unido', (datos) => {
    console.log('Evento: Participante unido', datos);
});

// Utilidades de fecha y hora
function formatearFecha(fecha) {
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(fecha).toLocaleDateString('es-MX', opciones);
}

function calcularTiempoTranscurrido(fechaInicio) {
    const ahora = new Date();
    const inicio = new Date(fechaInicio);
    const diferencia = ahora - inicio;
    
    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return `Hace ${segundos} segundo${segundos !== 1 ? 's' : ''}`;
}

// Sistema de logging para desarrollo
const logger = {
    info: (mensaje, ...args) => {
        console.log(`[INFO] ${mensaje}`, ...args);
    },
    warn: (mensaje, ...args) => {
        console.warn(`[WARN] ${mensaje}`, ...args);
    },
    error: (mensaje, ...args) => {
        console.error(`[ERROR] ${mensaje}`, ...args);
    },
    debug: (mensaje, ...args) => {
        if (localStorage.getItem('debug') === 'true') {
            console.debug(`[DEBUG] ${mensaje}`, ...args);
        }
    }
};

// Exportar funciones y clases principales para uso global
window.ChichenItzaVirtual = {
    ServidorVirtual,
    Avatar,
    GestorTours,
    EventBus,
    servidorVirtual,
    gestorTours,
    eventBus,
    logger,
    guardarDatos,
    obtenerDatos,
    eliminarDatos,
    mostrarNotificacion,
    validarEmail,
    validarTelefono,
    formatearFecha,
    calcularTiempoTranscurrido
};

// Log de inicialización
logger.info('Sistema Chichen Itzá Virtual Tours inicializado correctamente');

// Detectar cambios en el almacenamiento local
window.addEventListener('storage', function(e) {
    if (e.key === 'participanteActual') {
        logger.info('Datos de participante actualizados', e.newValue);
    }
});

// Manejo de errores global
window.addEventListener('error', function(e) {
    logger.error('Error no capturado:', e.error);
});

// Cleanup al cerrar la página
window.addEventListener('beforeunload', function() {
    if (servidorVirtual.conectado) {
        servidorVirtual.desconectar();
    }
});