import { model, Schema } from "mongoose"

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, match: "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$", required: true },
  pfpURL: { type: String },
  id: { type: String, required: true},
  createdAt: { type: Date, required: true },
  lastConnected: { type: Date}
})
