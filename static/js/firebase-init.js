/**
 * firebase-init.js
 * Client-side Firebase SDK initialization for the Smart Farmer Service Center.
 * Enables Google Analytics tracking for the web application.
 *
 * Firebase Project: farmer-service-center
 * Console: https://console.firebase.google.com/project/farmer-service-center
 */

// Import Firebase App and Analytics modules from the CDN (ES module syntax)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Firebase project configuration
const firebaseConfig = {
    apiKey:            "AIzaSyA3yeycWX9sBBtOe9PygHmcuIeivwwHpAo",
    authDomain:        "farmer-service-center.firebaseapp.com",
    projectId:         "farmer-service-center",
    storageBucket:     "farmer-service-center.firebasestorage.app",
    messagingSenderId: "210915581453",
    appId:             "1:210915581453:web:09cd95719054a7a5f7bf44",
    measurementId:     "G-N5SEKKVJRV"
};

// Initialize the Firebase app instance
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Google Analytics
const analytics = getAnalytics(firebaseApp);

// Log a page_view event on every page load
logEvent(analytics, 'page_view', {
    page_title:    document.title,
    page_location: window.location.href,
    page_path:     window.location.pathname
});

console.log("[Firebase] Analytics initialized for:", document.title);
