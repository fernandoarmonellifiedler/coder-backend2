import fs from "fs"; // Import the filesystem module to read files.
import { productModel } from "../dao/mongo/models/product.model.js"; // Import the product model for database operations.

/**
 * Function to add seed products to the database.
 * This function reads product data from a JSON file and inserts it into the database.
 */
export const addSeedProducts = async () => {
    // Read the products data from the JSON file
    const data = fs.readFileSync('./src/seed/data/products.json', 'utf-8');
    
    // Parse the JSON data to an array of products
    const products = JSON.parse(data);
    
    // Insert the products into the database usando el modelo de producto
    await productModel.insertMany(products);
};