// Test with the new API key
const { GoogleGenerativeAI } = require('@google/generative-ai');

const NEW_API_KEY = 'AIzaSyCCg4cukdVkrdOSz7Kbsng7T1IO4Xt4Vg8';

async function testNewKey() {
    console.log('🔑 Testing NEW Gemini API Key...\n');
    console.log('API Key:', NEW_API_KEY.substring(0, 20) + '...\n');
    
    try {
        const genAI = new GoogleGenerativeAI(NEW_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        console.log('📡 Sending request to Gemini API...');
        const result = await model.generateContent('Say hello in one word');
        const response = await result.response;
        const text = response.text();
        
        console.log('\n✅ SUCCESS! API Key is working!');
        console.log('Response:', text);
        console.log('\n🎉 Your Gemini API is now configured correctly!');
        
    } catch (error) {
        console.log('\n❌ FAILED! API Key is NOT working\n');
        console.log('Error message:', error.message);
        
        if (error.message?.includes('API key not valid')) {
            console.log('\n🔴 ISSUE: Invalid API Key');
            console.log('\n📋 STEPS TO FIX:');
            console.log('1. Go to: https://aistudio.google.com/app/apikey');
            console.log('2. Make sure you are signed in to your Google account');
            console.log('3. Click "Create API Key"');
            console.log('4. Select "Create API key in new project"');
            console.log('5. Copy the ENTIRE API key (starts with AIza...)');
            console.log('6. Update backend\\.env line 43');
            console.log('7. Restart the backend server\n');
        } else if (error.message?.includes('403')) {
            console.log('\n🔴 ISSUE: API not enabled or restricted');
            console.log('Solution: Enable Generative Language API in Google Cloud Console');
        }
        
        console.log('\n📄 Full error details:');
        console.log(JSON.stringify(error, null, 2));
    }
}

testNewKey();
