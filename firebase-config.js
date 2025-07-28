const firebaseConfig = {
  apiKey: "AIzaSyDNRsHeUNRQjDFCrd9PX3XIWq5DGZkkYJU",
  authDomain: "lambda-df556.firebaseapp.com",
  projectId: "lambda-df556",
  storageBucket: "lambda-df556.firebasestorage.app",
  messagingSenderId: "353626314721",
  appId: "1:353626314721:web:84ae36190386289b2364a0",
  measurementId: "G-RGF9WFSJE7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to Firebase Auth and Database
const auth = firebase.auth();
const database = firebase.database();
