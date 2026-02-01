import React, { useState, useEffect, useCallback } from "react";
import {
    Leaf,
    DollarSign,
    Clock,
    Bell,
    CheckCircle,
    Droplet,
    AlertCircle,
    Lightbulb,
    Camera,
    BookOpen,
    Filter,
    Download,
    MapPin,
} from "lucide-react";
import { generateCropRecommendations } from "../utils/aiService";
import { useLanguage } from "../contexts/LanguageContext";
import SoilDetection from "./SoilDetection";

interface FarmInput {
    budget: string;
    season: string;
    soilType: string;
    weather: string;
    farmSize: string;
    location?: string;
    previousCrop?: string;
    irrigationType?: string;
    organicPreference?: boolean;
}

interface CropRecommendation {
    name: string;
    suitability: "High" | "Medium" | "Low";
    expectedYield: string;
    roi: string;
    requirements: string[];
    tips: string[];
    estimatedCost?: number;
    suitabilityScore?: string;
    marketPrice?: string;
    demandTrend?: "High" | "Medium" | "Low";
    riskLevel?: "Low" | "Medium" | "High";
    sustainabilityScore?: number;
}



interface WeatherData {
    temperature: number;
    humidity: number;
    rainfall: number;
    forecast: string;
}

interface MarketData {
    currentPrice: string;
    trend: "up" | "down" | "stable";
    demandLevel: "High" | "Medium" | "Low";
}

type TabType = "quick" | "detailed" | "calendar" | "analytics" | "history";

