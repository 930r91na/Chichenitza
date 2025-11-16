# Chichen Itzá Virtual Tours

A modular web application for virtual tours of Chichen Itzá archaeological site.

## Project Structure

### CSS (Modular Architecture)

```
styles/
├── main.css               # Main CSS entry point (imports all modules)
├── variables.css          # Theme variables and colors (Chichen Itzá theme)
├── base.css              # Reset and base styles
├── layout.css            # Layout components (navbar, footer, hero)
├── components/           # Reusable UI components
│   ├── buttons.css
│   ├── forms.css
│   ├── cards.css
│   └── modals.css
└── pages/               # Page-specific styles
    ├── login.css
    ├── register.css
    ├── tour.css
    ├── dashboard.css
    └── admin.css
```

### JavaScript (Modular Architecture)

```
js/
├── main.js              # Main application entry point
├── core/               # Core functionality
│   ├── config.js       # Configuration and constants
│   └── auth.js         # Authentication and session management
├── utils/              # Utility functions
│   ├── notifications.js # Toast notifications
│   └── validators.js    # Form validation
├── components/         # Component-specific logic
│   ├── avatar.js
│   ├── server.js
│   └── tour.js
└── pages/             # Page-specific logic
    ├── login.js
    ├── register.js
    ├── tour-turista.js
    └── dashboard-admin.js
```

## Theme

### Color Palette (Inspired by Mayan Architecture)

- **Primary Stone**: `#8B7355` - Inspired by Mayan limestone
- **Primary Sky**: `#4A7C9E` - Inspired by tropical sky
- **Primary Gold**: `#C9A961` - Inspired by Mayan gold artifacts
- **Primary Jade**: `#5F9B6D` - Inspired by sacred jade
- **Secondary Sand**: `#D4C4A8` - Desert sand tones
- **Secondary Terracotta**: `#B8624F` - Clay pottery colors
- **Secondary Obsidian**: `#2C2C2C` - Volcanic obsidian
- **Secondary Limestone**: `#E8E0D5` - Light stone

### Membership Colors

- **Free**: `#8A8A8A` - Basic gray
- **Premium**: `#C9A961` - Gold
- **VIP**: `#8B5CF6` - Purple

## Features

### Multi-tier Membership System

- **Free**: Access to 2 basic zones (Pirámide de Kukulcán, Juego de Pelota)
- **Premium**: Access to 5 zones + guided tours
- **VIP**: All 6 zones + exclusive content and events

### Virtual Zones

1. **Pirámide de Kukulcán** (Free)
2. **Gran Juego de Pelota** (Free)
3. **Templo de los Guerreros** (Premium)
4. **El Caracol** (Premium)
5. **Las Monjas** (Premium)
6. **Cenote Sagrado** (VIP)

### User Roles

- **Turista**: Regular visitor
- **Guía Turístico**: Tour guide
- **Investigador**: Researcher
- **Administrador**: System administrator

## Usage

### HTML Pages

Each HTML page should import only the CSS and JS it needs:

```html
<!-- Core Styles (Required) -->
<link rel="stylesheet" href="styles/main.css">

<!-- Page-specific Styles -->
<link rel="stylesheet" href="styles/pages/login.css">

<!-- Core JavaScript (Required) -->
<script src="js/core/config.js"></script>
<script src="js/core/auth.js"></script>
<script src="js/utils/notifications.js"></script>
<script src="js/utils/validators.js"></script>

<!-- Main App Entry -->
<script src="js/main.js"></script>

<!-- Page-specific JavaScript -->
<script src="js/pages/login.js"></script>
```

### Using the Authentication Module

```javascript
// Check if user is authenticated
if (ChichenItzaAuth.isAuthenticated()) {
    console.log('User is logged in');
}

// Login tourist
const result = ChichenItzaAuth.loginTurista('email@example.com', 'password');
if (result.success) {
    console.log('Login successful');
}

// Check membership level
if (ChichenItzaAuth.hasMembership('premium')) {
    // User has premium or higher
}

// Protect page
ChichenItzaAuth.protectPage('turista'); // Redirects if not tourist
```

### Using Notifications

```javascript
// Show success notification
ChichenItzaNotifications.success('Operation successful!');

// Show error notification
ChichenItzaNotifications.error('Something went wrong');

// Backward compatibility
mostrarNotificacion('Message', 'success');
```

### Using Validators

```javascript
// Validate email
if (ChichenItzaValidators.validateEmail('test@example.com')) {
    console.log('Valid email');
}

// Validate password
const result = ChichenItzaValidators.validatePassword('MyPassword123');
console.log(result.valid); // true/false
console.log(result.message); // Validation message

// Validate form
const validation = ChichenItzaValidators.validateForm(formData, {
    email: { required: true, email: true },
    password: { required: true, password: true },
    username: { required: true, username: true }
});

if (validation.valid) {
    // Form is valid
} else {
    // Show errors
    console.log(validation.errors);
}

// Backward compatibility
if (validarEmail('test@example.com')) {
    // Valid email
}
```

### Configuration Access

```javascript
// Access zone configuration
const zones = ChichenItzaConfig.zones;
const kukulkan = zones.kukulkan;

// Access membership tiers
const tiers = ChichenItzaConfig.membership;
const premium = tiers.premium;

// Access servers
const servers = ChichenItzaConfig.servers;
```

## Image Integration

Images should be placed in the `images/` directory:

```
images/
├── chichenitza.jpeg    # Login background
├── kukulkan.jpg        # Pirámide de Kukulcán
├── pelota.jpg          # Juego de Pelota
├── guerreros.jpg       # Templo de los Guerreros
├── caracol.jpg         # El Caracol
├── monjas.jpg          # Las Monjas
├── cenote.jpg          # Cenote Sagrado
├── stone-texture.jpg   # Stone texture pattern
└── mayan-pattern.png   # Mayan decorative pattern
```

### Using Background Images with Overlays

```css
.hero {
    background-image: url('../images/kukulkan.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-overlay); /* rgba(0, 0, 0, 0.5) */
}

.hero-content {
    position: relative;
    z-index: 1;
}
```

## Development Guidelines

### Adding New Components

1. Create component CSS in `styles/components/[name].css`
2. Import in `styles/main.css`
3. Create component JS in `js/components/[name].js`
4. Import in HTML pages that use the component

### Adding New Pages

1. Create HTML file
2. Create page-specific CSS in `styles/pages/[name].css`
3. Create page-specific JS in `js/pages/[name].js`
4. Import core modules + page-specific modules

### Theme Customization

Edit `styles/variables.css` to change colors, spacing, fonts, etc.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Academic Project - UDLAP Sistemas Distribuidos 2025
