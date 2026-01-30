// Direct HTTP test of Gemini API
const https = require('https');

const API_KEY = 'AIzaSyCCg4cukdVkrdOSz7Kbsng7T1IO4Xt4Vg8';

function testAPI() {
    console.log('🧪 Direct API Test\n');
    
    // Try the v1 API (not v1beta)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    
    const data = JSON.stringify({
        contents: [{
            parts: [{ text: 'Say hello' }]
        }]
    });
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };
    
    console.log('Testing v1 API endpoint...\n');
    
    const req = https.request(url, options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        
        res.on('end', () => {
            console.log(`Status Code: ${res.statusCode}\n`);
            
            if (res.statusCode === 200) {
                console.log('✅ SUCCESS! API Key works with v1 API!');
                const parsed = JSON.parse(responseData);
                console.log('Response:', parsed.candidates[0].content.parts[0].text);
                console.log('\n🎉 Use v1 API, not v1beta!');
            } else {
                console.log('❌ Failed');
                console.log('Response:', responseData);
                
                try {
                    const error = JSON.parse(responseData);
                    console.log('\nError details:', JSON.stringify(error, null, 2));
                } catch (e) {
                    // Not JSON
                }
            }
        });
    });
    
    req.on('error', (error) => {
        console.error('Request error:', error.message);
    });
    
    req.write(data);
    req.end();
}

testAPI();
