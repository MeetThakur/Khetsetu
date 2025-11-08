export interface SoilAnalysisResult {
    soilType: string;
    ph: number;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    organicMatter: string;
    moisture: string;
    texture: string;
    color: string;
    recommendations: string[];
    suitableCrops: string[];
    improvements: string[];
    fertility: "Poor" | "Low" | "Medium" | "Good" | "Excellent";
    confidence: number;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const analyzeSoilImage = async (
    imageFile: File,
): Promise<SoilAnalysisResult> => {
    try {
        // Get auth token
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication required. Please log in.");
        }

        // Convert image to base64
        const base64Image = await convertImageToBase64(imageFile);

        // Call backend API for soil analysis
        const response = await fetch(`${API_URL}/ai/analyze-soil`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ph: null, // Image-based analysis
                nitrogen: null,
                phosphorus: null,
                potassium: null,
                organicMatter: null,
                soilType: "Unknown",
                location: {
                    state: "Unknown",
                    district: "Unknown",
                },
                intendedCrop: "General farming",
                imageData: base64Image,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `API error: ${response.status}`,
            );
        }

        const data = await response.json();

        if (data.success && data.data) {
            const backendData = data.data;

            // Map backend response to SoilAnalysisResult format
            return {
                soilType: backendData.analysis?.soilType || "Unknown",
                ph:
                    backendData.testData?.ph ||
                    estimatePHFromAnalysis(backendData),
                nitrogen: extractNutrientLevel(backendData, "nitrogen"),
                phosphorus: extractNutrientLevel(backendData, "phosphorus"),
                potassium: extractNutrientLevel(backendData, "potassium"),
                organicMatter: extractOrganicMatter(backendData),
                moisture: "Medium", // Default, can't determine from image
                texture: backendData.analysis?.texture || "Unknown",
                color: backendData.analysis?.color || "Unknown",
                recommendations: extractRecommendations(backendData),
                suitableCrops: extractSuitableCrops(backendData),
                improvements: extractImprovements(backendData),
                fertility: mapFertilityLevel(backendData.analysis?.overall),
                confidence: 75, // Default confidence for image-based analysis
            };
        }

        throw new Error("Invalid response format from backend");
    } catch (error) {
        console.error("Error analyzing soil image:", error);

        // Return default analysis on error
        return {
            soilType: "Unable to determine",
            ph: 7.0,
            nitrogen: "Unknown",
            phosphorus: "Unknown",
            potassium: "Unknown",
            organicMatter: "Unknown",
            moisture: "Medium",
            texture: "Unable to determine from image",
            color: "Unable to determine from image",
            recommendations: [
                "Unable to analyze image clearly",
                "Please take a clear photo of the soil sample",
                "Ensure good lighting conditions",
                "Consider getting a professional soil test",
            ],
            suitableCrops: ["Consult local agricultural expert"],
            improvements: [
                "Get a laboratory soil test for accurate results",
                "Take multiple samples from different locations",
            ],
            fertility: "Medium",
            confidence: 30,
        };
    }
};

// Helper function to convert image file to base64
const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                // Remove the data URL prefix to get pure base64
                const base64 = (reader.result as string).split(",")[1];
                resolve(base64);
            } else {
                reject(new Error("Failed to read file"));
            }
        };
        reader.onerror = () => reject(new Error("Error reading file"));
        reader.readAsDataURL(file);
    });
};

// Helper function to estimate pH from analysis
const estimatePHFromAnalysis = (backendData: any): number => {
    const phData = backendData.analysis?.ph;
    if (phData?.value) return phData.value;
    if (phData?.level) {
        const level = phData.level.toLowerCase();
        if (level.includes("acidic")) return 5.5;
        if (level.includes("alkaline")) return 8.0;
        return 7.0; // Neutral
    }
    return 7.0; // Default neutral
};

// Helper function to extract nutrient level
const extractNutrientLevel = (backendData: any, nutrient: string): string => {
    const analysis = backendData.analysis?.[nutrient];
    if (analysis?.level) return analysis.level;
    if (analysis?.status) return analysis.status;
    return "Unknown";
};

// Helper function to extract organic matter
const extractOrganicMatter = (backendData: any): string => {
    const om = backendData.analysis?.organicMatter;
    if (om?.level) return om.level;
    if (om?.percentage) return `${om.percentage}%`;
    return "Unknown";
};

// Helper function to extract recommendations
const extractRecommendations = (backendData: any): string[] => {
    const recommendations: string[] = [];

    // From fertilizers
    if (backendData.recommendations?.fertilizers) {
        if (Array.isArray(backendData.recommendations.fertilizers)) {
            recommendations.push(
                ...backendData.recommendations.fertilizers.map(
                    (f: any) => f.name || f.toString(),
                ),
            );
        }
    }

    // From amendments
    if (backendData.recommendations?.amendments) {
        if (Array.isArray(backendData.recommendations.amendments)) {
            recommendations.push(...backendData.recommendations.amendments);
        }
    }

    // From practices
    if (backendData.recommendations?.practices) {
        if (Array.isArray(backendData.recommendations.practices)) {
            recommendations.push(...backendData.recommendations.practices);
        }
    }

    // From general recommendations
    if (backendData.analysis?.recommendations) {
        if (Array.isArray(backendData.analysis.recommendations)) {
            recommendations.push(...backendData.analysis.recommendations);
        }
    }

    if (recommendations.length === 0) {
        recommendations.push(
            "Get a professional soil test for detailed recommendations",
        );
    }

    return recommendations;
};

// Helper function to extract suitable crops
const extractSuitableCrops = (backendData: any): string[] => {
    const crops: string[] = [];

    if (backendData.suitability?.bestCrops) {
        if (Array.isArray(backendData.suitability.bestCrops)) {
            crops.push(...backendData.suitability.bestCrops);
        }
    }

    if (backendData.suitability?.suitableCrops) {
        if (Array.isArray(backendData.suitability.suitableCrops)) {
            crops.push(...backendData.suitability.suitableCrops);
        }
    }

    if (crops.length === 0) {
        crops.push("Rice", "Wheat", "Vegetables", "Pulses");
    }

    return crops;
};

// Helper function to extract improvements
const extractImprovements = (backendData: any): string[] => {
    const improvements: string[] = [];

    if (backendData.suitability?.improvements) {
        if (Array.isArray(backendData.suitability.improvements)) {
            improvements.push(...backendData.suitability.improvements);
        }
    }

    if (backendData.recommendations?.amendments) {
        if (Array.isArray(backendData.recommendations.amendments)) {
            improvements.push(...backendData.recommendations.amendments);
        }
    }

    if (improvements.length === 0) {
        improvements.push(
            "Regular addition of organic matter",
            "Proper crop rotation",
            "Maintain soil moisture",
        );
    }

    return improvements;
};

// Helper function to map fertility level
const mapFertilityLevel = (
    overall: string | undefined,
): "Poor" | "Low" | "Medium" | "Good" | "Excellent" => {
    if (!overall) return "Medium";

    const overallLower = overall.toLowerCase();
    if (overallLower.includes("excellent")) return "Excellent";
    if (overallLower.includes("good") || overallLower.includes("high"))
        return "Good";
    if (overallLower.includes("poor") || overallLower.includes("very low"))
        return "Poor";
    if (overallLower.includes("low") || overallLower.includes("fair"))
        return "Low";
    return "Medium";
};
