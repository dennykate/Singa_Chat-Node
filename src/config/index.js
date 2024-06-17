import dotenv from "dotenv";

dotenv.config();

export default {
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/chat",
  PORT: process.env.PORT || "5000",
  API_PREFIX: "/api",
  secret_key: process.env.SECRET || "Secret for jsonwebtoken",
  refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY || "1d",
  sessionKey: `${Math.floor(Math.random() * 10000000)}`,
};
