// This script handles all authentication logic
document.addEventListener('DOMContentLoaded', () => {
    // --- Universal Auth State Listener ---
    auth.onAuthStateChanged(user => {
        const path = window.location.pathname;
        const isAuthPage = path.includes('index.html') || path.includes('signup.html') || path.includes('forgot-password.html') || path === '/';

        if (user) {
            if (isAuthPage) {
                // If on an auth page, redirect to the correct dashboard
                db.collection('users').doc(user.uid).get().then(doc => {
                    if (doc.exists) {
                        const role = doc.data().role;
                        window.location.href = `/${role}/index.html`;
                    } else {
                        console.error("User document not found in Firestore!");
                    }
                });
            }
        } else {
            // If user is not logged in and not on an auth page, redirect to login
            if (!isAuthPage) {
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

            auth.signInWithEmailAndPassword(email, password)
                .catch(error => {
                    errorMessage.textContent = error.message;
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

            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    // Create user document in Firestore
                    return db.collection('users').doc(user.uid).set({
                        uid: user.uid,
                        name: name,
                        email: email,
                        role: role
                    });
                })
                .then(() => {
                    alert('Sign up successful! Please log in.');
                    window.location.href = '/index.html';
                })
                .catch(error => {
                    errorMessage.textContent = error.message;
                });
        });
    }

    // --- Password Reset Form ---
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = resetForm.email.value;
            const errorMessage = document.getElementById('error-message');
            const successMessage = document.getElementById('success-message');
            errorMessage.textContent = '';
            successMessage.textContent = '';

            auth.sendPasswordResetEmail(email)
                .then(() => {
                    successMessage.textContent = 'Password reset email sent! Check your inbox.';
                })
                .catch(error => {
                    errorMessage.textContent = error.message;
                });
        });
    }
});

// --- Universal Logout Function ---
function logout() {
    auth.signOut().then(() => {
        window.location.href = '/index.html';
    });
}
api/create-order.js```javascript
const Razorpay = require('razorpay');
// This is a Node.js module, not browser JS. Vercel will run this.
// export default is the syntax Vercel expects.
export default async function handler(request, response) {
if (request.method !== 'POST') {
return response.status(405).json({ error: 'Method Not Allowed' });
}
code
Code
const { amount } = request.body;

// These environment variables MUST be set in your Vercel project settings
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
    return response.status(500).json({ error: 'Razorpay keys not configured on the server.' });
}

const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});

const options = {
    amount: amount * 100, // Amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
};

try {
    const order = await razorpay.orders.create(options);
    response.status(200).json(order);
} catch (error) {
    console.error('Razorpay order creation error:', error);
    response.status(500).json({ error: 'Failed to create Razorpay order' });
}
}
