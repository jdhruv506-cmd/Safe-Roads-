const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let db = null;
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (fs.existsSync(serviceAccountPath)) {
    try {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        console.log("Firebase initialized successfully.");
    } catch (e) {
        console.error("Error initializing Firebase:", e);
    }
} else {
    console.warn("⚠️ Warning: serviceAccountKey.json not found in server directory.");
    console.warn("Firebase is NOT initialized. Using in-memory mock for development.");
    
    // Simple mock database
    const mockData = {
        Hazard_Reports: [
            { id: '1', data: () => ({ type: 'pothole', lat: 18.4968, lng: 74.0242, description: 'Deep pothole near Loni Kalbhor station', timestamp: new Date() }) },
            { id: '2', data: () => ({ type: 'traffic_light', lat: 18.5204, lng: 73.8567, description: 'Broken light at Pune Camp', timestamp: new Date() }) },
            { id: '3', data: () => ({ type: 'pothole', lat: 18.5020, lng: 73.9800, description: 'Bad road condition in Hadapsar', timestamp: new Date() }) },
            { id: '4', data: () => ({ type: 'traffic_light', lat: 18.5150, lng: 73.9200, description: 'Traffic signals not working in Magarpatta', timestamp: new Date() }) }
        ],
        User_Feedback: [
            { id: 'f1', data: () => ({ name: 'John Doe', email: 'john@example.com', phone: '9876543210', category: 'bug', message: 'Map zooms out randomly.', timestamp: new Date() }) }
        ]
    };

    db = {
        collection: (colName) => ({
            add: async (data) => {
                console.log(`[Mock DB] Added to ${colName}:`, data);
                if (!mockData[colName]) mockData[colName] = [];
                const id = Math.random().toString(36).substr(2, 9);
                mockData[colName].push({ id, data: () => data });
                return { id };
            },
            get: async () => {
                console.log(`[Mock DB] Fetched from ${colName}`);
                return {
                    empty: !mockData[colName] || mockData[colName].length === 0,
                    docs: mockData[colName] || []
                };
            }
        })
    };
}

module.exports = { db, isMock: !fs.existsSync(serviceAccountPath) };
