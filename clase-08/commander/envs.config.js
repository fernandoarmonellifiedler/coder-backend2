import dotenv from "dotenv";
import { program } from "./commander.js";

const setPath = (mode) => {
  switch (mode) {
    case "production":
      return ".env.prod"
    case "development":
      return ".env.dev"  
    default:
      return ".env"
  }
  
}

const mode = program.opts().m;

dotenv.config({ path: setPath(mode)});

export default {
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY
}

