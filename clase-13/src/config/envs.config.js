import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_KEY: process.env.JWT_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GMAIL_PASS: process.env.GMAIL_PASS
};
