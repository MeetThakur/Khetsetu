const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface FarmInput {
    budget: number;
    season: string;
    soilType: string;
    farmSize: number;
    weather: string;
    state: string;
    district: string;
    location?: {
        state: string;
        district: string;
    };
    experience?: string;
    farmingMethod?: string;
    waterAvailability?: string;
    laborAvailability?: string;
    constraints?: Record<string, unknown>;
}

interface BackendRecommendation {
    crop: string;
    suitabilityScore: number;
    expectedYield?: string;
    profitability?: {
        roi?: string;
        totalInvestment?: number;
    };
    requirements?: string[];
    culturalPractices?: string[];
    timeline?: {
        duration?: number;
    };
}

export const generateCropRecommendations = async (farmInput: FarmInput) => {
    try {
        const {
            budget,
            season,
            soilType,
            farmSize,
            weather,
            location = { state: "Unknown", district: "Unknown" },
        } = farmInput;

        // Get auth token
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication required. Please log in.");
        }

        // Call backend crop-advice endpoint
        const response = await fetch(`${API_URL}/ai/crop-advice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                budget: Number(budget),
                farmSize: Number(farmSize),
                soilType,
                location,
                season,
                experience: "intermediate",
                farmingMethod: "conventional",
                waterAvailability: weather?.toLowerCase().includes("rain")
                    ? "abundant"
                    : "moderate",
                laborAvailability: "moderate",
                constraints: {},
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `API error: ${response.status}`,
            );
        }

        const data = await response.json();

        if (data.success && data.data && data.data.recommendations) {
            // Map backend response to expected format
            return data.data.recommendations.map(
                (rec: BackendRecommendation) => ({
                    name: rec.crop,
                    suitability:
                        rec.suitabilityScore >= 85
                            ? "High"
                            : rec.suitabilityScore >= 70
                              ? "Medium"
                              : "Low",
                    expectedYield:
                        rec.expectedYield ||
                        `${rec.timeline?.duration || 90} days`,
                    roi: rec.profitability?.roi || "60-80%",
                    requirements: rec.requirements?.slice(0, 3) || [
                        "Well-drained soil",
                        "Regular watering",
                        "Pest monitoring",
                    ],
                    tips: rec.culturalPractices?.slice(0, 3) || [
                        "Use quality seeds",
                        "Monitor regularly",
                        "Timely harvest",
                    ],
                    estimatedCost:
                        rec.profitability?.totalInvestment ||
                        Math.round(Number(budget) * 0.8),
                    suitabilityScore: `${rec.suitabilityScore || 80}/100`,
                }),
            );
        }

        throw new Error("Invalid response format from backend");
    } catch (error) {
        console.error("Gemini API error, using mock data:", error);

        // Fallback mock data
        const { budget, season, soilType, farmSize, weather } = farmInput;
        // Fallback to mock recommendations when backend fails
        console.log("Using fallback recommendations for:", {
            season,
            soilType,
            farmSize,
            weather,
            budget,
        });

        // This is fallback mock data logic - kept for offline mode
        const mockResponse = JSON.stringify([
            {
                name: "Rice",
                suitability: "High",
                expectedYield: "40-50 quintals/hectare",
                roi: "₹60,000 - ₹80,000",
                requirements: [
                    "Well-drained clay soil",
                    "Consistent water supply",
                    "Warm weather",
                ],
                tips: [
                    "Use certified seeds",
                    "Implement SRI method",
                    "Monitor for pests",
                ],
                estimatedCost: Math.round(Number(budget) * 0.25),
                suitabilityScore: "90/100",
            },
            {
                name: "Wheat",
                suitability: "High",
                expectedYield: "35-45 quintals/hectare",
                roi: "₹50,000 - ₹70,000",
                requirements: [
                    "Loamy soil",
                    "Cool weather",
                    "Moderate irrigation",
                ],
                tips: [
                    "Sow in November-December",
                    "Use balanced fertilizers",
                    "Timely harvest",
                ],
                estimatedCost: Math.round(Number(budget) * 0.25),
                suitabilityScore: "85/100",
            },
        ]);

        const response = mockResponse;
        try {
            // Extract JSON from markdown code blocks if present
            let jsonString = response.trim();

            // Remove markdown code blocks
            jsonString = jsonString
                .replace(/```json\s*/g, "")
                .replace(/\s*```/g, "");

            // Remove any leading/trailing text that might not be JSON
            const jsonStart = jsonString.indexOf("[");
            const jsonEnd = jsonString.lastIndexOf("]");

            if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
                jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
            }

            // Clean up any formatting issues
            jsonString = jsonString.replace(/\n\s*/g, " ").replace(/\s+/g, " ");

            console.log(
                "Attempting to parse JSON:",
                jsonString.substring(0, 200) + "...",
            );

            const recommendations = JSON.parse(jsonString);

            // Validate and clean the recommendations
            if (Array.isArray(recommendations)) {
                const validRecommendations = recommendations.map(
                    (rec, index) => {
                        const processedRec = {
                            name: rec.name || `Recommended Crop ${index + 1}`,
                            suitability: rec.suitability || "Medium",
                            expectedYield:
                                rec.expectedYield || "Yield data processing",
                            roi: rec.roi || "₹25,000 - ₹40,000",
                            requirements: Array.isArray(rec.requirements)
                                ? rec.requirements
                                : ["Standard farming practices required"],
                            tips: Array.isArray(rec.tips)
                                ? rec.tips
                                : ["Follow local agricultural guidance"],
                            estimatedCost:
                                typeof rec.estimatedCost === "string"
                                    ? parseInt(
                                          rec.estimatedCost.replace(
                                              /[^0-9]/g,
                                              "",
                                          ),
                                      ) || 25000
                                    : rec.estimatedCost || 25000,
                            suitabilityScore:
                                rec.suitabilityScore || `${85 - index * 5}/100`,
                        };

                        // Comprehensive ROI adjustments based on crop, soil, and weather
                        const cropName = processedRec.name.toLowerCase();
                        console.log(
                            `Applying comprehensive adjustments for ${cropName} in ${soilType} soil and ${weather} weather`,
                        );

                        // Extract numbers from ROI string
                        const roiMatch = processedRec.roi.match(
                            /₹([\d,]+)\s*[-–]\s*₹([\d,]+)/,
                        );
                        if (roiMatch) {
                            const minROI = parseInt(
                                roiMatch[1].replace(/,/g, ""),
                            );
                            const maxROI = parseInt(
                                roiMatch[2].replace(/,/g, ""),
                            );
                            let adjustmentFactor = 1.0;
                            let tipMessage = "";

                            // Rice adjustments
                            if (cropName.includes("rice")) {
                                // Weather adjustments for rice
                                if (weather === "rainy") {
                                    adjustmentFactor *= 1.2; // 20% boost
                                    tipMessage =
                                        "Optimal water conditions in rainy season maximize rice yields";
                                } else if (weather === "hot_humid") {
                                    adjustmentFactor *= 0.9; // 10% penalty
                                    tipMessage =
                                        "Higher irrigation costs and heat stress reduce profitability in hot humid conditions";
                                } else if (weather === "cool_dry") {
                                    adjustmentFactor *= 0.85; // 15% penalty
                                    tipMessage =
                                        "Rice requires abundant water; dry conditions increase irrigation costs";
                                }

                                // Soil adjustments for rice
                                if (soilType === "clay") {
                                    adjustmentFactor *= 1.15; // 15% boost - clay retains water well
                                    tipMessage +=
                                        ". Clay soil retains water effectively for rice cultivation";
                                } else if (soilType === "sandy") {
                                    adjustmentFactor *= 0.85; // 15% penalty - poor water retention
                                    tipMessage +=
                                        ". Sandy soil requires more frequent irrigation for rice";
                                }
                            }

                            // Wheat adjustments
                            else if (cropName.includes("wheat")) {
                                // Weather adjustments for wheat
                                if (weather === "cool_dry") {
                                    adjustmentFactor *= 1.2; // 20% boost
                                    tipMessage =
                                        "Cool and dry conditions are ideal for wheat cultivation and maximize yields";
                                } else if (weather === "hot_humid") {
                                    adjustmentFactor *= 0.8; // 20% penalty
                                    tipMessage =
                                        "Hot humid weather increases disease risk and reduces wheat quality";
                                } else if (weather === "rainy") {
                                    adjustmentFactor *= 0.9; // 10% penalty
                                    tipMessage =
                                        "Excessive rainfall can cause wheat lodging and fungal diseases";
                                }

                                // Soil adjustments for wheat
                                if (soilType === "loam") {
                                    adjustmentFactor *= 1.1; // 10% boost - ideal for wheat
                                    tipMessage +=
                                        ". Loamy soil provides optimal drainage and nutrients for wheat";
                                } else if (soilType === "clay") {
                                    adjustmentFactor *= 0.9; // 10% penalty - poor drainage
                                    tipMessage +=
                                        ". Clay soil may cause waterlogging issues for wheat";
                                }
                            }

                            // Maize/Corn adjustments
                            else if (
                                cropName.includes("maize") ||
                                cropName.includes("corn")
                            ) {
                                // Weather adjustments for maize
                                if (weather === "hot_humid") {
                                    adjustmentFactor *= 1.1; // 10% boost
                                    tipMessage =
                                        "Warm humid conditions promote healthy maize growth";
                                } else if (weather === "cool_dry") {
                                    adjustmentFactor *= 0.85; // 15% penalty
                                    tipMessage =
                                        "Maize requires warm temperatures and adequate moisture";
                                }

                                // Soil adjustments for maize
                                if (soilType === "loam") {
                                    adjustmentFactor *= 1.15; // 15% boost
                                    tipMessage +=
                                        ". Well-drained loamy soil is perfect for maize cultivation";
                                } else if (soilType === "sandy") {
                                    adjustmentFactor *= 0.9; // 10% penalty
                                    tipMessage +=
                                        ". Sandy soil may require more frequent fertilization for maize";
                                }
                            }

                            // Cotton adjustments
                            else if (cropName.includes("cotton")) {
                                // Weather adjustments for cotton
                                if (weather === "hot_humid") {
                                    adjustmentFactor *= 1.15; // 15% boost
                                    tipMessage =
                                        "Hot humid weather is ideal for cotton fiber development";
                                } else if (weather === "cool_dry") {
                                    adjustmentFactor *= 0.8; // 20% penalty
                                    tipMessage =
                                        "Cotton requires warm temperatures and high humidity for optimal growth";
                                }

                                // Soil adjustments for cotton
                                if (soilType === "loam") {
                                    adjustmentFactor *= 1.1; // 10% boost
                                    tipMessage +=
                                        ". Well-drained loamy soil supports healthy cotton root development";
                                } else if (soilType === "clay") {
                                    adjustmentFactor *= 0.85; // 15% penalty
                                    tipMessage +=
                                        ". Heavy clay soil can restrict cotton root growth";
                                }
                            }

                            // Sugarcane adjustments
                            else if (cropName.includes("sugarcane")) {
                                // Weather adjustments for sugarcane
                                if (weather === "hot_humid") {
                                    adjustmentFactor *= 1.2; // 20% boost
                                    tipMessage =
                                        "Hot humid tropical conditions maximize sugarcane yield";
                                } else if (weather === "cool_dry") {
                                    adjustmentFactor *= 0.75; // 25% penalty
                                    tipMessage =
                                        "Sugarcane requires high temperatures and abundant water";
                                }

                                // Soil adjustments for sugarcane
                                if (soilType === "loam") {
                                    adjustmentFactor *= 1.1; // 10% boost
                                    tipMessage +=
                                        ". Deep loamy soil allows extensive sugarcane root development";
                                } else if (soilType === "sandy") {
                                    adjustmentFactor *= 0.9; // 10% penalty
                                    tipMessage +=
                                        ". Sandy soil requires more irrigation for sugarcane";
                                }
                            }

                            // Potato adjustments
                            else if (cropName.includes("potato")) {
                                // Weather adjustments for potato
                                if (weather === "cool_dry") {
                                    adjustmentFactor *= 1.15; // 15% boost
                                    tipMessage =
                                        "Cool dry weather reduces potato disease and improves storage quality";
                                } else if (weather === "hot_humid") {
                                    adjustmentFactor *= 0.8; // 20% penalty
                                    tipMessage =
                                        "Hot humid conditions increase potato blight and rot risks";
                                }

                                // Soil adjustments for potato
                                if (soilType === "sandy") {
                                    adjustmentFactor *= 1.1; // 10% boost
                                    tipMessage +=
                                        ". Well-drained sandy soil prevents potato tuber rot";
                                } else if (soilType === "clay") {
                                    adjustmentFactor *= 0.85; // 15% penalty
                                    tipMessage +=
                                        ". Heavy clay soil can cause potato deformation and disease";
                                }
                            }

                            // Apply the combined adjustment factor
                            if (adjustmentFactor !== 1.0) {
                                const adjustedMinROI = Math.round(
                                    minROI * adjustmentFactor,
                                );
                                const adjustedMaxROI = Math.round(
                                    maxROI * adjustmentFactor,
                                );
                                processedRec.roi = `₹${adjustedMinROI.toLocaleString()} – ₹${adjustedMaxROI.toLocaleString()}`;

                                // Add comprehensive tip
                                if (
                                    tipMessage &&
                                    !processedRec.tips.some(
                                        (tip: string) =>
                                            tip.includes("water conditions") ||
                                            tip.includes("irrigation costs") ||
                                            tip.includes("cool and dry") ||
                                            tip.includes("ideal for wheat") ||
                                            tip.includes("soil") ||
                                            tip.includes("weather"),
                                    )
                                ) {
                                    processedRec.tips.push(tipMessage);
                                }
                            }
                        }

                        return processedRec;
                    },
                );

                console.log(
                    "Successfully parsed recommendations:",
                    validRecommendations.length,
                );
                return validRecommendations;
            }

            return [recommendations];
        } catch (error) {
            console.error("JSON parsing failed:", error);
            console.log(
                "Raw response that failed to parse:",
                response.substring(0, 500),
            );

            // Try to extract crop names and basic info from the failed response
            const cropMatches = response.match(/"name":\s*"([^"]+)"/g);
            if (cropMatches && cropMatches.length > 0) {
                return cropMatches.slice(0, 3).map((match, index) => {
                    const cropName =
                        match.match(/"name":\s*"([^"]+)"/)?.[1] ||
                        `Crop ${index + 1}`;
                    return {
                        name: cropName,
                        suitability: "Medium",
                        expectedYield: "Data parsing in progress",
                        roi: "₹25,000 - ₹40,000",
                        requirements: [
                            "AI recommendation requires manual review",
                        ],
                        tips: [
                            "Please consult with agricultural experts for detailed guidance",
                        ],
                        estimatedCost: 25000,
                    };
                });
            }

            // Final fallback with a clean message
            return [
                {
                    name: "AI Analysis Available",
                    suitability: "Medium",
                    expectedYield: "Contact support for details",
                    roi: "₹30,000 - ₹50,000",
                    requirements: ["AI service temporarily processing data"],
                    tips: [
                        "Raw AI response needs formatting - please contact support or try again",
                    ],
                    estimatedCost: 30000,
                },
            ];
        }
    }
};

interface ImageFile {
    name?: string;
    type?: string;
    size?: number;
}

export const generatePestAnalysis = async (imageFile?: ImageFile) => {
    // Mock pest analysis - in production this would use image recognition
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, this would analyze the imageFile
    console.log("Analyzing image:", imageFile?.name || "unnamed file");

    const pestTypes = [
        {
            name: "White Grub",
            crops: ["sugarcane", "potato"],
            severity: ["Medium", "High"],
            confidence: [70, 85],
            treatments: [
                "soil treatment",
                "biological control",
                "crop rotation",
            ],
            symptoms: ["wilting plants", "root damage", "yellowing"],
        },
        {
            name: "Stem Borer",
            crops: ["rice", "sugarcane"],
            severity: ["Medium"],
            confidence: [80, 90],
            treatments: [
                "pheromone traps",
                "egg mass collection",
                "resistant varieties",
            ],
            symptoms: ["dead hearts", "white ears", "exit holes"],
        },
        {
            name: "Leaf Hopper",
            crops: ["rice"],
            severity: ["Low", "Medium"],
            confidence: [70, 85],
            treatments: ["yellow sticky traps", "neem oil", "reflective mulch"],
            symptoms: ["leaf yellowing", "hopper burn", "stunted growth"],
        },
    ];

    const randomPest = pestTypes[Math.floor(Math.random() * pestTypes.length)];
    const selectedSeverity =
        randomPest.severity[
            Math.floor(Math.random() * randomPest.severity.length)
        ];
    const confidence =
        randomPest.confidence[0] +
        Math.floor(
            Math.random() *
                (randomPest.confidence[1] - randomPest.confidence[0]),
        );

    return {
        pestDetected: true,
        pestType: randomPest.name,
        confidence: confidence,
        severity: selectedSeverity,
        affectedCrops: randomPest.crops,
        symptoms: randomPest.symptoms,
        recommendations: [
            `Apply ${randomPest.treatments[Math.floor(Math.random() * randomPest.treatments.length)]}`,
            "Monitor field regularly",
            "Maintain field hygiene",
            "Consider organic alternatives",
        ],
        preventiveMeasures: [
            "Use certified disease-free seeds",
            "Maintain proper plant spacing",
            "Regular field inspection",
            "Rotate crops to break pest cycles",
        ],
        economicThreshold:
            selectedSeverity === "High"
                ? "Exceeded - Immediate action required"
                : selectedSeverity === "Medium"
                  ? "Approaching - Monitor closely"
                  : "Below threshold - Preventive measures sufficient",
        seasonalPattern: `Peak activity during ${Math.random() > 0.5 ? "monsoon" : "post-monsoon"} season`,
        weatherImpact: "High humidity and temperature favor pest development",
    };
};
