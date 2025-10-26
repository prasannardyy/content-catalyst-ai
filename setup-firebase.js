#!/usr/bin/env node

/**
 * Firebase Setup Helper Script
 * Run this script to quickly configure your Firebase environment
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Helper for Content Catalyst AI\n');

console.log('Please follow these steps:\n');

console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Create a new project called "content-catalyst-ai"');
console.log('3. Enable Authentication (Email/Password and Google)');
console.log('4. Create a Firestore database in test mode');
console.log('5. Get your web app configuration\n');

console.log('Once you have your Firebase config, update .env.local with:');
console.log('');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com');
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id');
console.log('NEXT_PUBLIC_DEMO_MODE=false');
console.log('');

console.log('📖 For detailed instructions, see FIREBASE_SETUP.md');
console.log('');
console.log('After setup, restart your dev server: npm run dev');