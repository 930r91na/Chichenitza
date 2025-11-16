/**
 * CHICHEN ITZA VIRTUAL TOURS - Configuration
 * Central configuration for the application
 */

const Config = {
    // Application Info
    app: {
        name: 'Chichen Itzá Virtual Tours',
        version: '1.0.0',
        description: 'Virtual tours experience platform'
    },

    // API Endpoints (for future integration)
    api: {
        baseUrl: '/api/v1',
        endpoints: {
            auth: '/auth',
            users: '/users',
            tours: '/tours',
            zones: '/zones',
            servers: '/servers',
            events: '/events'
        }
    },

    // Storage Keys
    storage: {
        session: 'sesionActual',
        user: 'usuarioRegistrado',
        settings: 'userSettings',
        cache: 'appCache'
    },

    // Zone Configuration
    zones: {
        kukulkan: {
            id: 'kukulkan',
            name: 'Pirámide de Kukulcán',
            description: 'El Castillo, la estructura más icónica de Chichen Itzá. Durante los equinoccios, el sol crea la ilusión de una serpiente descendiendo por la escalinata.',
            tier: 'free',
            points: 100,
            capacity: 50,
            image: 'images/kukulcan.jpeg'
        },
        pelota: {
            id: 'pelota',
            name: 'Gran Juego de Pelota',
            description: 'La cancha de juego de pelota más grande de Mesoamérica, con 168 metros de longitud y una acústica excepcional.',
            tier: 'free',
            points: 100,
            capacity: 60,
            image: 'images/juego-pelota2.jpg'
        },
        guerreros: {
            id: 'guerreros',
            name: 'Templo de los Guerreros',
            description: 'Impresionante complejo con más de 200 columnas talladas representando guerreros mayas.',
            tier: 'premium',
            points: 150,
            capacity: 40,
            image: 'images/templo-guerreros.jpg'
        },
        caracol: {
            id: 'caracol',
            name: 'El Caracol (Observatorio)',
            description: 'Torre circular utilizada como observatorio astronómico para seguir el movimiento de Venus.',
            tier: 'premium',
            points: 150,
            capacity: 30,
            image: 'images/cenote.jpg'
        },
        monjas: {
            id: 'monjas',
            name: 'Las Monjas',
            description: 'Complejo de edificios con elaborada decoración en estilo arquitectónico Puuc.',
            tier: 'premium',
            points: 150,
            capacity: 35,
            image: 'images/cenote2.jpg'
        },
        cenote: {
            id: 'cenote',
            name: 'Cenote Sagrado',
            description: 'Pozo natural sagrado de 60 metros de diámetro utilizado para ceremonias religiosas.',
            tier: 'vip',
            points: 200,
            capacity: 20,
            image: 'images/cenote-sagrado.jpg'
        }
    },

    // Membership Tiers
    membership: {
        free: {
            name: 'Free',
            price: 0,
            zones: ['kukulkan', 'pelota'],
            features: ['Acceso a 2 zonas básicas', 'Tours de 30 minutos', 'Información básica', 'Comunidad de usuarios'],
            icon: '🆓',
            color: '#8A8A8A'
        },
        premium: {
            name: 'Premium',
            price: 299,
            zones: ['kukulkan', 'pelota', 'guerreros', 'caracol', 'monjas'],
            features: ['Acceso a 6 zonas completas', 'Tours ilimitados', 'Guías turísticos incluidos', 'Chat con guías', 'Eventos mensuales', 'Sin anuncios'],
            icon: '⭐',
            color: '#C9A961'
        },
        vip: {
            name: 'VIP',
            price: 599,
            zones: ['kukulkan', 'pelota', 'guerreros', 'caracol', 'monjas', 'cenote'],
            features: ['Todas las zonas + VIP', 'Tours privados exclusivos', 'Eventos VIP semanales', 'Sesiones con arqueólogos', 'Certificado', 'Contenido 4K', 'Soporte 24/7'],
            icon: '💎',
            color: '#8B5CF6'
        }
    },

    // Server Configuration
    servers: [
        { id: 'MX-1', name: 'Mérida', location: 'Mexico', region: 'Americas' },
        { id: 'MX-2', name: 'Cancún', location: 'Mexico', region: 'Americas' },
        { id: 'US-1', name: 'Dallas', location: 'USA', region: 'Americas' },
        { id: 'US-2', name: 'Miami', location: 'USA', region: 'Americas' },
        { id: 'EU-1', name: 'Madrid', location: 'Spain', region: 'Europe' },
        { id: 'SA-1', name: 'Buenos Aires', location: 'Argentina', region: 'Americas' }
    ],

    // Avatar Styles
    avatarStyles: {
        explorador: { icon: '🧑‍🚀', name: 'Explorador' },
        aventurero: { icon: '🏃', name: 'Aventurero' },
        fotografo: { icon: '📸', name: 'Fotógrafo' },
        historiador: { icon: '📚', name: 'Historiador' }
    },

    // Roles
    roles: {
        turista: { name: 'Turista', icon: '🤓' },
        guia: { name: 'Guía Turístico', icon: '👨‍🏫' },
        investigador: { name: 'Investigador', icon: '👨‍🔬' },
        admin: { name: 'Administrador', icon: '👤' }
    },

    // Demo Credentials
    demo: {
        admin: {
            usuario: 'admin.demo',
            password: 'Demo2025!',
        }
    },

    // UI Settings
    ui: {
        notification: {
            duration: 3000, // milliseconds
            position: 'top-right'
        },
        animation: {
            duration: 300 // milliseconds
        }
    }
};

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}

// Make available globally
window.ChichenItzaConfig = Config;
