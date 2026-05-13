-- Safe Roads SQL Database Schema Definition
-- This file can be used if you need to demonstrate a relational database (SQL) approach.

CREATE DATABASE IF NOT EXISTS saferoads_db;
USE saferoads_db;

-- 1. Hazards Table (For Potholes and Traffic Lights)
CREATE TABLE IF NOT EXISTS hazards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL COMMENT 'Can be pothole or traffic_light',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    description TEXT,
    image_base64 LONGTEXT COMMENT 'Stores the uploaded image string',
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Feedback Table (For Contact & Bug Reports)
CREATE TABLE IF NOT EXISTS feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users / Admins Table (Optional for extended functionality)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Insert Dummy Data for Demonstration
-- ==========================================

INSERT INTO hazards (type, latitude, longitude, description) VALUES 
('pothole', 18.49680000, 74.02420000, 'Deep pothole near Loni Kalbhor station, causes massive traffic.'),
('traffic_light', 18.52040000, 73.85670000, 'Broken light at Pune Camp intersection.'),
('pothole', 18.50200000, 73.98000000, 'Bad road condition in Hadapsar.'),
('traffic_light', 18.51500000, 73.92000000, 'Traffic signals not working in Magarpatta City.');

INSERT INTO feedbacks (name, phone, email, category, message) VALUES 
('John Doe', '+91 9876543210', 'john@example.com', 'feature', 'Please add a feature to track the repair status of a pothole.'),
('Jane Smith', '+91 8765432109', 'jane@example.com', 'bug', 'The map sometimes fails to load on slower connections.');
