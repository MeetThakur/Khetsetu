import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User";
import { logger } from "../config/logger";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

/**
 * Script to update user subscription plan
 * Usage: ts-node src/scripts/updateUserSubscription.ts <email> <plan>
 * Example: ts-node src/scripts/updateUserSubscription.ts user@example.com basic
 */

const updateUserSubscription = async (
    email: string,
    plan: "free" | "basic" | "premium",
) => {
    try {
        // Connect to MongoDB
        const mongoUri =
            process.env.MONGO_URI || "mongodb://localhost:27017/khetsetu";
        await mongoose.connect(mongoUri);
        logger.info("Connected to MongoDB");

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            logger.error(`User with email ${email} not found`);
            process.exit(1);
        }

        // Calculate expiration date (1 year from now for paid plans)
        const expiresAt =
            plan !== "free"
                ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                : undefined;

        // Update subscription
        user.subscription = {
            plan,
            expiresAt,
            features: getFeaturesByPlan(plan),
        };

        await user.save();

        logger.info(`✅ Successfully updated ${email} to ${plan} plan`);
        logger.info(
            `Subscription expires: ${expiresAt ? expiresAt.toISOString() : "N/A"}`,
        );
        logger.info(`Features: ${user.subscription.features.join(", ")}`);

        process.exit(0);
    } catch (error) {
        logger.error("Error updating user subscription:", error);
        process.exit(1);
    }
};

const getFeaturesByPlan = (plan: string): string[] => {
    switch (plan) {
        case "premium":
            return [
                "ai_chat",
                "crop_recommendations",
                "pest_identification",
                "soil_analysis",
                "weather_alerts",
                "market_insights",
                "farming_calendar",
                "priority_support",
                "advanced_analytics",
                "unlimited_farms",
            ];
        case "basic":
            return [
                "ai_chat",
                "crop_recommendations",
                "pest_identification",
                "soil_analysis",
                "weather_alerts",
                "market_insights",
                "farming_calendar",
                "up_to_5_farms",
            ];
        case "free":
        default:
            return [
                "ai_chat",
                "basic_weather",
                "basic_market_prices",
                "up_to_2_farms",
            ];
    }
};

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
    console.log(
        "Usage: ts-node src/scripts/updateUserSubscription.ts <email> [plan]",
    );
    console.log("Plans: free, basic, premium (default: basic)");
    console.log(
        "Example: ts-node src/scripts/updateUserSubscription.ts user@example.com basic",
    );
    process.exit(1);
}

const email = args[0];
const plan = (args[1] as "free" | "basic" | "premium") || "basic";

if (!["free", "basic", "premium"].includes(plan)) {
    logger.error(`Invalid plan: ${plan}. Must be one of: free, basic, premium`);
    process.exit(1);
}

updateUserSubscription(email, plan);
