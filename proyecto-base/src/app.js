import express from "express";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import { connectMongoDB } from "./config/mongoDB.config.js";
import session from "express-session";
import { initializePassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser";

// Inicializamos la aplicación Express
const app = express();

// Conectamos a MongoDB y configuramos Passport
connectMongoDB();
initializePassport();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser("secretKey")); // Configuración para las cookies

// Configuración de la sesión
app.use(
  session({
    secret: "secret", // Clave secreta para la sesión
    resave: true, // Mantener la sesión activa
    saveUninitialized: true, // Guardar la sesión aunque no haya cambios
  })
);

// Rutas de la API
app.use("/api", routes);

// Iniciamos el servidor HTTP
const httpServer = app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});

// Configuración de WebSockets (Socket.io)
export const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");
});
