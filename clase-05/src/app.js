import express from "express";
import { connectDB } from "../config/mongoDB.config.js";

const app = express();
connectDB();

app.listen(8080, () => {
    console.log("server on port 8080");
}) 