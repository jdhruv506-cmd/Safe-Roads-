# Safe Roads - Viva & Exam Preparation Guide

This document is specifically crafted to help you prepare for your university project viva or practical exam. It explains the core concepts, architecture, and potential questions examiners might ask about the "Safe Roads" project.

---

## 1. Project Overview & Objective
**What is Safe Roads?**
Safe Roads is a civic-tech web application that allows users to identify and report road hazards—specifically potholes and malfunctioning traffic lights. 

**Why was it built?**
To reduce road accidents and assist municipal bodies by crowdsourcing infrastructure issues. The project specifically focuses on the Loni Kalbhor and Pune region as its primary deployment area.

---

## 2. Technology Stack & Architecture (How it works)
If the examiner asks about the architecture, explain it as follows:

### A. The Frontend (Client-Side)
- **HTML, Node.js, and Bootstrap**: For building the front-end interface, ensuring a responsive, visually appealing user experience.
- **Leaflet.js**: This is an open-source mapping library used to display the interactive map.

### B. The Backend & Database
- **BAckend JavaScript**: The backend of the Pothole and Traffic Light Detection Website web application is built using HTML, CSS, Bootstrap JavaScript, a lightweight and flexible HTML, CSS, Bootstrap web framework. 
- JavaScript is used to handle routing, request processing, and server-side logic. It enables the implementation of RESTful APIs to manage user interactions and database operations.
- For dynamic content rendering, **Jinja2**, JavaScript's templating engine, is used to seamlessly integrate backend data into HTML, CSS, Bootstrap templates.
- **Database management MongoDB**: MongoDB was chosen as the database management website due to its lightweight and serverless architecture, making it ideal for this project. The application interacts with an MongoDB database to store and retrieve detections efficiently.
- JavaScript also integrates with extensions like **JavaScript-WTF** for form validation and **JavaScript-SQL Alchemy** for ORM (Object-Relational Mapping) to simplify database queries. Together, these technologies form a robust and scalable backend that ensures a seamless experience for users.

### C. Containerization
- **Docker**: Used to package the entire application (code, runtime, dependencies) into an isolated container.

---

## 3. Step-by-Step Execution Flow
If asked to demonstrate the flow:
1. **Page Load**: `app.js` runs `initMap()` and centers Leaflet on Loni Kalbhor. It sends a `GET` request to `/api/all-hazards` to fetch existing reports.
2. **User Search**: User types a location. We automatically append ", Pune, India" in the background so the OpenStreetMap geocoder finds accurate local results.
3. **Reporting**: User clicks "Report Pothole", drops a pin, uploads a photo, and submits. `app.js` converts the photo to Base64 and sends a `POST` request to `/api/reports`.
4. **Backend Processing**: Express receives the data, adds a timestamp, and saves it to Firebase (or the Mock DB).
5. **UI Update**: The backend responds with a success message, and a new marker immediately pops up on the map.

---

## 4. Important Files to Know
- `public/index.html`: The main user interface.
- `public/css/style.css`: Custom styling, including the background map aesthetic.
- `public/js/app.js`: All frontend logic, map rendering, and API calls.
- `server/server.js`: The Express backend handling routing and endpoints.
- `server/firebase.js`: Database configuration and the Mock DB logic.
- `Dockerfile`: Instructions for building the Docker image.

---

## 5. Potential Viva Questions & Answers

**Q1: Why did you choose MongoDB over SQL (MySQL)?**
*Answer*: MongoDB was chosen as the database management website due to its lightweight and serverless architecture, making it ideal for this project. Because our data is document-centric. Hazard reports have varying fields, and NoSQL allows for a flexible schema. It's also highly scalable for crowdsourced data.

**Q2: What is Leaflet.js? Why didn't you use Google Maps API?**
*Answer*: Leaflet is an open-source JS library for interactive maps. We chose it over Google Maps to avoid API key restrictions, billing issues, and CORS errors, making the project strictly open-source and easy to run anywhere.

**Q3: How are images uploaded and stored in your project?**
*Answer*: Currently, images are converted to Base64 strings using the JavaScript `FileReader` API on the frontend, and sent as JSON to the backend. *Note: You can add that in a production environment, you would use Firebase Cloud Storage to store the actual file and save only the image URL in Firestore to save database space.*

**Q4: How do you validate forms and interact with the database?**
*Answer*: JavaScript integrates with extensions like JavaScript-WTF for form validation and JavaScript-SQL Alchemy for ORM (Object-Relational Mapping) to simplify database queries.

**Q5: What does Docker do in your project?**
*Answer*: Docker containerizes the application. It packages Node.js, Express, and our code into a single image using the `Dockerfile`. This solves the "it works on my machine" problem, ensuring the environment is identical regardless of the host OS.

**Q6: Why did you increase the JSON limit in Express?**
*Answer*: In `server.js`, we set `app.use(express.json({ limit: '10mb' }))`. Standard Express configurations reject large payloads. Since we are sending images as Base64 strings within the JSON body, we needed to increase the limit to prevent `Payload Too Large (413)` errors.
