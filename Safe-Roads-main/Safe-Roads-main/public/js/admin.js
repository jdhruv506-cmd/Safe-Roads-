// Logic for Admin Portal

// 1. Admin Login Submission
const loginForm = document.getElementById('admin-login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('admin-username').value;
        const pass = document.getElementById('admin-password').value;

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, password: pass })
            });
            const result = await response.json();

            if (result.success) {
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                window.location.href = '/admin-dashboard.html';
            } else {
                const errDiv = document.getElementById('login-error');
                errDiv.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to connect to server.');
        }
    });
}

// 2. Dashboard Navigation
function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-pane').forEach(el => {
        el.classList.remove('d-block');
        el.classList.add('d-none');
    });
    // Remove active class from sidebar links
    document.querySelectorAll('.sidebar a').forEach(el => el.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(`tab-${tabId}`).classList.remove('d-none');
    document.getElementById(`tab-${tabId}`).classList.add('d-block');
    // Highlight sidebar link
    event.currentTarget.classList.add('active');
}

// 3. Logout
function logoutAdmin() {
    sessionStorage.removeItem('isAdminLoggedIn');
    window.location.href = '/admin-login.html';
}

// 4. Fetch Dashboard Data
async function fetchDashboardData() {
    try {
        // Fetch Visitor Logs
        const logsRes = await fetch('/api/visitor-logs');
        const logs = await logsRes.json();
        const logsBody = document.getElementById('logs-table-body');
        if(logs.length === 0) {
            logsBody.innerHTML = `<tr><td colspan="3" class="text-center py-3 text-muted">No visits recorded yet.</td></tr>`;
        } else {
            logsBody.innerHTML = logs.map(l => `
                <tr>
                    <td class="fw-semibold">${l.ip || 'Unknown IP'}</td>
                    <td><span class="badge bg-secondary">${l.userAgent || 'Unknown Browser'}</span></td>
                    <td>${new Date(l.timestamp).toLocaleString()}</td>
                </tr>
            `).join('');
        }
        document.getElementById('stat-visits').innerText = logs.length;

        // Fetch Hazards
        const hazardsRes = await fetch('/api/all-hazards');
        const hazards = await hazardsRes.json();
        const hazBody = document.getElementById('hazards-table-body');
        if(hazards.error || hazards.length === 0) {
            hazBody.innerHTML = `<tr><td colspan="4" class="text-center py-3 text-muted">No hazards reported yet.</td></tr>`;
            document.getElementById('stat-hazards').innerText = '0';
        } else {
            hazBody.innerHTML = hazards.map(h => `
                <tr>
                    <td>
                        <span class="badge ${h.type === 'pothole' ? 'bg-danger' : 'bg-warning text-dark'}">
                            ${h.type.replace('_', ' ').toUpperCase()}
                        </span>
                    </td>
                    <td><a href="https://maps.google.com/?q=${h.lat},${h.lng}" target="_blank">${h.lat.toFixed(4)}, ${h.lng.toFixed(4)}</a></td>
                    <td>${h.description || '<em class="text-muted">No description</em>'}</td>
                    <td>${new Date(h.timestamp?._seconds ? h.timestamp._seconds*1000 : h.timestamp).toLocaleString()}</td>
                </tr>
            `).join('');
            document.getElementById('stat-hazards').innerText = hazards.length;
        }

        // Fetch Feedback
        const feedbackRes = await fetch('/api/feedback');
        const feedback = await feedbackRes.json();
        const feedBody = document.getElementById('feedback-table-body');
        if(feedback.error || feedback.length === 0) {
            feedBody.innerHTML = `<tr><td colspan="5" class="text-center py-3 text-muted">No feedback submitted yet.</td></tr>`;
            document.getElementById('stat-feedback').innerText = '0';
        } else {
            feedBody.innerHTML = feedback.map(f => `
                <tr>
                    <td class="fw-semibold">${f.name}</td>
                    <td>
                        <div><i class="fa-solid fa-envelope text-muted me-1"></i> ${f.email}</div>
                        <div><i class="fa-solid fa-phone text-muted me-1"></i> ${f.phone}</div>
                    </td>
                    <td><span class="badge bg-info text-dark">${f.category.toUpperCase()}</span></td>
                    <td>${f.message}</td>
                    <td>${new Date(f.timestamp?._seconds ? f.timestamp._seconds*1000 : f.timestamp).toLocaleString()}</td>
                </tr>
            `).join('');
            document.getElementById('stat-feedback').innerText = feedback.length;
        }

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}
