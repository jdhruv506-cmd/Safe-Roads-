# Safe Roads - Project Summary and Local Setup Guide

## Project Overview
**Safe Roads** is a civic-tech platform designed to help road users identify, report, and avoid potholes and malfunctioning traffic lights. This crowdsourced data assists municipal bodies and road users to reduce accidents and improve urban infrastructure. The project currently focuses on the Loni Kalbhor and broader Pune region.

### Key Features
*   **Interactive Map**: Powered by Leaflet.js, defaults to Loni Kalbhor, Pune.
*   **Hazard Reporting**: Users can report potholes and broken traffic lights directly on the map with photo evidence (supports image uploads up to 10MB via Base64 encoding).
*   **Smart Search**: Search functionality automatically biases to Pune, India.
*   **Admin Portal**: Secure login (`Admin` / `Pass@123`) to view and manage visitor logs, hazards, and feedback forms, with a one-click Excel export functionality.
*   **Database Flexibility**: Gracefully falls back to an in-memory mock database if Firebase credentials aren't provided.

## Technology Stack
*   **Frontend**: HTML5, CSS3, Bootstrap 5, FontAwesome, Vanilla JavaScript, Leaflet.js
*   **Backend**: Node.js, Express.js
*   **Database**: Mock Database / Firebase Firestore (NoSQL)
*   **Deployment**: Docker

## Application Flow
1.  **Page Load**: `app.js` runs `initMap()` and centers the Leaflet map on Loni Kalbhor. It sends a `GET` request to `/api/all-hazards` to fetch and display existing reports.
2.  **Reporting**: A user drops a pin, uploads a photo, and submits. `app.js` converts the photo to Base64 and sends a `POST` request to `/api/reports`.
3.  **Backend Processing**: The Express server receives the data, appends a timestamp, and saves it to the database.
4.  **UI Update**: The backend responds with a success message, and a new hazard marker pops up dynamically on the map.

## Setup Instructions

### Option 1: Run it Locally (Recommended for Development)
1. Install Node.js from [nodejs.org](https://nodejs.org/) (LTS version).
2. Open your terminal in the main project directory.
3. Run `npm install` to download dependencies.
4. Run `npm start` to start the Node.js server.
5. Open your web browser to `http://localhost:3000`.

*Note: Node.js was successfully installed on your PC via the AI assistant, and you can run the server directly!*

### Option 2: Run it via Docker (For Deployment)
1. Install Docker Desktop from [docker.com](https://www.docker.com/).
2. Open your terminal in the main project directory.
3. Build the Docker image: `docker build -t safe-roads-app .`
4. Run the container: `docker run -p 3000:3000 -d --name safe-roads-container safe-roads-app`
5. Open your web browser to `http://localhost:3000`.

## Enabling the Real Database
By default, the application runs on a Mock Database. To switch to the live Firebase Firestore database:
1. Go to your Firebase Console and download your Service Account JSON key.
2. Rename the file to `serviceAccountKey.json`.
3. Place the file inside the `/server` folder.
4. Restart the node server. It will automatically detect the key and switch over.
