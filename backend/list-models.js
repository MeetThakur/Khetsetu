// List available Gemini models
const https = require('https');

const API_KEY = 'AIzaSyCCg4cukdVkrdOSz7Kbsng7T1IO4Xt4Vg8';

function listModels() {
    console.log('📋 Listing Available Gemini Models...\n');
    
    // Try v1 API
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;
    
    https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`Status Code: ${res.statusCode}\n`);
            
            if (res.statusCode === 200) {
                const parsed = JSON.parse(data);
                console.log('✅ Available Models:\n');
                
                if (parsed.models && parsed.models.length > 0) {
                    parsed.models.forEach(model => {
                        console.log(`  📦 ${model.name}`);
                        if (model.displayName) {
                            console.log(`     Display: ${model.displayName}`);
                        }
                        if (model.supportedGenerationMethods) {
                            console.log(`     Methods: ${model.supportedGenerationMethods.join(', ')}`);
                        }
                        console.log('');
                    });
                    
                    // Find models that support generateContent
                    const contentModels = parsed.models.filter(m => 
                        m.supportedGenerationMethods && 
                        m.supportedGenerationMethods.includes('generateContent')
                    );
                    
                    if (contentModels.length > 0) {
                        console.log('\n🎯 Recommended model for KhetSetu:');
                        console.log(`   ${contentModels[0].name}\n`);
                    }
                } else {
                    console.log('No models found in response');
                    console.log('Response:', JSON.stringify(parsed, null, 2));
                }
            } else {
                console.log('❌ Failed to list models');
                console.log('Response:', data);
                
                try {
                    const error = JSON.parse(data);
                    console.log('\nError:', error.error.message);
                    
                    if (error.error.status === 'PERMISSION_DENIED') {
                        console.log('\n🔴 API Key does not have permission');
                        console.log('Solution: Create a new API key at https://aistudio.google.com/app/apikey');
                    }
                } catch (e) {
                    // Not JSON
                }
            }
        });
    }).on('error', (error) => {
        console.error('Request error:', error.message);
    });
}

listModels();
