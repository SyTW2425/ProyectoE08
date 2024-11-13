import { connect } from "mongoose";

connect((process.env.MONGODB_URI))
  .then(() => {
    console.log("Connected to MongoDB database")
  }).catch(() => {
    console.log("Unable to connect to MongoDB database")
  })