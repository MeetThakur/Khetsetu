// Test without models/ prefix
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyCQHRFry2q34pMZ-2eqtjCiYd4Cxp92rL8';

async function testWithoutPrefix() {
    console.log('🧪 Testing gemini-2.5-flash (without models/ prefix)...\n');
    
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const result = await model.generateContent('Say "Test successful!"');
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ SUCCESS!');
        console.log('Response:', text);
        
    } catch (error) {
        console.log('❌ Failed:', error.message);
    }
}

testWithoutPrefix();
