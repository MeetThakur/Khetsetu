// Test different Gemini models to find which one works
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyCCg4cukdVkrdOSz7Kbsng7T1IO4Xt4Vg8';

const modelsToTry = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-pro',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro'
];

async function testModels() {
    console.log('🔍 Testing different Gemini models...\n');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    for (const modelName of modelsToTry) {
        try {
            console.log(`Testing: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say hi');
            const response = await result.response;
            const text = response.text();
            
            console.log(`✅ SUCCESS with ${modelName}!`);
            console.log(`Response: ${text}\n`);
            console.log(`🎉 USE THIS MODEL: ${modelName}\n`);
            return modelName;
            
        } catch (error) {
            console.log(`❌ Failed: ${error.message.substring(0, 100)}...\n`);
        }
    }
    
    console.log('❌ None of the models worked!');
}

testModels();
