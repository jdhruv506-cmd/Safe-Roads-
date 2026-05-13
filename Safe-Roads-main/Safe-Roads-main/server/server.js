const express = require('express');
const cors = require('cors');
const path = require('path');
const exceljs = require('exceljs');
const { db, isMock } = require('./firebase');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// In-memory visitor logs
const visitorLogs = [];

// API Routes

// 0. Visitor Logging
app.post('/api/log-visit', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    visitorLogs.push({
        ip,
        userAgent,
        timestamp: new Date()
    });
    res.status(200).json({ success: true });
});

app.get('/api/visitor-logs', (req, res) => {
    res.json(visitorLogs.reverse().slice(0, 50)); // Return latest 50 logs
});

// Admin Authentication
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'Admin' && password === 'Pass@123') {
        res.json({ success: true, message: 'Logged in successfully' });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});
// 1. Report a Hazard
app.post('/api/hazards', async (req, res) => {
    try {
        const { type, lat, lng, description, photoUrl } = req.body;
        
        if (!type || !lat || !lng) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const hazardData = {
            type,
            lat,
            lng,
            description: description || '',
            photoUrl: photoUrl || '',
            timestamp: isMock ? new Date() : require('firebase-admin').firestore.FieldValue.serverTimestamp(),
            status: 'reported'
        };

        const docRef = await db.collection('Hazard_Reports').add(hazardData);
        res.status(201).json({ success: true, id: docRef.id, message: 'Hazard reported successfully' });
    } catch (error) {
        console.error('Error adding hazard:', error);
        res.status(500).json({ error: 'Failed to report hazard' });
    }
});

// 2. Get All Hazards
app.get('/api/all-hazards', async (req, res) => {
    try {
        const snapshot = await db.collection('Hazard_Reports').get();
        if (snapshot.empty) {
            return res.status(404).json({ error: 'No hazards found' });
        }

        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(docs);
    } catch (error) {
        console.error('Error fetching all hazards:', error);
        res.status(500).json({ error: 'Failed to fetch hazards' });
    }
});

// 3. Get Random Hazard (for the dice button)
app.get('/api/random-hazard', async (req, res) => {
    try {
        const snapshot = await db.collection('Hazard_Reports').get();
        if (snapshot.empty) {
            return res.status(404).json({ error: 'No hazards found' });
        }

        const docs = snapshot.docs;
        const randomDoc = docs[Math.floor(Math.random() * docs.length)];
        
        res.json({ id: randomDoc.id, ...randomDoc.data() });
    } catch (error) {
        console.error('Error fetching random hazard:', error);
        res.status(500).json({ error: 'Failed to fetch hazard' });
    }
});

// 4. Submit Feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const { name, email, phone, category, message } = req.body;

        if (!category || !message || !email || !phone) {
            return res.status(400).json({ error: 'Category, message, email, and phone are required' });
        }

        const feedbackData = {
            name: name || 'Anonymous',
            email,
            phone,
            category,
            message,
            timestamp: isMock ? new Date() : require('firebase-admin').firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('User_Feedback').add(feedbackData);
        res.status(201).json({ success: true, id: docRef.id, message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// 5. Get All Feedback
app.get('/api/feedback', async (req, res) => {
    try {
        const snapshot = await db.collection('User_Feedback').get();
        if (snapshot.empty) {
            return res.status(404).json({ error: 'No feedback found' });
        }
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(docs);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

// 6. Export Logs to Excel
app.get('/api/admin/export-excel', async (req, res) => {
    try {
        const workbook = new exceljs.Workbook();
        
        // Sheet 1: Visitor Logs
        const logSheet = workbook.addWorksheet('Visitor Logs');
        logSheet.columns = [
            { header: 'IP Address', key: 'ip', width: 20 },
            { header: 'User Agent', key: 'userAgent', width: 50 },
            { header: 'Timestamp', key: 'timestamp', width: 25 }
        ];
        visitorLogs.forEach(log => {
            logSheet.addRow({
                ip: log.ip,
                userAgent: log.userAgent,
                timestamp: new Date(log.timestamp).toLocaleString()
            });
        });

        // Sheet 2: Hazard Reports
        const hazardSheet = workbook.addWorksheet('Hazard Reports');
        hazardSheet.columns = [
            { header: 'Type', key: 'type', width: 15 },
            { header: 'Latitude', key: 'lat', width: 15 },
            { header: 'Longitude', key: 'lng', width: 15 },
            { header: 'Description', key: 'description', width: 40 },
            { header: 'Reported At', key: 'timestamp', width: 25 }
        ];
        const hazardsSnapshot = await db.collection('Hazard_Reports').get();
        if (!hazardsSnapshot.empty) {
            hazardsSnapshot.docs.forEach(doc => {
                const h = doc.data();
                hazardSheet.addRow({
                    type: h.type,
                    lat: h.lat,
                    lng: h.lng,
                    description: h.description,
                    timestamp: new Date(h.timestamp?._seconds ? h.timestamp._seconds*1000 : h.timestamp).toLocaleString()
                });
            });
        }

        // Sheet 3: Feedback Forms
        const feedbackSheet = workbook.addWorksheet('Feedback Forms');
        feedbackSheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Category', key: 'category', width: 15 },
            { header: 'Message', key: 'message', width: 50 },
            { header: 'Submitted At', key: 'timestamp', width: 25 }
        ];
        const feedbackSnapshot = await db.collection('User_Feedback').get();
        if (!feedbackSnapshot.empty) {
            feedbackSnapshot.docs.forEach(doc => {
                const f = doc.data();
                feedbackSheet.addRow({
                    name: f.name,
                    email: f.email,
                    phone: f.phone,
                    category: f.category,
                    message: f.message,
                    timestamp: new Date(f.timestamp?._seconds ? f.timestamp._seconds*1000 : f.timestamp).toLocaleString()
                });
            });
        }

        // Send Excel file to client
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'SafeRoads_Logs.xlsx');
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).json({ error: 'Failed to generate Excel file' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
