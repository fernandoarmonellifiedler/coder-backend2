import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Define the collection name for the product
const productCollection = "product";

// Create the schema for the product
const productSchema = new mongoose.Schema({
  // Title of the product
  title: { type: String, required: true }, // Mark title as required
  // Description of the product
  description: { type: String, required: true }, // Mark description as required
  // Price of the product
  price: { type: Number, required: true, min: 0 }, // Mark price as required and must be non-negative
  // Thumbnail images for the product
  thumbnail: {
    type: Array,
    default: [] // Set default to an empty array
  },
  // Unique product code
  code: { type: String, required: true, unique: true }, // Mark code as required and unique
  // Stock availability for the product
  stock: { type: Number, required: true, min: 0 }, // Mark stock as required and must be non-negative
  // Category of the product
  category: { type: String, required: true }, // Mark category as required
  // Status of the product (active/inactive)
  status: {
    type: Boolean,
    default: true // Set default status to true (active)
  }
});

// Add pagination capability to the product schema
productSchema.plugin(mongoosePaginate);

// Create and export the product model using the product schema
export const productModel = mongoose.model(productCollection, productSchema);