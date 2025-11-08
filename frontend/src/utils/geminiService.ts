// Gemini API service - calls backend API (secure)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("Gemini service loaded, using backend API:", API_URL);

export async function askGemini(prompt: string): Promise<string> {
    console.log("Making backend API call for AI chat...");

    try {
        // Get auth token from localStorage
        const token = localStorage.getItem("authToken");

        if (!token) {
            throw new Error("Authentication required. Please log in.");
        }

        const response = await fetch(`${API_URL}/ai/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                message: prompt,
                context: {},
                conversationHistory: [],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Backend API error:", response.status, errorData);
            throw new Error(
                errorData.message || `API error: ${response.status}`,
            );
        }

        const data = await response.json();
        console.log("Backend API response received");

        if (data.success && data.data && data.data.response) {
            return data.data.response;
        }

        throw new Error("Invalid response format from backend");
    } catch (error) {
        console.error("Failed to call backend API:", error);
        throw error;
    }
}