const CropAdvisory: React.FC = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabType>("quick");
    const [farmInput, setFarmInput] = useState<FarmInput>({
        budget: "",
        season: "",
        soilType: "",
        weather: "",
        farmSize: "",
        location: "",
        previousCrop: "",
        irrigationType: "",
        organicPreference: false,
    });


    const [recommendations, setRecommendations] = useState<
        CropRecommendation[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [marketData, setMarketData] = useState<Record<string, MarketData>>(
        {},
    );
    const [compareMode, setCompareMode] = useState(false);
    const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        suitability: "",
        riskLevel: "",
        sustainabilityMin: 0,
    });



    // Mock market data
    useEffect(() => {
        setMarketData({
            "Rice (Paddy)": {
                currentPrice: "₹2,200/quintal",
                trend: "up",
                demandLevel: "High",
            },
            Wheat: {
                currentPrice: "₹2,150/quintal",
                trend: "stable",
                demandLevel: "Medium",
            },
            "Maize (Corn)": {
                currentPrice: "₹1,800/quintal",
                trend: "up",
                demandLevel: "High",
            },
            Sugarcane: {
                currentPrice: "₹380/quintal",
                trend: "down",
                demandLevel: "Medium",
            },
        });
    }, []);





    const generateRecommendations = async () => {
        setLoading(true);

        try {
            const aiRecommendations =
                await generateCropRecommendations(farmInput);

            let filtered = aiRecommendations.map((rec) => ({
                ...rec,
                marketPrice: marketData[rec.name]?.currentPrice || "N/A",
                demandTrend: marketData[rec.name]?.demandLevel || "Medium",
                riskLevel: farmInput.weather === "rainy" ? "Medium" : "Low",
                sustainabilityScore: Math.floor(Math.random() * 40) + 60, // 60-100
            }));

            const budget = farmInput.budget ? Number(farmInput.budget) : 0;
            if (budget >= 10000) {
                filtered = filtered.filter((rec) => {
                    const cost =
                        ((rec as Record<string, unknown>)
                            .estimatedCost as number) || 0;
                    return cost <= budget;
                });
            }

            // Apply filters
            if (filters.suitability) {
                filtered = filtered.filter(
                    (rec) => rec.suitability === filters.suitability,
                );
            }
            if (filters.riskLevel) {
                filtered = filtered.filter(
                    (rec) => rec.riskLevel === filters.riskLevel,
                );
            }
            if (filters.sustainabilityMin > 0) {
                filtered = filtered.filter(
                    (rec) =>
                        (rec.sustainabilityScore || 0) >=
                        filters.sustainabilityMin,
                );
            }

            setRecommendations(filtered);
        } catch (error) {
            console.error("Error generating recommendations:", error);
            const fallbackRecommendations =
                getEnhancedStaticFallback(farmInput);
            setRecommendations(fallbackRecommendations || []);
        }

        setLoading(false);
    };

    const getEnhancedStaticFallback = (
        farmInput: FarmInput,
    ): CropRecommendation[] => {
        const budget = Number(farmInput.budget) || 0;

        if (farmInput.season === "kharif") {
            if (farmInput.weather === "rainy") {
                return [
                    {
                        name: "Rice (Paddy)",
                        suitability: "High" as const,
                        expectedYield: "45-55 quintals/hectare",
                        roi: "₹45,000 - ₹65,000",
                        requirements: [
                            "Abundant water supply",
                            "Well-prepared field",
                            "Pest management",
                        ],
                        tips: [
                            "Monitor for blast disease",
                            "Ensure proper drainage",
                            "Use resistant varieties",
                        ],
                        estimatedCost: 25000,
                        marketPrice: "₹2,200/quintal",
                        demandTrend: "High" as const,
                        riskLevel: "Medium" as const,
                        sustainabilityScore: 75,
                    },
                    {
                        name: "Maize (Corn)",
                        suitability: "High" as const,
                        expectedYield: "65-85 quintals/hectare",
                        roi: "₹45,000 - ₹65,000",
                        requirements: [
                            "Well-drained soil",
                            "Balanced nutrition",
                            "Fall armyworm monitoring",
                        ],
                        tips: [
                            "Ensure good drainage",
                            "Apply fertilizers before rains",
                            "Monitor diseases",
                        ],
                        estimatedCost: 20000,
                        marketPrice: "₹1,800/quintal",
                        demandTrend: "High" as const,
                        riskLevel: "Low" as const,
                        sustainabilityScore: 80,
                    },
                ].filter((rec) => budget === 0 || rec.estimatedCost <= budget);
            }
        }

        return [
            {
                name: "Mixed Farming",
                suitability: "Medium" as const,
                expectedYield: "200-300 quintals/hectare",
                roi: "₹50,000 - ₹80,000",
                requirements: [
                    "Diversified approach",
                    "Weather-appropriate crops",
                    "Risk management",
                ],
                tips: [
                    "Consult local officer",
                    "Choose suitable varieties",
                    "Market timing important",
                ],
                estimatedCost: 30000,
                marketPrice: "Variable",
                demandTrend: "Medium" as const,
                riskLevel: "Low" as const,
                sustainabilityScore: 85,
            },
        ];
    };

    const handleInputChange = useCallback(
        (field: keyof FarmInput, value: string | boolean) => {
            setFarmInput((prev) => ({ ...prev, [field]: value }));
        },
        [],
    );

    const getSuitabilityColor = (suitability: string) => {
        switch (suitability) {
            case "High":
                return "text-emerald-600 bg-emerald-100 border-emerald-200";
            case "Medium":
                return "text-amber-600 bg-amber-100 border-amber-200";
            case "Low":
                return "text-red-600 bg-red-100 border-red-200";
            default:
                return "text-gray-600 bg-gray-100 border-gray-200";
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "Low":
                return "text-green-600 bg-green-50";
            case "Medium":
                return "text-yellow-600 bg-yellow-50";
            case "High":
                return "text-red-600 bg-red-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case "up":
                return <TrendingUp className="text-green-500" size={16} />;
            case "down":
                return (
                    <TrendingUp className="text-red-500 rotate-180" size={16} />
                );
            default:
                return <TrendingUp className="text-gray-500" size={16} />;
        }
    };

    const toggleCropSelection = (cropName: string) => {
        if (selectedCrops.includes(cropName)) {
            setSelectedCrops(selectedCrops.filter((name) => name !== cropName));
        } else if (selectedCrops.length < 3) {
            setSelectedCrops([...selectedCrops, cropName]);
        }
    };

    const QuickAdvisoryTab = useCallback(
        () => (
            <div className="space-y-4 sm:space-y-6">
                {/* Enhanced Input Form */}
                <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm transition-colors duration-200">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center transition-colors duration-200">
                            <Leaf
                                className="text-green-600 dark:text-green-400 mr-2 sm:mr-3"
                                size={20}
                            />
                            <span className="hidden sm:inline">
                                Farm Information
                            </span>
                            <span className="sm:hidden">Farm Info</span>
                        </h2>
                        <div className="flex space-x-1 sm:space-x-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2 transition-colors duration-200 ${
                                    showFilters
                                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                                        : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-dark-200 hover:bg-gray-200 dark:hover:bg-dark-600"
                                }`}
                            >
                                <Filter size={14} />
                                <span className="hidden sm:inline">
                                    Filters
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-700 transition-colors duration-200">
                            <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors duration-200">
                                Filter Recommendations
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-dark-200 mb-1 sm:mb-2">
                                        Suitability
                                    </label>
                                    <select
                                        value={filters.suitability}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                suitability: e.target.value,
                                            }))
                                        }
                                        className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
                                    >
                                        <option value="">All Levels</option>
                                        <option value="High">
                                            High Suitability
                                        </option>
                                        <option value="Medium">
                                            Medium Suitability
                                        </option>
                                        <option value="Low">
                                            Low Suitability
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-dark-200 mb-1 sm:mb-2">
                                        Risk Level
                                    </label>
                                    <select
                                        value={filters.riskLevel}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                riskLevel: e.target.value,
                                            }))
                                        }
                                        className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
                                    >
                                        <option value="">
                                            All Risk Levels
                                        </option>
                                        <option value="Low">Low Risk</option>
                                        <option value="Medium">
                                            Medium Risk
                                        </option>
                                        <option value="High">High Risk</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-dark-200 mb-1 sm:mb-2">
                                        Min Sustainability Score
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={filters.sustainabilityMin}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                sustainabilityMin: Number(
                                                    e.target.value,
                                                ),
                                            }))
                                        }
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-600 dark:text-dark-300 mt-1">
                                        {filters.sustainabilityMin}/100
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
                                <span className="hidden sm:inline">
                                    {t("cropAdvisory.budget")} (Min: ₹10,000)
                                </span>
                                <span className="sm:hidden">
                                    Budget (Min: ₹10k)
                                </span>
                            </label>
                            <div className="relative">
                                <DollarSign
                                    className="absolute left-2 sm:left-3 top-2.5 sm:top-3 text-gray-400 dark:text-dark-400"
                                    size={16}
                                />
                                <input
                                    type="number"
                                    value={farmInput.budget}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "budget",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400 transition-colors duration-200"
                                    placeholder="50000"
                                    min="10000"
                                    autoComplete="off"
                                />
                            </div>
                            {farmInput.budget &&
                                Number(farmInput.budget) < 10000 && (
                                    <p className="text-xs text-red-600 dark:text-red-400">
                                        Minimum budget is ₹10,000
                                    </p>
                                )}
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
                                {t("cropAdvisory.season")}
                            </label>
                            <select
                                value={farmInput.season}
                                onChange={(e) =>
                                    handleInputChange("season", e.target.value)
                                }
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
                            >
                                <option value="">Select Season</option>
                                <option value="kharif">
                                    Kharif (June-October)
                                </option>
                                <option value="rabi">
                                    Rabi (November-April)
                                </option>
                                <option value="zaid">Zaid (April-June)</option>
                            </select>
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
                                <span className="hidden sm:inline">
                                    Farm Size (acres)
                                </span>
                                <span className="sm:hidden">Size (acres)</span>
                            </label>
                            <div className="relative">
                                <MapPin
                                    className="absolute left-2 sm:left-3 top-2.5 sm:top-3 text-gray-400 dark:text-dark-400"
                                    size={16}
                                />
                                <input
                                    type="number"
                                    value={farmInput.farmSize}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "farmSize",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400 transition-colors duration-200"
                                    placeholder="2.5"
                                    step="0.1"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
                                Soil Type
                            </label>
                            <select
                                value={farmInput.soilType}
                                onChange={(e) =>
                                    handleInputChange(
                                        "soilType",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
                            >
                                <option value="">Select Soil Type</option>
                                <option value="clay">Clay Soil</option>
                                <option value="sandy">Sandy Soil</option>
                                <option value="loam">Loam Soil</option>
                                <option value="silt">Silt Soil</option>
                                <option value="black_cotton">
                                    Black Cotton Soil
                                </option>
                                <option value="red">Red Soil</option>
                            </select>
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
                                Weather Conditions
                            </label>
                            <select
                                value={farmInput.weather}
                                onChange={(e) =>
                                    handleInputChange("weather", e.target.value)
                                }
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
                            >
                                <option value="">Select Weather</option>
                                <option value="hot_humid">Hot & Humid</option>
                                <option value="moderate">Moderate</option>
                                <option value="cool_dry">Cool & Dry</option>
                                <option value="rainy">Rainy</option>
                            </select>
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-200 transition-colors duration-200">
                                Irrigation Type
                            </label>
                            <select
                                value={farmInput.irrigationType}
                                onChange={(e) =>
                                    handleInputChange(
                                        "irrigationType",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors duration-200"
                            >
                                <option value="">Select Irrigation</option>
                                <option value="flood">Flood Irrigation</option>
                                <option value="drip">Drip Irrigation</option>
                                <option value="sprinkler">
                                    Sprinkler System
                                </option>
                                <option value="rainfed">Rain-fed</option>
                            </select>
                        </div>
                    </div>

                    {/* Soil Detection Integration */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg border border-green-200 dark:border-green-700 transition-colors duration-200">
                        <SoilDetection
                            onSoilTypeDetected={(detectedSoilType) =>
                                handleInputChange("soilType", detectedSoilType)
                            }
                            currentSoilType={farmInput.soilType}
                        />
                    </div>

                    {/* Organic Preference Toggle */}
                    <div className="mt-6 flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                            <Leaf
                                className="text-green-600 dark:text-green-400"
                                size={20}
                            />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                                    Organic Farming Preference
                                </p>
                                <p className="text-sm text-gray-600 dark:text-dark-300 transition-colors duration-200">
                                    Get recommendations for sustainable farming
                                    practices
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() =>
                                handleInputChange(
                                    "organicPreference",
                                    !farmInput.organicPreference,
                                )
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                farmInput.organicPreference
                                    ? "bg-green-600 dark:bg-green-500"
                                    : "bg-gray-200 dark:bg-dark-600"
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    farmInput.organicPreference
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                }`}
                            />
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={generateRecommendations}
                            disabled={
                                loading ||
                                !farmInput.budget ||
                                Number(farmInput.budget) < 10000 ||
                                !farmInput.season ||
                                !farmInput.soilType
                            }
                            className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-500 dark:to-blue-500 text-white font-semibold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-blue-700 dark:hover:from-green-600 dark:hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                                        <span className="text-sm sm:text-base">
                                            <span className="hidden sm:inline">
                                                Generating AI Recommendations...
                                            </span>
                                            <span className="sm:hidden">
                                                Generating...
                                            </span>
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Lightbulb
                                            className="animate-pulse"
                                            size={20}
                                        />
                                        <span className="text-sm sm:text-base">
                                            <span className="hidden sm:inline">
                                                Get Smart Crop Advisory
                                            </span>
                                            <span className="sm:hidden">
                                                Get Advisory
                                            </span>
                                        </span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Enhanced Recommendations */}
                {recommendations.length > 0 && (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center transition-colors duration-200">
                                <Target
                                    className="text-green-600 dark:text-green-400 mr-2 sm:mr-3"
                                    size={20}
                                />
                                <span className="hidden sm:inline">
                                    AI Crop Recommendations
                                </span>
                                <span className="sm:hidden">
                                    Recommendations
                                </span>
                            </h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCompareMode(!compareMode)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                        compareMode
                                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                                            : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-dark-200 hover:bg-gray-200 dark:hover:bg-dark-600"
                                    }`}
                                >
                                    {compareMode
                                        ? "Exit Compare"
                                        : "Compare Crops"}
                                </button>
                                <button className="p-2 text-gray-600 dark:text-dark-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-lg transition-colors duration-200">
                                    <Download size={16} />
                                </button>
                                <button className="p-2 text-gray-600 dark:text-dark-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-lg transition-colors duration-200">
                                    <Share2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {recommendations.map((crop, index) => (
                                <div
                                    key={index}
                                    className={`relative bg-white dark:bg-dark-800 border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${
                                        compareMode &&
                                        selectedCrops.includes(crop.name)
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                            : "border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600"
                                    }`}
                                >
                                    {compareMode && (
                                        <button
                                            onClick={() =>
                                                toggleCropSelection(crop.name)
                                            }
                                            className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200"
                                        >
                                            {selectedCrops.includes(
                                                crop.name,
                                            ) ? (
                                                <CheckCircle
                                                    className="text-blue-600 dark:text-blue-400"
                                                    size={16}
                                                />
                                            ) : (
                                                <div className="w-4 h-4 border border-gray-400 dark:border-dark-500 rounded-full" />
                                            )}
                                        </button>
                                    )}

                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                                                {crop.name}
                                            </h3>
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getSuitabilityColor(crop.suitability)}`}
                                                >
                                                    {crop.suitability}{" "}
                                                    Suitability
                                                </span>
                                                {crop.sustainabilityScore && (
                                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                                                        🌱{" "}
                                                        {
                                                            crop.sustainabilityScore
                                                        }
                                                        %
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Market Data Integration */}
                                    {crop.marketPrice && (
                                        <div className="mb-4 p-3 bg-gray-50 dark:bg-dark-900 rounded-lg transition-colors duration-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                                                    Market Price
                                                </span>
                                                {marketData[crop.name] &&
                                                    getTrendIcon(
                                                        marketData[crop.name]
                                                            .trend,
                                                    )}
                                            </div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                {crop.marketPrice}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-dark-300">
                                                Demand:{" "}
                                                <span
                                                    className={`font-medium ${
                                                        crop.demandTrend ===
                                                        "High"
                                                            ? "text-green-600"
                                                            : crop.demandTrend ===
                                                                "Medium"
                                                              ? "text-yellow-600"
                                                              : "text-red-600"
                                                    }`}
                                                >
                                                    {crop.demandTrend}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-3 mb-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <span className="text-xs font-medium text-blue-700">
                                                    Expected Yield
                                                </span>
                                                <div className="font-bold text-blue-900 text-sm">
                                                    {crop.expectedYield}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                <span className="text-xs font-medium text-green-700">
                                                    Potential ROI
                                                </span>
                                                <div className="font-bold text-green-900 text-sm">
                                                    {crop.roi}
                                                </div>
                                            </div>
                                        </div>

                                        {crop.riskLevel && (
                                            <div
                                                className={`p-3 rounded-lg ${getRiskColor(crop.riskLevel)}`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <Shield size={16} />
                                                    <span className="text-sm font-medium">
                                                        Risk Level:{" "}
                                                        {crop.riskLevel}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center text-sm">
                                                <CheckCircle
                                                    className="mr-2 text-green-600 dark:text-green-400"
                                                    size={16}
                                                />
                                                Key Requirements
                                            </h4>
                                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                                {crop.requirements
                                                    .slice(0, 2)
                                                    .map((req, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start"
                                                        >
                                                            <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                                            <span>{req}</span>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center text-sm">
                                                <Lightbulb
                                                    className="mr-2 text-yellow-600 dark:text-yellow-400"
                                                    size={16}
                                                />
                                                Smart Tips
                                            </h4>
                                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                                {crop.tips
                                                    .slice(0, 2)
                                                    .map((tip, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start"
                                                        >
                                                            <span className="w-1.5 h-1.5 bg-yellow-400 dark:bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                                            <span>{tip}</span>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">

                                        <button className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200 text-sm font-medium">
                                            <Star size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Crop Comparison */}
                        {compareMode && selectedCrops.length > 1 && (
                            <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-6 shadow-sm transition-colors duration-200">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
                                    Crop Comparison
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-dark-700">
                                                <th className="text-left py-2 text-gray-900 dark:text-white">
                                                    Criteria
                                                </th>
                                                {selectedCrops.map(
                                                    (cropName) => (
                                                        <th
                                                            key={cropName}
                                                            className="text-left py-2 px-4 text-gray-900 dark:text-white"
                                                        >
                                                            {cropName}
                                                        </th>
                                                    ),
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                "suitability",
                                                "expectedYield",
                                                "roi",
                                                "riskLevel",
                                                "sustainabilityScore",
                                            ].map((criteria) => (
                                                <tr
                                                    key={criteria}
                                                    className="border-b border-gray-100 dark:border-dark-700"
                                                >
                                                    <td className="py-3 font-medium capitalize text-gray-900 dark:text-white">
                                                        {criteria.replace(
                                                            /([A-Z])/g,
                                                            " $1",
                                                        )}
                                                    </td>
                                                    {selectedCrops.map(
                                                        (cropName) => {
                                                            const crop =
                                                                recommendations.find(
                                                                    (r) =>
                                                                        r.name ===
                                                                        cropName,
                                                                );
                                                            return (
                                                                <td
                                                                    key={
                                                                        cropName
                                                                    }
                                                                    className="py-3 px-4 text-gray-700 dark:text-dark-200"
                                                                >
                                                                    {crop
                                                                        ? String(
                                                                              (
                                                                                  crop as unknown as Record<
                                                                                      string,
                                                                                      unknown
                                                                                  >
                                                                              )[
                                                                                  criteria
                                                                              ],
                                                                          ) ||
                                                                          "N/A"
                                                                        : "N/A"}
                                                                </td>
                                                            );
                                                        },
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        ),
        [
            farmInput,
            showFilters,
            filters,
            loading,
            recommendations,
            compareMode,
            selectedCrops,
            marketData,
            handleInputChange,
            t,
            getSuitabilityColor,
            getRiskColor,
            getTrendIcon,
            toggleCropSelection,
            generateRecommendations,
        ],
    );


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-dark-900 dark:via-dark-900 dark:to-dark-800 transition-colors duration-200">
            {/* Header */}
            <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mx-3 sm:mx-6 lg:mx-8 mt-6 sm:mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-xl shadow-sm transition-all duration-300 flex-shrink-0">
                                <Leaf
                                    className="text-green-600 dark:text-green-400"
                                    size={24}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent transition-colors duration-200 truncate">
                                    Smart Crop Advisory
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-300 transition-colors duration-200 hidden xs:block truncate">
                                    AI-powered farming recommendations
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            {/* Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
                {QuickAdvisoryTab()}
            </div>
        </div>
    );
};

export default CropAdvisory;
