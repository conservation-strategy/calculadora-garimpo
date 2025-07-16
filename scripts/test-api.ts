const devApiKeys = require('../src/config/apiKeys.development.json');

const API_URL = 'http://localhost:3000/api/calculate';

const testData = {
    locations: [{
        city: "Alta Floresta D'Oeste",
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
    // Test valid key
    await testApiKey(
        devApiKeys.keys[0].key,
        'Valid API key'
    );

    // Test rate-limited key multiple times
    const limitedKey = devApiKeys.keys[1].key;
    console.log('\nTesting rate limiting...');
    for (let i = 0; i < 7; i++) {
        await testApiKey(
            limitedKey,
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