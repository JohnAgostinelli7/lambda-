// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyABC123XYZ456DEF789GHI", // Replace with your actual API key
  authDomain: "lambda-studies-center.firebaseapp.com", // Replace with your project's domain
  databaseURL: "https://lambda-studies-center.firebaseio.com", // Replace with your database URL
  projectId: "lambda-studies-center", // Replace with your project ID
  storageBucket: "lambda-studies-center.appspot.com", // Replace with your storage bucket
  messagingSenderId: "123456789012", // Replace with your sender ID
  appId: "1:123456789012:web:abc123def456ghi789jkl" // Replace with your app ID
};

// Initialize Firebase only if it hasn't been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Make auth and database references available globally
const auth = firebase.auth();
const database = firebase.database();
