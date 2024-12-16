/**
 * This module sets up and runs an Express application server with HTTP and WebSocket protocols, MongoDB connection, 
 * express middlewares and session handling.
 *  
 * @module Server
 * @requires express 
 * @requires cookie-parser
 * @requires ./routes/index.js
 * @requires socket.io
 * @requires ./config/mongoDB.config.js
 * @requires express-session
 * @requires ./config/passport.config.js
 * @requires ./config/envs.config.js
 * @requires cors 
 */

// Import necessary dependencies and modules
import cookieParser from "cookie-parser";
import express from "express";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import { connectMongoDB } from "./config/mongoDB.config.js";
import session from "express-session";
import { initializePassport } from "./config/passport.config.js";
import envsConfig from "./config/envs.config.js";
import cors from "cors";

// Initialize the Express application
const app = express();

// Connect to MongoDB and configure Passport for user authentication
connectMongoDB();
initializePassport();

// Apply middlewares to the Express app
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable all CORS requests

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Add a session middleware 
app.use(
  session({
    secret: envsConfig.SECRET_KEY, // Secret key for the session
    resave: true, // Resave the session
    saveUninitialized: true, // Save uninitialized sessions
  })
);

// Add a cookie parser middleware
app.use(cookieParser(envsConfig.SECRET_KEY));

// Define main API route
app.use("/api", routes);

// Start the HTTP server and listen on a specific port
const httpServer = app.listen(envsConfig.PORT, () => {
  console.log(`Server listening on port ${envsConfig.PORT}`);
});

// Set up WebSocket (Socket.io) configuration
export const io = new Server(httpServer);

// Log a message whenever a user connects to the socket
io.on("connection", (socket) => {
  console.log("New user connected");
});