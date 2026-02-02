const axios = require('axios');

const base = 'http://localhost:5000/api';

(async () => {
  try {
    console.log('Testing register with unique email...');
    const regResp = await axios.post(`${base}/auth/register`, {
      username: `apitest_${Date.now()}`,
      email: `apitest_${Date.now()}@example.com`,
      password: 'Test1234!',
      confirmPassword: 'Test1234!'
    }, { timeout: 5000 });

    console.log('REGISTER STATUS', regResp.status);
    console.log(JSON.stringify(regResp.data, null, 2));
  } catch (err) {
    console.error('REGISTER ERROR', err.response ? err.response.status : '', err.response ? err.response.data : err.message);
  }

  try {
    console.log('\nTesting login with seeded user testuser@example.com...');
    const loginResp = await axios.post(`${base}/auth/login`, {
      email: 'testuser@example.com',
      password: 'Test1234!'
    }, { timeout: 5000 });

    console.log('LOGIN STATUS', loginResp.status);
    console.log(JSON.stringify(loginResp.data, null, 2));
  } catch (err) {
    console.error('LOGIN ERROR', err.response ? err.response.status : '', err.response ? err.response.data : err.message);
  }

  try {
    console.log('\nChecking health endpoint...');
    const h = await axios.get(`${base}/health`, { timeout: 3000 });
    console.log('HEALTH', h.status, h.data);
  } catch (err) {
    console.error('HEALTH ERROR', err.message || err);
  }

  process.exit(0);
})();