// Import necessary modules
import express from "express"; // Express.js framework is used to handle HTTP requests
import handlebars from "express-handlebars"; // Handlebars templating engine for Express.js
import _dirname from "./dirname.js"; // Path to the current directory
import viewRoutes from "./routes/views.routes.js"; // Custom routing module

const PORT = 8080; // Port number on which the server will listen

// Create an instance of Express application
const app = express();

// Middleware that parses incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(express.urlencoded({ extended: true }));

// Middleware that parses incoming requests with JSON payloads
app.use(express.json());

// Setting up Handlebars as template engine
app.engine("handlebars", handlebars({defaultLayout: 'main'}));

// Set path where views (templates) are stored
app.set("views", _dirname + "/views");

// Set default view (template) engine
app.set("view engine", "handlebars");

// Serving static files from 'public' directory
app.use(express.static("public"));

// Use custom routes for handling requests
app.use("/", viewRoutes);

// Start the server and listen on specified port
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`); // Logs the running port after successful connection
});