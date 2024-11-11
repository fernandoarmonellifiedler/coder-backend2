import express from "express";
import { connectDB } from "../config/mongoDB.config.js";
import router from "./router/index.router.js";

const app = express();
connectDB();

app.use("/api", router);

app.listen(8080, () => {
    console.log("server on port 8080");
}) 