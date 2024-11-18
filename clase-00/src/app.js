import express from 'express';
import mongoose from 'mongoose';
import router from './router/index.router.js';

const app = express();
mongoose.connect('mongodb://localhost:27017/clase00');
console.log('Mongo db connect');
console.log(localhost);
// Middleware para manejar JSON
app.use(express.json());

app.use("/api", router);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
