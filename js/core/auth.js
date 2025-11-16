/**
 * CHICHEN ITZA VIRTUAL TOURS - Authentication Module
 * Handles user authentication and session management
 */

const Auth = {
    /**
     * Get current session
     * @returns {Object|null} Current session data or null
     */
    getSession() {
        try {
            const sessionData = localStorage.getItem(window.ChichenItzaConfig.storage.session);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    },

    /**
     * Set session data
     * @param {Object} sessionData - Session data to store
     * @returns {boolean} Success status
     */
    setSession(sessionData) {
        try {
            localStorage.setItem(
                window.ChichenItzaConfig.storage.session,
                JSON.stringify(sessionData)
            );
            return true;
        } catch (error) {
            console.error('Error setting session:', error);
            return false;
        }
    },

    /**
     * Clear current session
     * @returns {boolean} Success status
     */
    clearSession() {
        try {
            localStorage.removeItem(window.ChichenItzaConfig.storage.session);
            return true;
        } catch (error) {
            console.error('Error clearing session:', error);
            return false;
        }
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        const session = this.getSession();
        return session !== null && session.email;
    },

    /**
     * Check if user has specific role
     * @param {string} role - Role to check
     * @returns {boolean} Role check result
     */
    hasRole(role) {
        const session = this.getSession();
        return session && session.tipo === role;
    },

    /**
     * Check if user has specific membership level
     * @param {string} level - Membership level to check
     * @returns {boolean} Membership check result
     */
    hasMembership(level) {
        const session = this.getSession();
        if (!session) return false;

        const levels = ['free', 'premium', 'vip'];
        const userLevel = levels.indexOf(session.nivel || 'free');
        const requiredLevel = levels.indexOf(level);

        return userLevel >= requiredLevel;
    },

    /**
     * Login tourist user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object} Login result with success status and session data
     */
    loginTurista(email, password) {
        // TODO: to be modifed with real store system later
        const storedUser = localStorage.getItem(window.ChichenItzaConfig.storage.user);

        if (storedUser) {
            const userData = JSON.parse(storedUser);

            if (userData.email === email && userData.password === password) {
                const session = {
                    tipo: 'turista',
                    email: userData.email,
                    nombre: userData.nombre,
                    nombreAvatar: userData.nombreAvatar,
                    nivel: userData.membresia || 'free',
                    avatarImage: userData.avatarImage,
                    fechaRegistro: userData.fechaRegistro,
                    loginTime: new Date().toISOString()
                };

                this.setSession(session);

                return {
                    success: true,
                    session: session,
                    message: 'Inicio de sesión exitoso'
                };
            }
        }

        return {
            success: false,
            message: 'Credenciales inválidas'
        };
    },

    /**
     * Login admin user
     * @param {string} usuario - Admin username
     * @param {string} password - Admin password
     * @returns {Object} Login result
     */
    loginAdmin(usuario, password) {
        const demo = window.ChichenItzaConfig.demo.admin;

        if (usuario === demo.usuario && password === demo.password) {
            const session = {
                tipo: 'admin',
                usuario: usuario,
                nombre: 'Administrador',
                permisos: ['usuarios', 'zonas', 'eventos', 'estadisticas', 'configuracion'],
                loginTime: new Date().toISOString()
            };

            this.setSession(session);

            return {
                success: true,
                session: session,
                message: 'Acceso autorizado'
            };
        }

        return {
            success: false,
            message: 'Credenciales inválidas. Acceso denegado.'
        };
    },

    /**
     * Register new tourist user
     * @param {Object} userData - User registration data
     * @returns {Object} Registration result
     */
    registerTurista(userData) {
        try {
            // Add metadata
            userData.fechaRegistro = new Date().toISOString();
            userData.tipo = 'turista';

            // Save user data
            localStorage.setItem(
                window.ChichenItzaConfig.storage.user,
                JSON.stringify(userData)
            );

            // Create session
            const session = {
                tipo: 'turista',
                email: userData.email,
                nombre: userData.nombre,
                nombreAvatar: userData.nombreAvatar,
                nivel: userData.membresia || 'free',
                avatarImage: userData.avatarImage,
                fechaRegistro: userData.fechaRegistro,
                loginTime: new Date().toISOString()
            };

            this.setSession(session);

            return {
                success: true,
                session: session,
                message: '¡Registro exitoso! Bienvenido a Chichen Itzá Virtual Tours'
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Error al registrar usuario'
            };
        }
    },

    /**
     * Logout current user
     * @returns {boolean} Logout success status
     */
    logout() {
        return this.clearSession();
    },

    /**
     * Redirect based on user role
     */
    redirectByRole() {
        const session = this.getSession();

        if (!session) {
            window.location.href = '/login.html';
            return;
        }

        switch (session.tipo) {
            case 'turista':
                window.location.href = '/Tourist/tour-turista.html';
                break;
            case 'admin':
                window.location.href = '/Admin/dashboard-admin.html';
                break;
            default:
                window.location.href = '/login.html';
        }
    },

    /**
     * Protect page - redirect if not authenticated
     * @param {string} requiredRole - Required role for page access
     */
    protectPage(requiredRole = null) {
        const session = this.getSession();

        if (!session) {
            window.location.href = '/login.html';
            return false;
        }

        if (requiredRole && session.tipo !== requiredRole) {
            window.location.href = '/login.html';
            return false;
        }

        return true;
    }
};

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}

// Make available globally
window.ChichenItzaAuth = Auth;
