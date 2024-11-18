import express from 'express';
import mongoose from 'mongoose';
import router from './router/index.router.js';

const app = express();
mongoose.connect('mongodb+srv://fernandoarmonelli:EGDFjlF1Twc9QOuW@cluster0.xih0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
console.log('Mongo db connect');

// Middleware para manejar JSON
app.use(express.json());

app.use("/api", router);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
