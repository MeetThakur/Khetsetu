export interface PestAnalysisResult {
    pestType: string;
    confidence: number;
    severity: "Low" | "Medium" | "High" | "Critical";
    characteristics: string[];
    treatments: string[];
    affectedCrops: string[];
    pestDetails: {
        scientificName: string;
        commonNames: string[];
        lifecycle: string;
        damageType: string;
    };
    preventiveMeasures: string[];
    urgencyLevel: "Immediate" | "Within 24 hours" | "Within a week" | "Monitor";
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const analyzePestImage = async (
    imageFile: File,
): Promise<PestAnalysisResult> => {
    try {
        // Get auth token
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication required. Please log in.");
        }

        // Convert image to base64
        const base64Image = await convertImageToBase64(imageFile);

        // Call backend API for pest identification
        const response = await fetch(`${API_URL}/ai/identify-pest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                crop: "Unknown", // Can be updated to accept crop parameter
                symptoms: "See uploaded image",
                location: {
                    state: "Unknown",
                    district: "Unknown",
                },
                season: getCurrentSeason(),
                imageData: base64Image,
                imageDescription: "Pest damage visible on crop",
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
            // Map backend response to PestAnalysisResult format
            const backendData = data.data;

            return {
                pestType:
                    backendData.identification?.name || "Unidentified Pest",
                confidence: backendData.confidence || 50,
                severity: mapSeverityLevel(backendData.severity),
                characteristics: extractCharacteristics(backendData),
                treatments: extractTreatments(backendData.treatment),
                affectedCrops: ["Multiple crops"], // Backend doesn't provide this
                pestDetails: {
                    scientificName:
                        backendData.identification?.scientificName ||
                        backendData.identification?.name ||
                        "Unknown",
                    commonNames: [
                        backendData.identification?.name || "Unidentified",
                    ],
                    lifecycle:
                        backendData.identification?.lifecycle || "Unknown",
                    damageType:
                        backendData.identification?.damageType ||
                        "General plant damage",
                },
                preventiveMeasures: backendData.treatment?.preventive || [
                    "Regular field monitoring",
                    "Maintain field hygiene",
                ],
                urgencyLevel: mapUrgencyLevel(backendData.severity),
            };
        }

        throw new Error("Invalid response format from backend");
    } catch (error) {
        console.error("Error analyzing pest image:", error);

        // Return default analysis on error
        return {
            pestType: "Unidentified Pest",
            confidence: 50,
            severity: "Medium",
            characteristics: [
                "Unable to analyze image",
                "Please try again or consult an expert",
            ],
            treatments: [
                "Consult local agricultural extension officer",
                "Take clear photos in good lighting",
            ],
            affectedCrops: ["Multiple crops"],
            pestDetails: {
                scientificName: "Unknown",
                commonNames: ["Unidentified"],
                lifecycle: "Unknown",
                damageType: "General plant damage",
            },
            preventiveMeasures: [
                "Regular field monitoring",
                "Maintain field hygiene",
                "Use resistant varieties",
            ],
            urgencyLevel: "Within 24 hours",
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

// Helper function to get current season
const getCurrentSeason = (): string => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return "summer";
    if (month >= 6 && month <= 9) return "monsoon";
    if (month >= 10 && month <= 11) return "post-monsoon";
    return "winter";
};

// Helper function to map severity level
const mapSeverityLevel = (
    severity: string | undefined,
): "Low" | "Medium" | "High" | "Critical" => {
    const severityLower = (severity || "medium").toLowerCase();
    if (severityLower.includes("critical")) return "Critical";
    if (severityLower.includes("high") || severityLower.includes("severe"))
        return "High";
    if (severityLower.includes("low") || severityLower.includes("mild"))
        return "Low";
    return "Medium";
};

// Helper function to map urgency level
const mapUrgencyLevel = (
    severity: string | undefined,
): "Immediate" | "Within 24 hours" | "Within a week" | "Monitor" => {
    const severityLower = (severity || "medium").toLowerCase();
    if (severityLower.includes("critical")) return "Immediate";
    if (severityLower.includes("high") || severityLower.includes("severe"))
        return "Within 24 hours";
    if (severityLower.includes("low") || severityLower.includes("mild"))
        return "Monitor";
    return "Within a week";
};

// Helper function to extract characteristics
const extractCharacteristics = (backendData: any): string[] => {
    const characteristics: string[] = [];

    if (backendData.identification?.description) {
        characteristics.push(backendData.identification.description);
    }

    if (backendData.identification?.symptoms) {
        if (Array.isArray(backendData.identification.symptoms)) {
            characteristics.push(...backendData.identification.symptoms);
        } else {
            characteristics.push(backendData.identification.symptoms);
        }
    }

    if (characteristics.length === 0) {
        characteristics.push("Pest damage visible on crop");
    }

    return characteristics;
};

// Helper function to extract treatments
const extractTreatments = (treatment: any): string[] => {
    const treatments: string[] = [];

    if (treatment?.immediate) {
        if (Array.isArray(treatment.immediate)) {
            treatments.push(...treatment.immediate);
        } else {
            treatments.push(treatment.immediate);
        }
    }

    if (treatment?.organic) {
        if (Array.isArray(treatment.organic)) {
            treatments.push(...treatment.organic);
        }
    }

    if (treatment?.chemical) {
        if (Array.isArray(treatment.chemical)) {
            treatments.push(...treatment.chemical);
        }
    }

    if (treatments.length === 0) {
        treatments.push("Consult local agricultural extension officer");
    }

    return treatments;
};
