import { Router } from "express";
import { body } from "express-validator";
import {
    chat,
    getCropAdvice,
    identifyPest,
    analyzeSoil,
    getAIStatus,
    generateFarmingCalendar,
} from "../controllers/aiController";
import { checkSubscription, authenticate } from "../middleware/auth";

// Development mode bypass for subscription checks
const isDevelopment = process.env.NODE_ENV === "development";
const devBypassSubscription = (req: any, res: any, next: any) => {
    if (isDevelopment) {
        console.log("⚠️  Development mode: Bypassing subscription check");
        return next();
    }
    return checkSubscription("basic")(req, res, next);
};

const router = Router();

// Validation rules
const chatValidation = [
    body("message")
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage("Message must be between 1 and 1000 characters"),
    body("context")
        .optional()
        .isObject()
        .withMessage("Context must be an object"),
    body("conversationHistory")
        .optional()
        .isArray({ max: 10 })
        .withMessage("Conversation history must be an array with max 10 items"),
];

const cropAdviceValidation = [
    body("budget")
        .isFloat({ min: 1000 })
        .withMessage("Budget must be at least ₹1000"),
    body("farmSize")
        .isFloat({ min: 0.1 })
        .withMessage("Farm size must be at least 0.1 acres"),
    body("soilType")
        .isIn(["clay", "sandy", "loamy", "silt", "peat", "chalk"])
        .withMessage("Invalid soil type"),
    body("location.state")
        .trim()
        .isLength({ min: 2 })
        .withMessage("State is required"),
    body("location.district")
        .trim()
        .isLength({ min: 2 })
        .withMessage("District is required"),
    body("location.coordinates.latitude")
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Invalid latitude"),
    body("location.coordinates.longitude")
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Invalid longitude"),
    body("season")
        .isIn(["kharif", "rabi", "summer", "year_round"])
        .withMessage("Invalid season"),
    body("experience")
        .isIn(["beginner", "intermediate", "expert"])
        .withMessage("Invalid experience level"),
    body("farmingMethod")
        .isIn(["organic", "conventional", "mixed"])
        .withMessage("Invalid farming method"),
    body("waterAvailability")
        .optional()
        .isIn(["abundant", "moderate", "limited"])
        .withMessage("Invalid water availability"),
    body("laborAvailability")
        .optional()
        .isIn(["abundant", "moderate", "limited"])
        .withMessage("Invalid labor availability"),
    body("constraints.storageCapacity")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Storage capacity must be positive"),
    body("constraints.transportAccess")
        .optional()
        .isIn(["excellent", "good", "fair", "poor"])
        .withMessage("Invalid transport access level"),
];

const pestIdentificationValidation = [
    body("crop")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Crop name must be between 2 and 50 characters"),
    body("symptoms")
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage(
            "Symptoms description must be between 10 and 500 characters",
        ),
    body("location.state")
        .trim()
        .isLength({ min: 2 })
        .withMessage("State is required"),
    body("location.district")
        .trim()
        .isLength({ min: 2 })
        .withMessage("District is required"),
    body("season")
        .isIn(["kharif", "rabi", "summer", "year_round"])
        .withMessage("Invalid season"),
    body("imageData")
        .optional()
        .isBase64()
        .withMessage("Image data must be valid base64"),
    body("imageDescription")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Image description must not exceed 200 characters"),
];

const soilAnalysisValidation = [
    body("ph")
        .optional()
        .isFloat({ min: 0, max: 14 })
        .withMessage("pH must be between 0 and 14"),
    body("nitrogen")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Nitrogen content must be positive"),
    body("phosphorus")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Phosphorus content must be positive"),
    body("potassium")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Potassium content must be positive"),
    body("organicMatter")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("Organic matter must be between 0 and 100%"),
    body("soilType")
        .isIn(["clay", "sandy", "loamy", "silt", "peat", "chalk"])
        .withMessage("Invalid soil type"),
    body("location.state")
        .trim()
        .isLength({ min: 2 })
        .withMessage("State is required"),
    body("location.district")
        .trim()
        .isLength({ min: 2 })
        .withMessage("District is required"),
    body("intendedCrop")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Intended crop must be between 2 and 50 characters"),
];

const farmingCalendarValidation = [
    body("advisoryId").isMongoId().withMessage("Invalid advisory ID"),
    body("selectedCrops")
        .isArray({ min: 1, max: 5 })
        .withMessage("Must select between 1 and 5 crops"),
    body("selectedCrops.*")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Each crop name must be at least 2 characters"),
];

// Public routes (basic AI chat for everyone)
router.post("/chat", chatValidation, chat);

// Premium routes (crop advice) - using dev bypass in development mode
router.post(
    "/crop-advice",
    devBypassSubscription,
    cropAdviceValidation,
    getCropAdvice,
);

// Premium routes (pest identification with image analysis) - using dev bypass in development mode
router.post(
    "/pest-identification",
    devBypassSubscription,
    pestIdentificationValidation,
    identifyPest,
);

// Premium routes (soil analysis) - using dev bypass in development mode
router.post(
    "/soil-analysis",
    devBypassSubscription,
    soilAnalysisValidation,
    analyzeSoil,
);

// Premium routes (farming calendar generation) - using dev bypass in development mode
router.post(
    "/farming-calendar",
    devBypassSubscription,
    farmingCalendarValidation,
    generateFarmingCalendar,
);

// AI status and capabilities
router.get("/status", getAIStatus);

export default router;
