import dotenv from "dotenv"

dotenv.config()

const env = {
    "MONGODB_URI": process.env.MONGODB_URI!,
    "CORS_ORIGIN": process.env.CORS_ORIGIN!,
    "PORT": process.env.PORT || 5000,
    "JWT_SECRET": process.env.JWT_SECRET!,
    "MONGODB_NAME": process.env.MONGODB_NAME!,
    "CLUSTER_NAME": process.env.CLUSTER_NAME!,
};

// Check if environment variables are defined
for (const [key, value] of Object.entries(env)) {
    if (typeof value === "undefined") {
        console.log(`Missing environment variable: ${key}`)
    }
}

export default env
