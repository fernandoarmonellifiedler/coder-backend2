import express from "express";
import routes from "./routes/index.js";
import __dirname from "./dirname.js";
import { Server } from "socket.io";
import { connectMongoDB } from "./config/mongoDB.config.js";

const app = express();

connectMongoDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

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
