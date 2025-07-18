// const apiKeysStore = require('../src/config/apiKeys.all.json');
require('dotenv').config({ path: '.env.local' });

const API_URL = 'http://localhost:3000/api/calculate';
const TEST_API_KEY = process.env.TEST_API_KEY;


const testData = {
    locations: [{
        city: "rio branco",
        country: "BR",
        affectedArea: 2
    }]
};

async function testApiKey(key: string, description: string) {
    console.log(`\nTesting: ${description}`);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': key
            },
            body: JSON.stringify(testData)
        });

        const data = await response.json();
        
        console.log('Status:', response.status);
        console.log('Rate Limit Remaining:', response.headers.get('x-ratelimit-remaining'));
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function runTests() {
    if (!TEST_API_KEY) {
        console.error('❌ TEST_API_KEY not found in .env.local');
        console.log('Add your test API key to .env.local:');
        console.log('TEST_API_KEY=your_key_here');
        return;
    }

    // Test valid key
    await testApiKey(
        TEST_API_KEY,
        'Valid API key'
    );

    // Test rate-limited key multiple times
    console.log('\nTesting rate limiting...');
    for (let i = 0; i < 8; i++) {
        await testApiKey(
            TEST_API_KEY,
            `Rate limit test #${i + 1}`
        );
        // Add small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Test invalid key
    await testApiKey(
        'invalid_key',
        'Invalid API key'
    );

    // Test missing key
    console.log('\nTesting missing API key');
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

runTests().catch(console.error);

export {};