async function test() {
    try {
        const loginRes = await fetch('http://localhost:8002/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@bo.com', password: 'admin1234' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);

        const loginData = await loginRes.json();
        const token = loginData.accessToken;
        console.log('Login Success! Token obtained.');
        console.log('Token Payload role:', JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8')).role);

        const adminsRes = await fetch('http://localhost:8002/api/v1/admins', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!adminsRes.ok) throw new Error(`Fetch failed: ${adminsRes.status}`);

        const adminsData = await adminsRes.json();
        console.log('Admins Data length:', adminsData.length);
        console.log('Admins Data:', JSON.stringify(adminsData, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
