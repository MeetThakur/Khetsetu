// Test the CURRENT API key from .env
const { GoogleGenerativeAI } = require('@google/generative-ai');

const CURRENT_API_KEY = 'AIzaSyCQHRFry2q34pMZ-2eqtjCiYd4Cxp92rL8';

async function testCurrentKey() {
    console.log('🔑 Testing CURRENT API Key from .env...\n');
    console.log('API Key:', CURRENT_API_KEY.substring(0, 20) + '...\n');
    
    try {
        const genAI = new GoogleGenerativeAI(CURRENT_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
        
        console.log('📡 Sending test request...');
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        const text = response.text();
        
        console.log('\n✅ SUCCESS! This API key works!');
        console.log('Response:', text);
        
    } catch (error) {
        console.log('\n❌ FAILED! This API key does NOT work!');
        console.log('Error:', error.message);
        
        if (error.message?.includes('403')) {
            console.log('\n🔴 This API key needs the Generative Language API enabled!');
            console.log('\nUse the OLD working key instead:');
            console.log('AIzaSyCCg4cukdVkrdOSz7Kbsng7T1IO4Xt4Vg8');
        }
    }
}

testCurrentKey();
