// Admin Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
    // --- Auth Guard ---
    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection('users').doc(user.uid).get().then(doc => {
                if (!doc.exists || doc.data().role !== 'admin') {
                    alert('Access Denied. You are not an admin.');
                    logout();
                } else {
                    // User is an admin, load the dashboard data
                    loadDashboardData();
                }
            });
        } else {
            window.location.href = '/index.html';
        }
    });

    // --- Logout ---
    document.getElementById('logout-button').addEventListener('click', logout);

    // --- Load Data ---
    function loadDashboardData() {
        // Count students
        db.collection('users').where('role', '==', 'student').get().then(snapshot => {
            document.getElementById('students-count').textContent = snapshot.size;
        });

        // Count and list teachers
        const teachersTable = document.querySelector('#teachers-table tbody');
        db.collection('users').where('role', '==', 'teacher').get().then(snapshot => {
            document.getElementById('teachers-count').textContent = snapshot.size;
            teachersTable.innerHTML = ''; // Clear table
            snapshot.forEach(doc => {
                const teacher = doc.data();
                const row = `<tr>
                    <td>${teacher.name}</td>
                    <td>${teacher.email}</td>
                    <td><button class="btn-danger" onclick="removeUser('${doc.id}')">Remove</button></td>
                </tr>`;
                teachersTable.innerHTML += row;
            });
        });
        
        // You can add more data loading logic here for fees, etc.
    }

    // --- Announcement Form ---
    const announcementForm = document.getElementById('announcement-form');
    announcementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = announcementForm['announcement-title'].value;
        const content = announcementForm['announcement-content'].value;

        db.collection('announcements').add({
            title: title,
            content: content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            showToast('Announcement posted successfully!', 'success');
            announcementForm.reset();
        }).catch(error => {
            showToast(`Error: ${error.message}`, 'error');
        });
    });
});

// --- Helper Functions ---
function removeUser(userId) {
    if (confirm('Are you sure you want to remove this user? This cannot be undone.')) {
        // Note: This only removes the Firestore record. For a full solution,
        // you would need a Cloud Function to delete the user from Firebase Auth.
        db.collection('users').doc(userId).delete()
            .then(() => {
                showToast('User removed from database.', 'success');
                window.location.reload(); // Reload to update the list
            })
            .catch(error => showToast(`Error: ${error.message}`, 'error'));
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'show';
    toast.classList.add(type);
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}
