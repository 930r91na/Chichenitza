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

4. Backend & Database

Node.js & Express: The application is powered by a Node.js server (`server.js`) using Express. It handles API requests for login, registration, and data retrieval (zones, events, guides).

SQLite Database: Data is persisted in a local SQLite database (`vrtourist.db`).

- **Users**: Stores tourist and admin accounts with role-based access.
- **Zones**: Manages tour locations, access levels, and points.
- **Events & Guides**: Stores schedule and personnel data.

How to Run This Project

Prerequisites:

- Node.js installed on your machine.

Steps:

1. Install Dependencies:
   Open a terminal in the project root and run:

   ```bash
   npm install
   ```

2. Start the Server:
   Run the following command to start the backend server:

   ```bash
   node server.js
   ```

   (Or `npm start`)

3. Access the Application:
   Open your browser and navigate to:
   http://localhost:3000

   The server will automatically create and seed the SQLite database (`vrtourist.db`) if it doesn't exist.
