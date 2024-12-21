import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI_TEST;

if (!process.env.MONGODB_URI_TEST) {
  console.log("No se ha encontrado la URI de la base de datos de prueba");
}

connect(uri)
  .then(() => {
    console.log("Conexión a la base de datos de prueba exitosa");
  })
  .catch((error) => {
    console.log("Error al conectar a la base de datos de prueba", error);
  });
