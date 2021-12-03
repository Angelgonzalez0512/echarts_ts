import dotenv from 'dotenv';
dotenv.config();
export default {
    port: process.env.PORT || 3000,
    APP_URL:process.env.APP_URL || "http://localhost",
}