import React, { useState, useEffect, useCallback } from "react";
import {
    Leaf,
    AlertTriangle,
    TrendingUp,
    Calendar,
    Droplets,
    Map as MapIcon,
    Clock,
    CloudRain,
    Thermometer,
    ArrowUp,
    ArrowDown,
    Plus,
    Loader2,
    BarChart3,
    Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import farmService, { DashboardData } from "../services/farmService";
import weatherService from "../services/weatherService";

interface DashboardProps {
    onNavigate?: (
        tab: "dashboard" | "advisory" | "farm" | "pest" | "market" | "consult",
    ) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { state } = useAuth();
    const user = state.user;
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [weatherData, setWeatherData] = useState<{
        temperature: number;
        monthlyRainfall: number;
        currentRainfall: number;
    } | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);

    // Sample pest alerts to match PestWatch component
    const samplePestAlerts = [
        {
            id: "1",
            title: "Brown Planthopper Outbreak Alert",
            severity: "Critical",
            area: "Sector 12",
        },
        {
            id: "2",
            title: "Seasonal Aphid Activity",
            severity: "Medium",
            area: "Sector 8",
        },
        {
            id: "3",
            title: "Weather-Related Fungal Risk",
            severity: "Medium",
            area: "All Areas",
        },
    ];

    // Get user's location for weather widget
    const getUserLocation = useCallback((): string => {
        if (user?.profile?.location) {
            const { district, state } = user.profile.location;
            if (district && state) {
                return `${district}, ${state}, India`;
            }
            if (state) {
                return `${state}, India`;
            }
        }
        return "Delhi, India"; // Default fallback
    }, [user]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await farmService.getDashboardData();

            if (response.success && response.data) {
                // Override pestAlerts count with sample alerts for consistency with PestWatch
                const dataWithPestAlerts = {
                    ...response.data,
                    pestAlerts: samplePestAlerts.length,
                };
                setDashboardData(dataWithPestAlerts);
            } else {
                setError(response.message || "Failed to load dashboard data");
            }
        } catch (err) {
            console.error("Dashboard data error:", err);
            setError("Failed to load dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const loadWeatherData = useCallback(async () => {
        try {
            setWeatherLoading(true);
            const location = getUserLocation();
            const response = await weatherService.getDashboardWeather(location);

            if (response.success && response.data) {
                // Calculate estimated monthly rainfall
                // Current rainfall represents today's rainfall, multiply by ~30 days for monthly estimate
                const dailyAverage =
                    response.data.current.rainfall > 0
                        ? response.data.current.rainfall
                        : 0.5;
                const monthlyEstimate = dailyAverage * 30;

                setWeatherData({
                    temperature: response.data.current.temperature,
                    monthlyRainfall: monthlyEstimate,
                    currentRainfall: response.data.current.rainfall,
                });
            }
        } catch (error) {
            console.error("Failed to load weather data:", error);
            // Set fallback data to show API is not working
            setWeatherData(null);
        } finally {
            setWeatherLoading(false);
        }
    }, [getUserLocation]);

    useEffect(() => {
        loadDashboardData();
        loadWeatherData();
    }, [loadWeatherData]);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string): string => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTimeBasedGreeting = (): string => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "planting":
                return <Leaf className="text-green-600" size={16} />;
            case "watering":
                return <Droplets className="text-blue-600" size={16} />;
            case "fertilizing":
                return <TrendingUp className="text-purple-600" size={16} />;
            case "pesticide":
                return <AlertTriangle className="text-orange-600" size={16} />;
            case "harvesting":
                return <Calendar className="text-yellow-600" size={16} />;
            default:
                return <Clock className="text-gray-600" size={16} />;
        }
    };

    const handleDeleteActivity = async (
        farmId: string,
        plotNumber: number,
        activityId: string,
    ) => {
        if (!window.confirm("Are you sure you want to remove this activity?")) {
            return;
        }

        try {
            const response = await farmService.deletePlotActivity(
                farmId,
                plotNumber,
                activityId,
            );

            if (response.success) {
                // Update local state to remove the activity without reloading
                setDashboardData((prevData) => {
                    if (!prevData) return null;
                    return {
                        ...prevData,
                        recentActivities: prevData.recentActivities.filter(
                            (activity) => activity.id !== activityId,
                        ),
                    };
                });
            } else {
                alert(response.message || "Failed to delete activity");
            }
        } catch (error) {
            console.error("Error deleting activity:", error);
            alert("Failed to delete activity. Please try again.");
        }
    };

    const getHealthColor = (score: number): string => {
        if (score >= 80) return "text-green-600 dark:text-green-400";
        if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    const getHealthBgColor = (score: number): string => {
        if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
        if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30";
        return "bg-red-100 dark:bg-red-900/30";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <Loader2 className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-dark-300">
                        Loading your farm dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Dashboard Error
                </h3>
                <p className="text-gray-600 dark:text-dark-300 mb-4">{error}</p>
                <button
                    onClick={loadDashboardData}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="text-center py-12">
                <MapIcon className="h-12 w-12 text-gray-400 dark:text-dark-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Data Available
                </h3>
                <p className="text-gray-600 dark:text-dark-300">
                    Unable to load dashboard information.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="text-center mb-8 animate-fade-in">
                <p className="text-sm font-medium text-gray-500 dark:text-dark-400 mb-2 tracking-wide uppercase">
                    {getTimeBasedGreeting()}
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 dark:from-green-400 dark:via-green-300 dark:to-emerald-400 bg-clip-text text-transparent mb-3 transition-all duration-300 hover:scale-105">
                    Welcome back, {user?.name || "Farmer"}!
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-dark-300 transition-colors duration-200 max-w-2xl mx-auto">
                    Here's what's happening on your farm today
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="group bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-green-300 dark:hover:border-green-700">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-dark-300 mb-1">
                                Current Season
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {dashboardData.currentSeason}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-dark-400">
                                Agricultural season
                            </p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl transition-all duration-300 group-hover:scale-110">
                            <Calendar
                                className="text-blue-600 dark:text-blue-400"
                                size={24}
                            />
                        </div>
                    </div>
                </div>

                <div className="group bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-green-300 dark:hover:border-green-700">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-dark-300 mb-1">
                                Active Crops
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {dashboardData.activeCrops}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-dark-400">
                                {dashboardData.cropVariety &&
                                dashboardData.cropVariety.length > 0
                                    ? `${dashboardData.cropVariety.slice(0, 2).join(", ")}${dashboardData.cropVariety.length > 2 ? "..." : ""}`
                                    : "No crops planted"}
                            </p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-xl transition-all duration-300 group-hover:scale-110">
                            <Leaf
                                className="text-green-600 dark:text-green-400"
                                size={24}
                            />
                        </div>
                    </div>
                </div>

                <div className="group bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-orange-300 dark:hover:border-orange-700">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-dark-300 mb-1">
                                Pest Alerts
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {dashboardData.pestAlerts}
                            </p>
                            <div className="flex items-center">
                                {dashboardData.pestAlerts > 0 ? (
                                    <>
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                            Requires attention
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                                            All clear
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl transition-all duration-300 group-hover:scale-110">
                            <AlertTriangle
                                className="text-orange-600 dark:text-orange-400"
                                size={24}
                            />
                        </div>
                    </div>
                </div>

                <div className="group bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-green-300 dark:hover:border-green-700">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-dark-300 mb-1">
                                Farm Health
                            </p>
                            <p
                                className={`text-2xl font-bold ${getHealthColor(dashboardData.healthScore)} mb-1`}
                            >
                                {dashboardData.healthScore}%
                            </p>
                            <div className="flex items-center mt-1">
                                {dashboardData.healthScore >= 80 ? (
                                    <ArrowUp className="w-3 h-3 text-green-600 dark:text-green-400 mr-1" />
                                ) : (
                                    <ArrowDown className="w-3 h-3 text-red-600 dark:text-red-400 mr-1" />
                                )}
                                <p
                                    className={`text-xs ${getHealthColor(dashboardData.healthScore)}`}
                                >
                                    {dashboardData.healthScore >= 80
                                        ? "Excellent"
                                        : dashboardData.healthScore >= 60
                                          ? "Good"
                                          : "Needs attention"}
                                </p>
                            </div>
                        </div>
                        <div
                            className={`p-3 rounded-lg transition-colors duration-200 ${getHealthBgColor(dashboardData.healthScore)}`}
                        >
                            <BarChart3
                                className="text-gray-600 dark:text-dark-300"
                                size={24}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Farm Overview */}
            {dashboardData.totalFarms > 0 && (
                <div className="minimal-card p-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-200">
                        <MapIcon
                            className="text-gray-600 dark:text-dark-300 mr-2"
                            size={20}
                        />
                        Farm Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg transition-colors duration-200">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                                {dashboardData.totalFarms}
                            </p>
                            <p className="text-sm font-medium text-gray-700 dark:text-dark-200">
                                Total Farms
                            </p>
                            <p className="text-xs text-gray-600 dark:text-dark-400 mt-1">
                                {dashboardData.totalAcreage} acres total
                            </p>
                        </div>

                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors duration-200">
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                                {dashboardData.totalPlots}
                            </p>
                            <p className="text-sm font-medium text-gray-700 dark:text-dark-200">
                                Total Plots
                            </p>
                            <p className="text-xs text-gray-600 dark:text-dark-400 mt-1">
                                Avg {dashboardData.averageFarmSize} acres
                            </p>
                        </div>

                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg transition-colors duration-200">
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                                {dashboardData.cropVariety
                                    ? dashboardData.cropVariety.length
                                    : 0}
                            </p>
                            <p className="text-sm font-medium text-gray-700 dark:text-dark-200">
                                Crop Types
                            </p>
                            <p className="text-xs text-gray-600 dark:text-dark-400 mt-1">
                                Diverse cultivation
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activities & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="minimal-card p-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-200">
                        <Clock
                            className="text-gray-600 dark:text-dark-300 mr-2"
                            size={20}
                        />
                        Recent Activities
                    </h3>
                    <div className="space-y-3">
                        {dashboardData.recentActivities &&
                        dashboardData.recentActivities.length > 0 ? (
                            dashboardData.recentActivities
                                .slice(0, 5)
                                .map((activity, index) => (
                                    <div
                                        key={activity.id || index}
                                        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg transition-colors duration-200 group relative"
                                    >
                                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg transition-colors duration-200">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                    {activity.type.replace(
                                                        "_",
                                                        " ",
                                                    )}
                                                </p>

                                                {activity.id &&
                                                    activity.farmId && (
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteActivity(
                                                                    activity.farmId,
                                                                    activity.plotNumber,
                                                                    activity.id,
                                                                )
                                                            }
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                            title="Remove activity"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-dark-300">
                                                {activity.farmName} - Plot{" "}
                                                {activity.plotNumber}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                                                {activity.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-gray-500 dark:text-dark-400">
                                                    {formatDate(activity.date)}
                                                </p>
                                                {activity.cost && (
                                                    <p className="text-xs text-green-600">
                                                        {formatCurrency(
                                                            activity.cost,
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="text-center py-8">
                                <Clock className="h-12 w-12 text-gray-300 dark:text-dark-500 mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-dark-400 mb-2">
                                    No recent activities
                                </p>
                                <p className="text-xs text-gray-400 dark:text-dark-500">
                                    Start logging your farm activities to see
                                    them here
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="minimal-card p-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-200">
                        <Leaf
                            className="text-gray-600 dark:text-dark-300 mr-2"
                            size={20}
                        />
                        Recommendations
                    </h3>
                    <div className="space-y-3">
                        {dashboardData.recommendations &&
                            dashboardData.recommendations.map(
                                (recommendation, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors duration-200"
                                    >
                                        <div className="p-1 bg-blue-100 dark:bg-blue-800/50 rounded-full mt-1 transition-colors duration-200">
                                            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800 dark:text-blue-200">
                                                {recommendation}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                    </div>
                </div>
            </div>

            {/* Quick Actions & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-200">
                        <Plus
                            className="text-gray-600 dark:text-dark-300 mr-2"
                            size={20}
                        />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <button
                            onClick={() => onNavigate?.("farm")}
                            className="group p-4 text-left bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/50 dark:hover:to-green-800/40 rounded-xl transition-all duration-300 border border-green-200 dark:border-green-800 hover:shadow-lg hover:scale-105"
                        >
                            <MapIcon
                                className="text-green-600 dark:text-green-400 mb-3 group-hover:scale-110 transition-transform duration-300"
                                size={24}
                            />
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                View Farm
                            </p>
                            <p className="text-xs text-gray-600 dark:text-dark-300">
                                Manage plots
                            </p>
                        </button>

                        <button
                            onClick={() => onNavigate?.("advisory")}
                            className="group p-4 text-left bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/50 dark:hover:to-blue-800/40 rounded-xl transition-all duration-300 border border-blue-200 dark:border-blue-800 hover:shadow-lg hover:scale-105"
                        >
                            <Leaf
                                className="text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-300"
                                size={24}
                            />
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Crop Advisory
                            </p>
                            <p className="text-xs text-gray-600 dark:text-dark-300">
                                Get recommendations
                            </p>
                        </button>

                        <button
                            onClick={() => onNavigate?.("pest")}
                            className="group p-4 text-left bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-900/50 dark:hover:to-orange-800/40 rounded-xl transition-all duration-300 border border-orange-200 dark:border-orange-800 hover:shadow-lg hover:scale-105"
                        >
                            <AlertTriangle
                                className="text-orange-600 dark:text-orange-400 mb-3 group-hover:scale-110 transition-transform duration-300"
                                size={24}
                            />
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Pest Watch
                            </p>
                            <p className="text-xs text-gray-600 dark:text-dark-300">
                                Monitor threats
                            </p>
                        </button>

                        <button
                            onClick={() => onNavigate?.("market")}
                            className="group p-4 text-left bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/50 dark:hover:to-purple-800/40 rounded-xl transition-all duration-300 border border-purple-200 dark:border-purple-800 hover:shadow-lg hover:scale-105"
                        >
                            <TrendingUp
                                className="text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform duration-300"
                                size={24}
                            />
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Market Prices
                            </p>
                            <p className="text-xs text-gray-600 dark:text-dark-300">
                                Check rates
                            </p>
                        </button>
                    </div>
                </div>

                <div className="minimal-card p-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-200">
                        <BarChart3
                            className="text-gray-600 dark:text-dark-300 mr-2"
                            size={20}
                        />
                        Farm Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg transition-colors duration-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg transition-colors duration-200">
                                    <MapIcon
                                        className="text-green-600 dark:text-green-400"
                                        size={16}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Total Area
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-dark-300">
                                        {dashboardData.totalAcreage} acres
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {dashboardData.totalFarms}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-dark-300">
                                    {dashboardData.totalFarms === 1
                                        ? "Farm"
                                        : "Farms"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg transition-colors duration-200">
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`p-2 rounded-lg transition-colors duration-200 ${getHealthBgColor(dashboardData.healthScore)}`}
                                >
                                    <Leaf
                                        className={`${getHealthColor(dashboardData.healthScore).replace("text-", "text-")}`}
                                        size={16}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Crop Health
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-dark-300">
                                        Overall farm condition
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p
                                    className={`text-lg font-semibold ${getHealthColor(dashboardData.healthScore)}`}
                                >
                                    {dashboardData.healthScore}%
                                </p>
                                <p className="text-xs text-gray-600 dark:text-dark-300">
                                    Health score
                                </p>
                            </div>
                        </div>

                        {dashboardData.pestAlerts > 0 && (
                            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-700 transition-colors duration-200">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-lg transition-colors duration-200">
                                        <AlertTriangle
                                            className="text-orange-600 dark:text-orange-400"
                                            size={16}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            Active Alerts
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-dark-300">
                                            Pest monitoring required
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                                        {dashboardData.pestAlerts}
                                    </p>
                                    <p className="text-xs text-orange-600 dark:text-orange-400">
                                        {dashboardData.pestAlerts === 1
                                            ? "Alert"
                                            : "Alerts"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Farm CTA for new users */}
            {dashboardData.totalFarms === 0 && (
                <div className="text-center py-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg border-2 border-dashed border-green-200 dark:border-green-700 transition-colors duration-200">
                    <MapIcon className="h-16 w-16 text-green-400 dark:text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                        Welcome to KhetSetu!
                    </h3>
                    <p className="text-gray-600 dark:text-dark-300 mb-6 max-w-md mx-auto transition-colors duration-200">
                        Get started by creating your first farm. Add your plots,
                        crops, and start tracking your agricultural journey.
                    </p>
                    <button
                        onClick={() =>
                            (window.location.href = "/farm-visualization")
                        }
                        className="inline-flex items-center px-6 py-3 bg-green-600 dark:bg-green-500 text-white font-medium rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First Farm
                    </button>
                </div>
            )}

            {/* Weather & Soil Info Placeholder */}
            {dashboardData.totalFarms > 0 && (
                <div className="minimal-card p-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-200">
                        <CloudRain
                            className="text-gray-600 dark:text-dark-300 mr-2"
                            size={20}
                        />
                        Weather & Soil Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors duration-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg transition-colors duration-200">
                                    <Droplets
                                        className="text-blue-600 dark:text-blue-400"
                                        size={16}
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Rainfall
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-dark-300">
                                        This month
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {weatherLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin inline" />
                                    ) : weatherData ? (
                                        `${weatherData.monthlyRainfall.toFixed(1)}mm`
                                    ) : (
                                        "--mm"
                                    )}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-dark-300">
                                    {weatherLoading
                                        ? "Loading..."
                                        : weatherData
                                          ? "Live data"
                                          : "Weather API integration pending"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg transition-colors duration-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-800/50 rounded-lg transition-colors duration-200">
                                    <Thermometer
                                        className="text-yellow-600 dark:text-yellow-400"
                                        size={16}
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Temperature
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-dark-300">
                                        Current avg
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {weatherLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin inline" />
                                    ) : weatherData ? (
                                        `${weatherData.temperature}°C`
                                    ) : (
                                        "--°C"
                                    )}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-dark-300">
                                    {weatherLoading
                                        ? "Loading..."
                                        : weatherData
                                          ? "Live data"
                                          : "Weather API integration pending"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/30 rounded-lg transition-colors duration-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg transition-colors duration-200">
                                    <Leaf
                                        className="text-green-600 dark:text-green-400"
                                        size={16}
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Soil Health
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-dark-300">
                                        Average condition
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p
                                    className={`text-lg font-semibold ${getHealthColor(dashboardData.healthScore)}`}
                                >
                                    {dashboardData.healthScore >= 80
                                        ? "Good"
                                        : dashboardData.healthScore >= 60
                                          ? "Fair"
                                          : "Poor"}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-dark-300">
                                    Based on plot data
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Refresh Button */}
            <div className="text-center">
                <button
                    onClick={loadDashboardData}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 transition-colors duration-200"
                >
                    {loading ? (
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    ) : (
                        <CloudRain className="w-4 h-4 mr-2" />
                    )}
                    {loading ? "Loading..." : "Refresh Data"}
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
