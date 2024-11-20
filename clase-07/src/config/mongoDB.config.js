import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    mongoose.connect('mongodb+srv://fernandoarmonelli:EGDFjlF1Twc9QOuW@cluster0.xih0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}