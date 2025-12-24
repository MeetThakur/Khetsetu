import React, { useState } from "react";
import {
    Leaf,
    Map as MapIcon,
    Bug,
    TrendingUp,
    Home,
    Globe,
    Users,
    User,
} from "lucide-react";
import Navigation from "./components/Navigation";
import CropAdvisory from "./components/CropAdvisory";
import FarmVisualization from "./components/FarmVisualization";
import PestWatch from "./components/PestWatch";
import MarketLinkage from "./components/MarketLinkage";
import Dashboard from "./components/Dashboard";
import ExpertConsultation from "./components/ExpertConsultation";
import Chatbot from "./components/Chatbot";
import AuthWrapper from "./components/AuthWrapper";
import UserProfile from "./components/UserProfile";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

type ActiveTab =
    | "dashboard"
    | "advisory"
    | "farm"
    | "pest"
    | "market"
    | "consult";

const AppContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { t, language, setLanguage } = useLanguage();
    const { state } = useAuth();

    const navigationItems = [
        { id: "dashboard", label: t("nav.dashboard"), icon: Home },
        { id: "advisory", label: t("nav.cropAdvisory"), icon: Leaf },
        { id: "farm", label: t("nav.farmView"), icon: MapIcon },
        { id: "pest", label: t("nav.pestWatch"), icon: Bug },
        { id: "market", label: t("nav.market"), icon: TrendingUp },
        { id: "consult", label: t("nav.expertConsult"), icon: Users },
    ];

    const renderActiveComponent = () => {
        switch (activeTab) {
            case "dashboard":
                return <Dashboard onNavigate={setActiveTab} />;
            case "advisory":
                return <CropAdvisory />;
            case "farm":
                return <FarmVisualization />;
            case "pest":
                return <PestWatch />;
            case "market":
                return <MarketLinkage />;
            case "consult":
                return <ExpertConsultation />;
            default:
                return <Dashboard onNavigate={setActiveTab} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-dark-900 dark:via-dark-900 dark:to-dark-800 transition-colors duration-200">
            {/* Enhanced Header */}
            <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 shadow-sm backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 sticky top-0 z-50 transition-all duration-200">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-18">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 transition-all duration-200 flex-shrink-0 hover:shadow-xl hover:scale-105">
                                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent transition-colors duration-200 truncate">
                                    {t("header.title")}
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-400 transition-colors duration-200 hidden xs:block truncate">
                                    {t("header.subtitle")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                            <button
                                onClick={() =>
                                    setLanguage(language === "en" ? "hi" : "en")
                                }
                                className="flex items-center px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                            >
                                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                                <span className="hidden sm:inline">
                                    {language === "en" ? "हिंदी" : "English"}
                                </span>
                                <span className="sm:hidden">
                                    {language === "en" ? "हि" : "En"}
                                </span>
                            </button>

                            {/* Theme Toggle */}
                            <ThemeToggle size="sm" />

                            {/* User Profile Button */}
                            <button
                                onClick={() => setIsProfileOpen(true)}
                                className="flex items-center px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                            >
                                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                                <span className="hidden sm:inline truncate max-w-24">
                                    {state.user?.name || "Profile"}
                                </span>
                                <span className="sm:hidden">Me</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <Navigation
                items={navigationItems}
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab as ActiveTab)}
            />

            <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
                <div className="animate-fadeIn">{renderActiveComponent()}</div>
            </main>

            {/* AI Chatbot */}
            <Chatbot />

            {/* User Profile Modal */}
            <UserProfile
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <LanguageProvider>
                    <AuthWrapper>
                        <AppContent />
                    </AuthWrapper>
                </LanguageProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
