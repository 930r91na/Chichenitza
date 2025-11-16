Development Guide & Modularity Best Practices

This document explains the project's modular architecture and the rules you must follow to add new code. Following these rules will keep the code clean, secure, and easy to maintain.

1. The Philosophy: "Shell & Partials"

The admin panel (Admin/dashboard-admin.html) uses an "App Shell" model.

The "Shell": dashboard-admin.html is the main template. It only contains the layout (sidebar, header, content container) and the HTML for all modals.

The "Partials": The Admin/sections/ folder contains HTML fragments for each section (guides.html, zones.html, etc.). These files MUST NOT contain <html>, <head>, or <body> tags.

The "Controller": js/pages/dashboard-admin.js is the brain. It uses fetch() to load the HTML from a partial and injects it into the main content container (<section id="admin-content-container">).

2. The Golden Rule: No onclick in HTML Partials!

PROBLEM: When you inject HTML into a page using .innerHTML, the browser's Content Security Policy (CSP) will block any inline scripts, including onclick="..." attributes. This causes CSP errors in the console and makes your buttons fail to work.

SOLUTION: Event Binding in JavaScript.

Instead of onclick, we give the element a unique id or class in the HTML partial, then use JavaScript to attach the click event.

Bad (in HTML partial):

<!-- DO NOT DO THIS in a partial file -->
<button onclick="abrirModalGuia()">Add Guide</button>


Good (HTML + JS):

HTML (in sections/guides.html): Give it a unique id.

<button class="btn btn-primary" id="btn-add-guide">Add Guide</button>


JS (in js/pages/dashboard-admin.js): Attach the event in the bindSectionEvents() function.

function bindSectionEvents() {
    const btnAddGuide = document.getElementById('btn-add-guide');
    if (btnAddGuide) {
        btnAddGuide.addEventListener('click', abrirModalGuia);
    }
}

// The loadAdminSection() function calls bindSectionEvents() 
// AFTER injecting the new HTML.


How to Add a New Admin Section (Tutorial)

Follow these 3 steps to add a new section (e.g., "Reports").

Step 1: Create the HTML Partial

Create a new file in Admin/sections/reports.html. (Remember: no <html> or <body> tags).

Admin/sections/reports.html:

<div class="content-card">
    <div class="card-header">
        <h3>Activity Reports</h3>
    </div>
    <div class="card-body">
        <p>Reports will be displayed here...</p>
        <!-- Example button that will open a modal -->
        <button class="btn btn-primary" id="btn-run-report">Run Report</button>
    </div>
</div>


Step 2: Add the Link to the Sidebar

Edit Admin/dashboard-admin.html and add a new link to the <nav class="sidebar-nav">.

Admin/dashboard-admin.html:

<!-- ... (after the 'configuration' link) ... -->
<a href="#" class="nav-item" onclick="cambiarSeccionAdmin('reports', event)">
    <span class="nav-icon">📈</span>
    <span>Reports</span>
</a>


Step 3: Update the JavaScript

Edit js/pages/dashboard-admin.js to make it aware of the new section.

js/pages/dashboard-admin.js:

// 1. Add the title to the titles object
const adminSectionTitles = {
    dashboard: 'Dashboard General',
    // ... (other titles) ...
    configuration: 'Configuración del Sistema',
    reports: 'Activity Reports' // <-- ADD THIS LINE
};

// ...

// 2. Bind the event for the new button
function bindSectionEvents() {
    // ... (other bindings) ...

    // --- For sections/reports.html ---
    const btnRunReport = document.getElementById('btn-run-report');
    if (btnRunReport) {
        // (Make sure you create the 'runReport' function)
        // btnRunReport.addEventListener('click', runReport);
        btnRunReport.addEventListener('click', () => {
            alert('Running report...');
        });
    }
}

// ... (rest of the file) ...


How to Add a New Modal

CRITICAL: Modals are part of the "Shell," not the "Partials."

HTML: Add the complete HTML for your modal to Admin/dashboard-admin.html, alongside the other modals (modalGuia, modalEvento, etc.). Give it a unique ID (e.g., id="modalReport").

JavaScript (Functions): Go to js/pages/dashboard-admin.js and add the functions to open and close your new modal.

function abrirModalReporte() {
    document.getElementById('modalReport').style.display = 'flex';
}
function cerrarModalReporte() {
    document.getElementById('modalReport').style.display = 'none';
}
// Don't forget to export them to the window!
window.abrirModalReporte = abrirModalReporte;
window.cerrarModalReporte = cerrarModalReporte;


JavaScript (Binding): In js/pages/dashboard-admin.js, inside bindSectionEvents(), attach your new abrirModalReporte function to the button that should trigger it.

// In bindSectionEvents()
const btnRunReport = document.getElementById('btn-run-report');
if (btnRunReport) {
    btnRunReport.addEventListener('click', abrirModalReporte);
}
