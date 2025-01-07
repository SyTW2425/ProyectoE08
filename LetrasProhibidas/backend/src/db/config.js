import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/letrasprohibidas";

if (!process.env.MONGODB_URI) {
  console.log("No MONGODB_URI provided, using default URI");
}

connect(uri)
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB database");
    console.log(error);
  });
