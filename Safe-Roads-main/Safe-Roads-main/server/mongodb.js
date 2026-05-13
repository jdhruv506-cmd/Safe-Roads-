const mongoose = require('mongoose');

// MongoDB Connection URI - replace with your actual Atlas URI or local MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saferoads';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Schema for Hazards (Potholes and Traffic Lights)
const hazardSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true, 
        enum: ['pothole', 'traffic_light'] 
    },
    lat: { 
        type: Number, 
        required: true 
    },
    lng: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String 
    },
    imageBase64: { 
        type: String 
    }, // Stores image as a base64 encoded string
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
});

const Hazard = mongoose.model('Hazard', hazardSchema);

// Define Schema for Feedback and Support
const feedbackSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true,
        enum: ['connect', 'bug', 'feature', 'other']
    },
    message: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = { mongoose, Hazard, Feedback };
