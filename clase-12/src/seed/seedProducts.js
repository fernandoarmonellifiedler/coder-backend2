import fs from "fs";

const addSeedProducts = () => {
    const products = fs.readFileSync('./data/products.json', 'utf-8');
}