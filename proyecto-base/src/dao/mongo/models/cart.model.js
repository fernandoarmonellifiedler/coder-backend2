import mongoose from "mongoose";

// Define the collection name for the cart
const cartCollection = "cart";

// Create the schema for the cart
const cartSchema = new mongoose.Schema({
  // Define the products field as an array of objects
  products: {
    type: [
      {
        // Reference to product ObjectId from the product collection
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, 
        // Quantity of the product in the cart
        quantity: { type: Number, required: true } // Mark quantity as required
      }
    ],
    default: [] // Set default to an empty array
  },
});

// Create the cart model using the cart schema
export const cartModel = mongoose.model(cartCollection, cartSchema);