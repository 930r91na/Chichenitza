Chichen Itzá Virtual Tours

Overview

This project is a modular web application for a virtual tourism experience of Chichén Itzá. It features separate interfaces for tourists and administrators, a multi-tiered membership system, and a dynamic admin panel for managing site content.

Key Features

1. Tourist Interface

Tour Page (Tourist/tour-turista.html): A 3-column interface where tourists explore.

Dynamic Zone Loading: The main viewport dynamically loads zone images and descriptions (e.g., "Pyramid of Kukulcán," "Sacred Cenote") from the central configuration file (js/core/config.js).

Membership Access Control: Zones and events are visually unlocked or locked (.locked, .accessible) based on the user's membership tier (free, premium, vip).

User Stats: Tracks and displays visited zones and points earned.

2. Admin Panel (Admin/dashboard-admin.html)

The admin panel is built using a modular "App Shell" architecture.

App Shell Architecture: The Admin/dashboard-admin.html file acts as the main shell or template. It only contains the layout (sidebar, header) and an empty content container.

Dynamic Section Loading: The content for each admin section is loaded dynamically using fetch() from HTML "partial" files located in the Admin/sections/ folder.

Dashboard (sections/dashboard.html): Displays high-level stats like total tourists, active guides, scheduled events, and recent activity.

Tourist Management (sections/tourists.html): Shows a table of all registered users, their membership tier, and registration date.

Guide Management (sections/guides.html): A grid displaying tour guide profiles, their status (online, on-tour), and stats. Allows adding new guides via a modal.

Event Management (sections/events.html): A list of upcoming events, their time, access level (Free, Premium, VIP), and attendee count. Allows creating new events.

Zone Management (sections/zones.html): The core of the tourist experience. Allows admins to create, edit, and delete explorable zones, setting their name, description, access tier, reward points, and image path.

Configuration (sections/configuration.html): A form for global site settings, such as placing the app in maintenance mode or disabling new registrations.

3. Authentication & Registration

Full User Flow:

login.html: A login page with separate tabs for "Tourist" and "Administrator."

Tourist/registro-turista.html: A multi-step registration form for new tourists.

Auth Module (js/core/auth.js):

A centralized module handling login, logout, registration, and session management using localStorage.

Provides helper functions like isAuthenticated() and hasMembership() for use anywhere in the app.

How to Run This Project

⚠️ Important!

DO NOT OPEN THE index.html OR admin/dashboard-admin.html FILES DIRECTLY IN YOUR BROWSER.

This project will not work if you open it from a file:///... URL.

Reason: The modular admin panel uses fetch() to load its sections. Modern browsers block these requests on local files for security reasons (CORS Policy). This is why you see a permanent "Cargando..." message.

Solution: Use a Local Server

You must serve the files using an http:// protocol. The easiest way is with the Live Server extension in VS Code.

In VS Code, go to the Extensions tab.

Search for and install "Live Server" (by Ritwick Dey).

In your file explorer, right-click on login.html or index.html.

Select "Open with Live Server".

This will open your project at a URL like http://127.0.0.1:5500/ and everything, including the admin section loading, will work correctly.