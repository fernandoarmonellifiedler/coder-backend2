import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
      mongoose.connect("mongodb+srv://admin:123@cluster0.q5rht.mongodb.net/e-commerce")
      console.log("MongoDB connected");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}