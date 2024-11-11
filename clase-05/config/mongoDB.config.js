import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connect("mongodb+srv://admin:123@cluster0.xih0z.mongodb.net/coderBank");
        console.log("Mongo DB connected");
    } catch (error) {
        console.log("Error connecting with Mongo DB");
    }
}