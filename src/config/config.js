import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT || 8000,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  MONGO_URI: process.env.MONGO_URI,
};
