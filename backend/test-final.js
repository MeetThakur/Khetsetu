// Test the corrected model name
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyCCg4cukdVkrdOSz7Kbsng7T1IO4Xt4Vg8';

async function testCorrectModel() {
    console.log('🧪 Testing models/gemini-2.5-flash...\n');
    
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
        
        const result = await model.generateContent('Say "KhetSetu AI is working!" in one sentence.');
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ SUCCESS! Gemini API is now working!\n');
        console.log('Response:', text);
        console.log('\n🎉 Your AI chatbot is ready to use!');
        
    } catch (error) {
        console.log('❌ Failed:', error.message);
    }
}

testCorrectModel();
