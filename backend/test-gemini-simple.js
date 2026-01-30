// Simpler test with better error handling
const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = 'AIzaSyDUHkHpNgrOVvw6sH9SFQcRMTzc_HfIwrg';

async function testGemini() {
    console.log('Testing Gemini API...\n');
    
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        
        // Try gemini-pro first (more widely available)
        console.log('Trying model: gemini-pro');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        const text = response.text();
        
        console.log('\n✅ SUCCESS with gemini-pro!');
        console.log('Response:', text);
        
    } catch (error) {
        console.log('\n❌ FAILED with gemini-pro');
        console.log('Error:', error.message);
        console.log('\nFull error object:');
        console.log(JSON.stringify(error, null, 2));
    }
}

testGemini();
