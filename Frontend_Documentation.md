# AgriSahayak Frontend Documentation

Welcome to the frontend documentation for **AgriSahayak**. This guide provides a high-level overview of the frontend architecture, technologies used, and directory structure, designed to help anyone easily understand and navigate the codebase.

---

## 🚀 1. Tech Stack Overview

The frontend is a modern, responsive single-page application (SPA) built for performance and scalability. Here are the core technologies used:

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) (provides extremely fast development server and optimized production builds)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (utility-first CSS framework for rapid UI development)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (for specific modular global stores) & React Context API (`AppContext.jsx` for global app state like user, auth, and language)
- **Data Fetching & Caching**: Custom Axios instance (`client.js`) combined with IndexedDB (`idb.js`) for offline caching and retry logic.
- **Routing**: [React Router v6](https://reactrouter.com/) (handles navigation across different views)
- **Maps & Geospatial**: [Leaflet](https://leafletjs.com/) and `react-leaflet` (for Satellite Oracle and Outbreak Maps)
- **Charts & Visualization**: [Recharts](https://recharts.org/) and [Three.js](https://threejs.org/) (for data analytics and 3D globe visualization)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)

---

## 📂 2. Project Directory Structure

The source code sits mainly under `frontend-src/src/`. Here’s what each folder does:

```text
frontend-src/src/
├── api/          # Contains all API service calls and offline caching logic
├── components/   # Reusable UI components (buttons, loaders, layouts, complex elements like GlobeVisualization)
├── contexts/     # Global React Contexts (e.g., AppContext.jsx for global state)
├── pages/        # Top-level page components representing different routes (Home, Login, Disease, etc.)
├── store/        # Zustand stores for modular global state (e.g., OutbreakMap store)
├── App.jsx       # The main application component that sets up routing and providers
├── main.jsx      # The React entry point that mounts the app to the DOM
├── i18n.js       # Internationalization (i18n) setup for multi-language support
└── index.css     # Global CSS and Tailwind directives
```

---

## 🔌 3. Core Architecture Details

### A. Routing & Protection (`App.jsx`)
The application defines all its routes in `App.jsx`. It distinguishes between public routes (like `/login`) and protected routes. 
A `ProtectedRoute` wrapper checks if a user is authenticated (via `authToken` in global state) before rendering features. If not authenticated, the user is redirected to the login page.

### B. Global State Management (`AppContext.jsx`)
`AppContext.jsx` acts as the single source of truth for the most critical user data. It manages:
- **`farmer`**: The current logged-in user's details.
- **`authToken`**: The session token used for API requests.
- **`language`**: The user's preferred language.
- **`isOnline`**: A boolean flag that listens to the browser's network status.
- **`notifications` & `alertToasts`**: Systems for managing global outbreak alerts and UI toasts.

It also automatically synchronizes key state variables with `localStorage` so data isn't lost on page refresh.

### C. API Client & Offline Capabilities (`api/client.js` & `api/idb.js`)
AgriSahayak caters to environments that might have spotty network coverage. 
- **`client.js`**: Wraps Axios to provide an `apiRequestWithRetry` functionality. It automatically retries failed network requests with exponential back-off.
- **Offline Caching**: GET requests are typically cached in IndexedDB (`idb.js`). If a user goes offline, the app intercepts network failures, retrieves the last known good response from the cache, and triggers a UI toast ("Showing cached data") to let the user know they are looking at offline data.
- **Modular Endpoints**: API functions are cleanly separated by domain (e.g., `farmerApi`, `weatherApi`, `diseaseApi`, `satelliteApi`).

### D. Multi-Language Support (`i18n.js`)
The platform is designed to be accessible. `i18n.js` handles translations, allowing the interface to switch contexts and display text in different local languages based on the `appLanguage` state.

### E. Complex UI Features (`components/`)
The `components` directory holds advanced features such as:
- **`GlobeVisualization.jsx`**: A 3D interactive globe.
- **`VoiceCommandBar.jsx`**: A component integrating voice inputs, likely tying into the `voiceApi`.
- **`LoadingScreen.jsx`**: Global loading overlays.

---

## 🛠️ 4. Feature Pages Breakdown (`src/pages/`)

The core features are divided into standalone pages. Some notable ones include:

- **`Home.jsx` / `Dashboard`**: The personalized landing screen for the farmer showing quick stats and insights.
- **`Disease.jsx` & `Pest.jsx`**: Image detection pages where farmers can upload photos to identify crop issues.
- **`SatelliteOracle.jsx`**: An integration with satellite imagery using maps (`react-leaflet`) for NDVI and land analysis.
- **`OutbreakMap.jsx`**: A geographic view of disease spread and alerts across regions.
- **`CropCycle.jsx` & `CropAdvisor.jsx`**: Tools to manage crop lifecycle logging and receive AI-driven recommendations.
- **`Admin.jsx`**: A composite dashboard for administrators to view aggregate data, user growth, and complaint resolutions.
- **`Chatbot.jsx`**: An interactive AI assistant interface for farmers.

---

## 🏁 5. Getting Started for Developers

To run this frontend locally:
1. Navigate to the frontend directory: `cd frontend-src`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Build for production: `npm run build`

> **Note**: This application expects a backend API running at `/api/v1`. If running locally, ensure the backend server is active or update the Vite proxy settings if necessary.

---
*Created automatically to provide a clear architectural understanding of the AgriSahayak React Frontend.*
