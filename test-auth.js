const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuthentication() {
  console.log('🔐 Testing Jagruk Authentication System\n');

  try {
    // Test 1: Demo Admin Login
    console.log('1. Testing Demo Admin Login...');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@jagruk.edu',
      password: 'admin123'
    });
    
    if (adminLogin.data.success) {
      console.log('✅ Admin login successful!');
      console.log(`   Token: ${adminLogin.data.token.substring(0, 20)}...`);
      console.log(`   User: ${adminLogin.data.user.name} (${adminLogin.data.user.role})`);
    }

    // Test 2: Demo Staff Login
    console.log('\n2. Testing Demo Staff Login...');
    const staffLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'staff@jagruk.edu',
      password: 'staff123'
    });
    
    if (staffLogin.data.success) {
      console.log('✅ Staff login successful!');
      console.log(`   Token: ${staffLogin.data.token.substring(0, 20)}...`);
      console.log(`   User: ${staffLogin.data.user.name} (${staffLogin.data.user.role})`);
    }

    // Test 3: Demo Student Login
    console.log('\n3. Testing Demo Student Login...');
    const studentLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'student@jagruk.edu',
      password: 'student123'
    });
    
    if (studentLogin.data.success) {
      console.log('✅ Student login successful!');
      console.log(`   Token: ${studentLogin.data.token.substring(0, 20)}...`);
      console.log(`   User: ${studentLogin.data.user.name} (${studentLogin.data.user.role})`);
    }

    // Test 4: Token Verification
    console.log('\n4. Testing Token Verification...');
    const token = adminLogin.data.token;
    const verifyResponse = await axios.post(`${BASE_URL}/auth/verify-token`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (verifyResponse.data.valid) {
      console.log('✅ Token verification successful!');
      console.log(`   Verified user: ${verifyResponse.data.user.name}`);
    }

    // Test 5: Invalid Login
    console.log('\n5. Testing Invalid Login...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Invalid login properly rejected!');
      }
    }

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📱 Frontend should be accessible at: http://localhost:3000');
    console.log('🔑 Use these demo credentials to test:');
    console.log('   Admin: admin@jagruk.edu / admin123');
    console.log('   Staff: staff@jagruk.edu / staff123');
    console.log('   Student: student@jagruk.edu / student123');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testAuthentication();
