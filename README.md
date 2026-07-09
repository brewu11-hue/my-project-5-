Link For The App: https://my-project-5-one.vercel.app/

# VukaGigs 🇿🇦

VukaGigs (derived from the isiZulu word *Vuka*, meaning "Wake up / Arise") is an offline-first mobile application built to bridge the gap between informal workers and local micro-job opportunities in South Africa. 

By eliminating high agency fees and designing for local infrastructure constraints, VukaGigs empowers informal traders, artisans, and laborers to find neighborhood-level employment instantly.

## 🚀 Key Features

*   **Dual-Persona Interface:** Switch seamlessly between "Worker" and "Hiring" profiles within a single application.
*   **Hyper-Local Geo-Matching:** Uses location APIs to connect workers with jobs inside their immediate neighborhood, eliminating expensive transit costs.
*   **Offline-First Syncing:** Fully functional offline. Workers can browse cached jobs and draft messages; data syncs automatically when a connection resumes.
*   **Multi-Lingual Interface:** Built-in localization support for English, isiZulu, isiXhosa, and Afrikaans to promote digital inclusion.
*   **POPIA-Compliant Privacy:** Secure user data by masking contact numbers and hiding exact location pins until a gig contract is mutually accepted.

## 🛠️ Tech Stack & Architecture

*   **IDE:** Android Studio
*   **Architecture Pattern:** MVVM (Model-View-ViewModel) for strict separation of concerns.
*   **Local Storage (Offline Cache):** Jetpack Room / SQLite
*   **Background Processing:** WorkManager API (handles delayed network syncing and data-saving queues)
*   **Mapping UI:** Google Maps SDK / Mapbox API

## 📁 Project Structure

```text
com.example.vukagigs/
│
├── data/          # Data Models, Room Entities, Local DAOs, Network API Clients
├── repository/    # Repository Pattern (Mediates between local Cache & Network)
├── viewmodel/     # Jetpack ViewModels managing UI States and Business Logic
└── ui/            # Layouts, Fragments, Activities, and Custom Views
```

## 🇿🇦 South African Market Optimizations (Portfolio Highlights)

Recruiters and engineers evaluating this project should note how the architecture addresses specific local challenges:

1.  **Data Scarcity & Load-Shedding:** By utilizing an **Offline-First Architecture** with Android's `WorkManager`, the app does not crash or lose user input during abrupt signal drops or power outages.
2.  **Low-End Hardware Optimization:** The app package size is strictly optimized, keeping layouts lightweight and efficient for entry-level smartphones common in the local market.

## ⚙️ Setup & Installation

1. Clone this repository:
   ```bash
   git clone https://github.com
   ```
2. Open the project in **Android Studio**.
3. Add your Google Maps API Key to your `local.properties` file:
   ```env
   MAPS_API_KEY=your_api_key_here
   ```



