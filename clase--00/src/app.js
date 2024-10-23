import express from "express"
import mongoose from "mongoose"

const app = express()
mongoose.connect("mongodb://localhost:27017/clase0")

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})