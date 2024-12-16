import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  age: {
    type: Number,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "cart" }
});

export const userModel = mongoose.model(userCollection, userSchema);
