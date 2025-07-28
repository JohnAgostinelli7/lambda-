// auth.js
document.addEventListener('DOMContentLoaded', function() {
    const auth = firebase.auth();
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Login Handler
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            // Set persistence based on remember me
            const persistence = rememberMe ? 
                firebase.auth.Auth.Persistence.LOCAL : 
                firebase.auth.Auth.Persistence.SESSION;

            auth.setPersistence(persistence)
                .then(() => {
                    return auth.signInWithEmailAndPassword(email, password);
                })
                .then((userCredential) => {
                    // Successful login
                    window.location.href = 'dashboard.html'; // Redirect to dashboard
                })
                .catch((error) => {
                    // Handle errors
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(`Login failed: ${errorMessage}`);
                });
        });
    }

    // Signup Handler
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validate passwords match
            if (password !== confirmPassword) {
                alert("Passwords don't match!");
                return;
            }

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Successful signup
                    const user = userCredential.user;
                    
                    // Save additional user data to database
                    const db = firebase.database();
                    const userRef = db.ref('users/' + user.uid);
                    
                    const userData = {
                        username: document.getElementById('username').value,
                        fullname: document.getElementById('fullname').value,
                        email: email,
                        form: document.getElementById('form').value,
                        gender: document.querySelector('input[name="gender"]:checked').value,
                        zerakiAccount: document.getElementById('zeraki-check').checked,
                        createdAt: firebase.database.ServerValue.TIMESTAMP
                    };

                    if (userData.zerakiAccount) {
                        userData.zerakiUsername = document.getElementById('zeraki-username').value;
                        userData.zerakiPassword = document.getElementById('zeraki-password').value;
                    }

                    return userRef.set(userData);
                })
                .then(() => {
                    // Redirect after successful signup
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    // Handle errors
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(`Signup failed: ${errorMessage}`);
                });
        });
    }

    // Password reset function
    window.resetPassword = function() {
        const email = prompt("Please enter your email address to reset your password:");
        if (email) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    alert("Password reset email sent! Please check your inbox.");
                })
                .catch((error) => {
                    alert(`Error sending reset email: ${error.message}`);
                });
        }
    };

    // Check auth state to prevent login page access when already logged in
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    });
});
