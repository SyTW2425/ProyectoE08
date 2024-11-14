import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.MONGODB_URI);

connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB database" + error);
  });
