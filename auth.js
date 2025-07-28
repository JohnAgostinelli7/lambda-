// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDNRsHeUNRQjDFCrd9PX3XIWq5DGZkkYJU",
  authDomain: "lambda-df556.firebaseapp.com",
  databaseURL: "https://lambda-df556-default-rtdb.firebaseio.com",
  projectId: "lambda-df556",
  storageBucket: "lambda-df556.appspot.com",
  messagingSenderId: "353626314721",
  appId: "1:353626314721:web:84ae36190386289b2364a0",
  measurementId: "G-RGF9WFSJE7"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// ================= AUTHENTICATION FUNCTIONS ================= //

// Set auth persistence (keep users logged in)
function initializeAuthPersistence() {
  return auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => console.log("Auth persistence set to LOCAL"))
    .catch(error => console.error("Error setting persistence:", error));
}

// Check current auth state
function checkAuthState() {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe(); // Important to avoid memory leaks
      resolve(user);
    });
  });
}

// Handle user login
async function login() {
  const loginInput = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const rememberMe = document.getElementById("remember-me").checked;

  try {
    // Set persistence based on "Remember Me"
    const persistence = rememberMe 
      ? firebase.auth.Auth.Persistence.LOCAL 
      : firebase.auth.Auth.Persistence.SESSION;

    await auth.setPersistence(persistence);

    // Determine if using email or username login
    if (loginInput.includes('@')) {
      await auth.signInWithEmailAndPassword(loginInput, password);
    } else {
      const snapshot = await database.ref(`usernames/${loginInput}`).once('value');
      if (!snapshot.exists()) throw new Error('Username not found');
      
      const userId = snapshot.val();
      const emailSnapshot = await database.ref(`users/${userId}/email`).once('value');
      const email = emailSnapshot.val();
      if (!email) throw new Error('No email associated with this username');
      
      await auth.signInWithEmailAndPassword(email, password);
    }

    // Redirect on successful login
    window.location.href = "dashboard.html";
    
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Rethrow for handling in UI
  }
}

// Handle user signup
async function signUp() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate inputs
  if (password !== confirmPassword) throw new Error("Passwords don't match");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    
    // Prepare user data
    const userData = {
      email: email,
      fullName: document.getElementById("fullname").value,
      username: document.getElementById("username").value,
      form: document.getElementById("form").value,
      gender: document.querySelector('input[name="gender"]:checked').value,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    };

    // Save user data
    await database.ref(`users/${userCredential.user.uid}`).set(userData);
    await database.ref(`usernames/${userData.username}`).set(userCredential.user.uid);
    
    // Send verification email
    await userCredential.user.sendEmailVerification();
    
    // Redirect to dashboard
    window.location.href = "dashboard.html";
    
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

// Handle password reset
async function resetPassword() {
  const email = document.getElementById("login-username")?.value || 
               prompt("Enter your email to reset password:");
  
  if (!email) return;

  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset email sent! Check your inbox.");
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
}

// Handle logout
function logout() {
  return auth.signOut()
    .then(() => {
      window.location.href = "login.html";
    });
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeAuthPersistence();
});

// ================= EXPORT FUNCTIONS ================= //
// (Only needed if you're using modules, otherwise they're globally available)
