import mongoose from "mongoose";
import envsConfig from "./envs.config.js";
console.log(envsConfig.MONGO_URL);
export const connectMongoDB = async () => {
  try {
    mongoose.connect(envsConfig.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
