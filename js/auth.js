// js/auth.js (NEW & IMPROVED)

document.addEventListener('DOMContentLoaded', () => {
    // --- Universal Auth State Listener ---
    auth.onAuthStateChanged(user => {
        console.log('Auth state changed. User:', user); // DEBUG: See if user object exists

        const path = window.location.pathname;
        const isAuthPage = path.includes('index.html') || path.includes('signup.html') || path.includes('forgot-password.html') || path === '/';

        if (user) {
            // User is logged in
            if (isAuthPage) {
                console.log('User is on an auth page, attempting to redirect...'); // DEBUG
                db.collection('users').doc(user.uid).get().then(doc => {
                    if (doc.exists) {
                        const role = doc.data().role;
                        console.log('User role found:', role, '. Redirecting to dashboard.'); // DEBUG
                        window.location.href = `/${role}/index.html`;
                    } else {
                        // This is a critical error. The user is logged in, but has no data in the database.
                        console.error('CRITICAL ERROR: User document not found in Firestore for UID:', user.uid);
                        alert('Your user data could not be found. Please contact an administrator.');
                        logout(); // Log them out to prevent a broken state
                    }
                }).catch(error => {
                    console.error("Error getting user document:", error);
                    alert("An error occurred while fetching your user profile.");
                });
            }
        } else {
            // User is not logged in
            if (!isAuthPage) {
                console.log('User is not logged in and not on an auth page. Redirecting to login.'); // DEBUG
                window.location.href = '/index.html';
            }
        }
    });

    // --- Login Form ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = '';
            console.log('Attempting to sign in with email:', email); // DEBUG

            auth.signInWithEmailAndPassword(email, password)
                .catch(error => {
                    console.error('Login Error:', error.code, error.message); // DEBUG
                    errorMessage.textContent = `Login failed: ${error.message}`;
                });
        });
    }

    // --- Signup Form ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = signupForm.name.value;
            const email = signupForm.email.value;
            const password = signupForm.password.value;
            const role = signupForm.role.value;
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = '';
            console.log('Attempting to sign up new user:', email, 'with role:', role); // DEBUG

            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    console.log('User created in Auth. Now adding to Firestore.'); // DEBUG
                    // Create user document in Firestore
                    return db.collection('users').doc(user.uid).set({
                        uid: user.uid,
                        name: name,
                        email: email,
                        role: role
                    });
                })
                .then(() => {
                    console.log('User added to Firestore successfully.'); // DEBUG
                    alert('Sign up successful! Please log in.');
                    window.location.href = '/index.html';
                })
                .catch(error => {
                    console.error('Signup Error:', error.code, error.message); // DEBUG
                    errorMessage.textContent = `Signup failed: ${error.message}`;
                });
        });
    }

    // --- Password Reset Form ---
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        // (The forgot-password code from the previous response is fine and can be used here)
    }
});

// --- Universal Logout Function ---
function logout() {
    console.log('Logging out user...'); // DEBUG
    auth.signOut(); // The onAuthStateChanged listener will handle the redirect
}
