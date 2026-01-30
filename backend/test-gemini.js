// Test Gemini API Key
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = "AIzaSyDUHkHpNgrOVvw6sH9SFQcRMTzc_HfIwrg";

async function testGeminiAPI() {
  console.log("🧪 Testing Gemini API Key...\n");

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log("📡 Sending test request to Gemini API...");
    const result = await model.generateContent(
      'Say "Hello from KhetSetu!" in one sentence.',
    );
    const response = await result.response;
    const text = response.text();

    console.log("✅ SUCCESS! Gemini API is working!\n");
    console.log("Response:", text);
    console.log("\n✨ Your Gemini API key is valid and working correctly!");
  } catch (error) {
    console.error("❌ ERROR: Gemini API test failed!\n");
    console.error("Error details:", error.message);

    if (error.message?.includes("API key")) {
      console.error("\n🔑 Issue: Invalid API key");
      console.error("Solution: Check if your API key is correct");
    } else if (
      error.message?.includes("quota") ||
      error.message?.includes("429")
    ) {
      console.error("\n📊 Issue: API quota exceeded");
      console.error("Solution: Check your Google AI Studio quota");
    } else if (error.message?.includes("model")) {
      console.error("\n🤖 Issue: Model not available");
      console.error(
        'Solution: Try using "gemini-pro" instead of "gemini-2.0-flash"',
      );
    } else {
      console.error("\n🌐 Issue: Network or other error");
      console.error("Full error:", error);
    }
  }
}

testGeminiAPI();
