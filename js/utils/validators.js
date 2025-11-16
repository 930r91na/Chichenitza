/**
 * CHICHEN ITZA VIRTUAL TOURS - Validators Module
 * Form validation utilities
 */

const Validators = {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Validation result
     */
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Validate phone number format
     * @param {string} phone - Phone number to validate
     * @returns {boolean} Validation result
     */
    validatePhone(phone) {
        const regex = /^[\d\s\-\+\(\)]+$/;
        return regex.test(phone);
    },

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result with strength level and requirements
     */
    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const strength = {
            length: password.length >= minLength,
            uppercase: hasUpperCase,
            lowercase: hasLowerCase,
            numbers: hasNumbers,
            special: hasSpecialChar
        };

        const passed = strength.length && strength.uppercase && strength.lowercase && strength.numbers;

        let level = 'weak';
        const passedCount = Object.values(strength).filter(Boolean).length;

        if (passedCount >= 5) level = 'strong';
        else if (passedCount >= 3) level = 'medium';

        return {
            valid: passed,
            strength: level,
            requirements: strength,
            message: this.getPasswordMessage(strength)
        };
    },

    /**
     * Get password validation message
     * @param {Object} requirements - Password requirements object
     * @returns {string} Validation message
     */
    getPasswordMessage(requirements) {
        const missing = [];
        if (!requirements.length) missing.push('al menos 8 caracteres');
        if (!requirements.uppercase) missing.push('una mayúscula');
        if (!requirements.lowercase) missing.push('una minúscula');
        if (!requirements.numbers) missing.push('un número');

        if (missing.length === 0) {
            return 'Contraseña válida';
        }

        return `La contraseña debe contener ${missing.join(', ')}`;
    },

    /**
     * Validate required field
     * @param {*} value - Value to validate
     * @returns {boolean} Validation result
     */
    validateRequired(value) {
        if (typeof value === 'string') {
            return value.trim().length > 0;
        }
        return value !== null && value !== undefined;
    },

    /**
     * Validate username format
     * @param {string} username - Username to validate
     * @returns {boolean} Validation result
     */
    validateUsername(username) {
        const regex = /^[A-Za-z0-9_]{3,20}$/;
        return regex.test(username);
    },

    /**
     * Validate form data
     * @param {Object} formData - Form data to validate
     * @param {Object} rules - Validation rules
     * @returns {Object} Validation result with errors
     */
    validateForm(formData, rules) {
        const errors = {};

        for (const [field, value] of Object.entries(formData)) {
            const fieldRules = rules[field];

            if (!fieldRules) continue;

            // Required validation
            if (fieldRules.required && !this.validateRequired(value)) {
                errors[field] = 'Este campo es obligatorio';
                continue;
            }

            // Skip other validations if field is empty and not required
            if (!this.validateRequired(value)) continue;

            // Email validation
            if (fieldRules.email && !this.validateEmail(value)) {
                errors[field] = 'Email inválido';
                continue;
            }

            // Phone validation
            if (fieldRules.phone && !this.validatePhone(value)) {
                errors[field] = 'Teléfono inválido';
                continue;
            }

            // Password validation
            if (fieldRules.password) {
                const passwordValidation = this.validatePassword(value);
                if (!passwordValidation.valid) {
                    errors[field] = passwordValidation.message;
                    continue;
                }
            }

            // Username validation
            if (fieldRules.username && !this.validateUsername(value)) {
                errors[field] = 'Usuario inválido (3-20 caracteres, solo letras, números y guión bajo)';
                continue;
            }

            // Min length validation
            if (fieldRules.minLength && value.length < fieldRules.minLength) {
                errors[field] = `Mínimo ${fieldRules.minLength} caracteres`;
                continue;
            }

            // Max length validation
            if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
                errors[field] = `Máximo ${fieldRules.maxLength} caracteres`;
                continue;
            }

            // Custom validation
            if (fieldRules.custom && typeof fieldRules.custom === 'function') {
                const customResult = fieldRules.custom(value);
                if (customResult !== true) {
                    errors[field] = customResult;
                }
            }
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors: errors
        };
    },

    /**
     * Match two fields (e.g., password confirmation)
     * @param {string} value1 - First value
     * @param {string} value2 - Second value
     * @returns {boolean} Match result
     */
    matchFields(value1, value2) {
        return value1 === value2;
    },

    /**
     * Validate file upload
     * @param {File} file - File to validate
     * @param {Object} options - Validation options (maxSize, allowedTypes)
     * @returns {Object} Validation result
     */
    validateFile(file, options = {}) {
        const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
        const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

        if (!file) {
            return {
                valid: false,
                message: 'No se seleccionó ningún archivo'
            };
        }

        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                message: `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`
            };
        }

        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024);
            return {
                valid: false,
                message: `El archivo es demasiado grande. Máximo: ${maxSizeMB}MB`
            };
        }

        return {
            valid: true,
            message: 'Archivo válido'
        };
    }
};

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validators;
}

// Make available globally (also maintain backward compatibility)
window.ChichenItzaValidators = Validators;
window.validarEmail = function(email) {
    return Validators.validateEmail(email);
};
window.validarTelefono = function(telefono) {
    return Validators.validatePhone(telefono);
};
