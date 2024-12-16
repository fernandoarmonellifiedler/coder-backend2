
import fs from "fs";
import { productModel } from "../dao/mongo/models/product.model.js";

export const addSeedProducts = async () => {
    const data = fs.readFileSync('./src/seed/data/products.json', 'utf-8');
    const products = JSON.parse(data);
    await productModel.insertMany(products);
}

