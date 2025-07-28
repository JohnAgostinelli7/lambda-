// auth.js
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    });

    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            // Set button loading state
            const loginBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Logging in...';
            loginBtn.disabled = true;

            try {
                // Set persistence based on remember me
                const persistence = rememberMe ? 
                    firebase.auth.Auth.Persistence.LOCAL : 
                    firebase.auth.Auth.Persistence.SESSION;
                
                await auth.setPersistence(persistence);
                await auth.signInWithEmailAndPassword(email, password);
                
                // Redirect happens automatically via auth state listener
            } catch (error) {
                // Reset button state
                loginBtn.innerHTML = originalBtnText;
                loginBtn.disabled = false;
                
                // Show error message
                let errorMessage = "Login failed. Please try again.";
                switch(error.code) {
                    case 'auth/user-not-found':
                        errorMessage = "No user found with this email.";
                        break;
                    case 'auth/wrong-password':
                        errorMessage = "Incorrect password.";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "Invalid email format.";
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = "Too many attempts. Please try again later.";
                        break;
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Login Error',
                    text: errorMessage
                });
            }
        });
    }

    // Signup form handler
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validate passwords match
            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Signup Error',
                    text: 'Passwords do not match!'
                });
                return;
            }

            // Set button loading state
            const signupBtn = signupForm.querySelector('button[type="submit"]');
            const originalBtnText = signupBtn.innerHTML;
            signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Creating account...';
            signupBtn.disabled = true;

            try {
                // Create user
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Prepare user data
                const userData = {
                    username: document.getElementById('username').value,
                    fullname: document.getElementById('fullname').value,
                    email: email,
                    form: document.getElementById('form').value,
                    gender: document.querySelector('input[name="gender"]:checked').value,
                    zerakiAccount: document.getElementById('zeraki-check').checked,
                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" // Default profile image
                };

                if (userData.zerakiAccount) {
                    userData.zerakiUsername = document.getElementById('zeraki-username').value;
                    userData.zerakiPassword = document.getElementById('zeraki-password').value;
                }

                // Save user data to database
                await database.ref('users/' + user.uid).set(userData);
                
                // Show success message and redirect
                Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    text: 'You have successfully created your account.',
                    willClose: () => {
                        window.location.href = 'dashboard.html';
                    }
                });
            } catch (error) {
                // Reset button state
                signupBtn.innerHTML = originalBtnText;
                signupBtn.disabled = false;
                
                // Show error message
                let errorMessage = "Signup failed. Please try again.";
                switch(error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = "Email already in use.";
                        break;
                    case 'auth/weak-password':
                        errorMessage = "Password should be at least 6 characters.";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "Invalid email format.";
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = "Account creation is currently disabled.";
                        break;
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Signup Error',
                    text: errorMessage
                });
            }
        });
    }

    // Password reset function
    window.resetPassword = function() {
        const email = document.getElementById('login-username').value || 
                     prompt("Please enter your email address to reset your password:");
        
        if (email) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Password Reset Sent',
                        text: 'Check your email for the password reset link.'
                    });
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Reset Error',
                        text: error.message
                    });
                });
        }
    };
});
