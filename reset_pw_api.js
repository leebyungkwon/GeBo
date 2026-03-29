async function resetPassword() {
    try {
        const loginRes = await fetch('http://localhost:8002/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@bo.com', password: 'admin1234' })
        });

        if (!loginRes.ok) throw new Error("Login failed");
        const loginData = await loginRes.json();
        const token = loginData.accessToken;

        const adminsRes = await fetch('http://localhost:8002/api/v1/admins', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const admins = await adminsRes.json();
        const targetAdmin = admins.find(a => a.email === 'admin1@bo.com');

        if (!targetAdmin) {
            console.log("admin1@bo.com not found!");
            return;
        }

        const updateRes = await fetch(`http://localhost:8002/api/v1/admins/${targetAdmin.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: targetAdmin.name,
                employeeId: targetAdmin.employeeId,
                role: targetAdmin.role,
                password: 'admin1234'
            })
        });

        if (updateRes.ok) {
            console.log("Password successfully updated to admin1234");
        } else {
            console.error("Failed to update password:", updateRes.status);
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

resetPassword();
