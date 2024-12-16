import mongoose from "mongoose";

// Define the collection name for users
const userCollection = "users";

// Create the schema for the user
const userSchema = new mongoose.Schema({
  // User's first name
  first_name: {
    type: String, // Type is String
    required: true, // Mark first name as required
  },
  // User's last name
  last_name: {
    type: String, // Type is String
    required: true, // Mark last name as required
  },
  // User's password
  password: {
    type: String, // Type is String
    required: true, // Mark password as required
  },
  // User's email address
  email: {
    type: String, // Type is String
    unique: true, // Ensure email is unique
    required: true, // Mark email as required
    lowercase: true, // Convert email to lowercase for consistency
  },
  // User's age
  age: {
    type: Number, // Type is Number
    min: 0, // Ensure age is a non-negative value
  },
  // Role of the user (default is 'user')
  role: {
    type: String,
    default: "user", // Set default role to 'user'
  },
  // Reference to the user's cart
  cart: {
    type: mongoose.Schema.Types.ObjectId, // Type is ObjectId
    ref: "cart" // Reference to the "cart" model
  },
});

// Create and export the user model using the user schema
export const userModel = mongoose.model(userCollection, userSchema);