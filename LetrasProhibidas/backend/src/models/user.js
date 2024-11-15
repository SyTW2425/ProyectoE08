import { model, Schema } from "mongoose";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4,
    validate: {
      validator: (value) => validator.isUUID(value),
      message: "Invalid ID",
    },
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lastConnected: {
    type: Date,
  },
});

// Middleware para hashear la contraseña antes de guardarla
UserSchema.pre("save", async function (next) {
  // Solo hashea si la contraseña ha sido modificada o es nueva
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    return next(err);
  }
});

// Método para comparar la contraseña ingresada con el hash almacenado
UserSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};


export const User = model("User", UserSchema);