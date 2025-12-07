import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})

export const ENV = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASS: process.env.REDIS_PASS,
};