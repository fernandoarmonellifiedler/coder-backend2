import cookieParser from "cookie-parser";
import express from "express";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import { connectMongoDB } from "./config/mongoDB.config.js";
import session from "express-session";
import { initializePassport } from "./config/passport.config.js";

import envsConfig from "./config/envs.config.js";
import cors from "cors";

// Inicializamos la aplicación Express
const app = express();

// Conectamos a MongoDB y configuramos Passport
connectMongoDB();
initializePassport();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static("public"));
app.use(
  session({
    secret: envsConfig.SECRET_KEY, // Clave secreta para la sesión
    resave: true, // Mantener la sesión activa
    saveUninitialized: true, // Guardar la sesión aunque no haya cambios
  })
);
app.use(cookieParser(envsConfig.SECRET_KEY));
// Rutas de la API
app.use("/api", routes);

// Iniciamos el servidor HTTP
const httpServer = app.listen(envsConfig.PORT, () => {
  console.log(`Servidor escuchando en el puerto ${envsConfig.PORT}`);
});

// Configuración de WebSockets (Socket.io)
export const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");
});
