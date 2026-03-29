async function testLogin() {
    try {
        const response = await fetch('http://localhost:8002/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin1@bo.com', password: 'admin1234' })
        });

        console.log('Login Status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('Login Success! Token received:', !!data.accessToken);

            // Fetch admins to trigger 403
            const adminRes = await fetch('http://localhost:8002/api/v1/admins', {
                headers: { 'Authorization': `Bearer ${data.accessToken}` }
            });
            console.log('Admin Fetch Status:', adminRes.status);
        } else {
            console.log('Login failed response:', await response.text());
        }
    } catch (e) {
        console.error('Error:', e);
    }
}
testLogin();
