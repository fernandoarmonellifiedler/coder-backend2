import express from "express";
import routes from "./routes/index.js";
import __dirname from "./dirname.js";
import { Server } from "socket.io";
import { connectMongoDB } from "./config/mongoDB.config.js";
import session from "express-session";
import { initializePassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser";

const app = express();

connectMongoDB();
initializePassport();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "secret",
    resave: true, // Mantiene la session activa, si esto est el false la session se cierra
    saveUninitialized: true, // Guarde la session
  })
);
app.use(cookieParser("secretKey"));
// Rutas de la api
app.use("/api", routes);

const httpServer = app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});

// Configuramos socket
export const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Nuevo usuario Conectado");
});
