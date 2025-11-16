/**
 * CHICHEN ITZA VIRTUAL TOURS - Main Application Entry
 * Initializes the application and provides backward compatibility
 */

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize statistics counter animation on home page
    if (document.getElementById('visitors')) {
        animateStats();
    }

    // Mobile menu toggle
    setupMobileMenu();

    // Initialize tooltips
    initializeTooltips();

    // Setup smooth scroll for anchor links
    setupSmoothScroll();

    // Log initialization
    console.log('Chichen Itzá Virtual Tours initialized');
});

/**
 * Animate statistics counters
 */
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

/**
 * Counter animation function
 */
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

/**
 * Setup mobile menu
 */
function setupMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // Create mobile menu button if screen is small
    if (window.innerWidth <= 768) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '☰';
        menuBtn.style.cssText = 'background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;';

        const navbar = document.querySelector('.navbar .container');
        if (navbar && !navbar.querySelector('.mobile-menu-btn')) {
            navbar.appendChild(menuBtn);

            menuBtn.addEventListener('click', function() {
                navMenu.classList.toggle('mobile-active');
            });
        }
    }
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
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
        background: var(--secondary-obsidian);
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

/**
 * Setup smooth scroll for anchor links
 */
function setupSmoothScroll() {
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
}

/**
 * Format date
 */
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

/**
 * Calculate elapsed time
 */
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

// Export utilities globally for backward compatibility
window.formatearFecha = formatearFecha;
window.calcularTiempoTranscurrido = calcularTiempoTranscurrido;

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    // Cleanup tasks
    console.log('Cleaning up...');
});

// Log application version
console.log(` Chichen Itzá Virtual Tours v${window.ChichenItzaConfig?.app?.version || '1.0.0'}`);
