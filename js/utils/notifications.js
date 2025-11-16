/**
 * CHICHEN ITZA VIRTUAL TOURS - Notifications Module
 * Handles toast notifications and alerts
 */

const Notifications = {
    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type of notification (success, error, info, warning)
     * @param {number} duration - Duration in milliseconds (default from config)
     */
    show(message, type = 'info', duration = null) {
        const config = window.ChichenItzaConfig.ui.notification;
        const displayDuration = duration || config.duration;

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notificacion notificacion-${type}`;
        notification.textContent = message;

        // Add icon based on type
        const icon = this.getIcon(type);
        notification.innerHTML = `<span>${icon}</span><span>${message}</span>`;

        // Add to document
        document.body.appendChild(notification);

        // Remove after duration
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, displayDuration);
    },

    /**
     * Get icon for notification type
     * @param {string} type - Notification type
     * @returns {string} Icon emoji
     */
    getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    },

    /**
     * Show success notification
     * @param {string} message - Success message
     */
    success(message) {
        this.show(message, 'success');
    },

    /**
     * Show error notification
     * @param {string} message - Error message
     */
    error(message) {
        this.show(message, 'error');
    },

    /**
     * Show warning notification
     * @param {string} message - Warning message
     */
    warning(message) {
        this.show(message, 'warning');
    },

    /**
     * Show info notification
     * @param {string} message - Info message
     */
    info(message) {
        this.show(message, 'info');
    },

    /**
     * Show confirmation dialog
     * @param {string} message - Confirmation message
     * @param {Function} onConfirm - Callback function on confirmation
     * @param {Function} onCancel - Callback function on cancellation
     */
    confirm(message, onConfirm, onCancel = null) {
        if (confirm(message)) {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
        } else {
            if (typeof onCancel === 'function') {
                onCancel();
            }
        }
    },

    /**
     * Show alert dialog
     * @param {string} message - Alert message
     * @param {string} title - Alert title (optional)
     */
    alert(message, title = null) {
        if (title) {
            alert(`${title}\n\n${message}`);
        } else {
            alert(message);
        }
    }
};

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Notifications;
}

// Make available globally (also maintain backward compatibility)
window.ChichenItzaNotifications = Notifications;
window.mostrarNotificacion = function(mensaje, tipo = 'info') {
    Notifications.show(mensaje, tipo);
};
