// Check if API key is valid by listing available models
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyCCg4cukdVkrdOSz7Kbsng7T1IO4Xt4Vg8';

async function checkAPIKey() {
    console.log('🔍 Checking API Key Validity...\n');
    console.log('API Key:', API_KEY.substring(0, 20) + '...\n');
    
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        // Try to list models
        console.log('Attempting to list available models...');
        const models = await genAI.listModels();
        
        console.log('\n✅ API Key is VALID!');
        console.log('\nAvailable models:');
        models.forEach(model => {
            console.log(`  - ${model.name}`);
        });
        
    } catch (error) {
        console.log('\n❌ API Key Check Failed!');
        console.log('Error:', error.message);
        
        if (error.message?.includes('403')) {
            console.log('\n🔴 ISSUE: API Key is not authorized');
            console.log('This means:');
            console.log('  1. The API key is invalid or expired');
            console.log('  2. The Generative Language API is not enabled');
            console.log('  3. The API key has restrictions');
            console.log('\n✅ SOLUTION:');
            console.log('  Go to: https://aistudio.google.com/app/apikey');
            console.log('  Create a NEW API key in a NEW project');
            console.log('  Make sure to test it in AI Studio first!');
        } else if (error.message?.includes('404')) {
            console.log('\n🔴 ISSUE: API endpoint not found');
            console.log('The Generative Language API might not be properly enabled');
        } else {
            console.log('\n🔴 Unknown error occurred');
            console.log('Full error:', JSON.stringify(error, null, 2));
        }
    }
}

checkAPIKey();
