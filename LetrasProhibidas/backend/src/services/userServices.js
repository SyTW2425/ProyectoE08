import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Servicio de usuarios para manejar operaciones relacionadas con usuarios.
 */
export class UserServices {
  static instance;

  constructor() {}

  /**
   * Obtiene la instancia única de UserServices.
   * @returns {UserServices} La instancia de UserServices.
   */
  static getInstance() {
    if (!UserServices.instance) {
      UserServices.instance = new UserServices();
    }
    return UserServices.instance;
  }

  /**
   * Crea un nuevo usuario.
   * @param {string} name - El nombre del usuario.
   * @param {string} password - La contraseña del usuario.
   * @param {string} email - El correo electrónico del usuario.
   * @returns {Promise<User>} El usuario creado.
   * @throws {Error} Si ocurre un error al guardar el usuario.
   */
  async createUser(username, password, email, avatarSrc) {
    const user = new User({ name: username, password, email, avatarSrc });
    // Verificar si el nombre de usuario existe
    const existingUser = await User.findOne({ username });
    if (existingUser) throw new Error("El nombre de usuario ya existe");
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      throw new Error("El correo electrónico ya está registrado");
    await user.save().catch((err) => {
      throw new Error(err);
    });
    const token = jwt.sign(
      { userID: user.id, name: user.name },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );
    return {
      token: token,
      id: user.id,
      name: user.name,
      avatar: user.avatarSrc,
    };
  }

  /**
   * Obtiene un usuario por su nombre.
   * @param {string} name - El nombre del usuario.
   * @returns {Promise<User>} El usuario encontrado.
   * @throws {Error} Si ocurre un error al buscar el usuario.
   */
  async getUserByName(name) {
    return await User.findOne({ name }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene un usuario por su ID.
   * @param {string} id - El ID del usuario.
   * @returns {Promise<User>} El usuario encontrado.
   * @throws {Error} Si ocurre un error al buscar el usuario.
   */
  async getUserById(id) {
    return await User.findOne({ id }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene un usuario por su correo electrónico.
   * @param {string} email - El correo electrónico del usuario.
   * @returns {Promise<User>} El usuario encontrado.
   * @throws {Error} Si ocurre un error al buscar el usuario.
   */
  async getUserByEmail(email) {
    return await User.findOne({ email }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene un usuario por su ID de MongoDB.
   * @param {string} _id - El ID de MongoDB del usuario.
   * @returns {Promise<User>} El usuario encontrado.
   * @throws {Error} Si ocurre un error al buscar el usuario.
   */
  async getUserByMongoId(_id) {
    return await User.findById(_id).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Actualiza la fecha de última conexión de un usuario.
   * @param {string} id - El ID del usuario.
   * @returns {Promise<UpdateResult>} El resultado de la actualización.
   * @throws {Error} Si ocurre un error al actualizar el usuario.
   */
  async updateUserLastConnected(id) {
    try {
      const user = await this.getUserById(id);
      if (!user) throw new Error("User not found");
      user.lastConnected = Date.now();
      await user.save();
      return user;
    } catch (err) {
      throw new Error(`Error updating last connected date: ${err.message}`);
    }
  }

  /**
   * Elimina un usuario por su ID.
   * @param {string} id - El ID del usuario.
   * @returns {Promise<DeleteResult>} El resultado de la eliminación.
   * @throws {Error} Si ocurre un error al eliminar el usuario.
   */
  async deleteUser(id) {
    return await User.deleteOne({ id }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Elimina un usuario por su nombre.
   * @param {string} name - El nombre del usuario.
   * @returns {Promise<DeleteResult>} El resultado de la eliminación.
   * @throws {Error} Si ocurre un error al eliminar el usuario.
   */
  async deleteUserByName(name) {
    return await User.deleteOne({ name }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Elimina un usuario por su correo electrónico.
   * @param {string} email - El correo electrónico del usuario.
   * @returns {Promise<DeleteResult>} El resultado de la eliminación.
   * @throws {Error} Si ocurre un error al eliminar el usuario.
   */
  async deleteUserByEmail(email) {
    return await User.deleteOne({ email }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Elimina un usuario por su ID de MongoDB.
   * @param {string} _id - El ID de MongoDB del usuario.
   * @returns {Promise<DeleteResult>} El resultado de la eliminación.
   * @throws {Error} Si ocurre un error al eliminar el usuario.
   */
  async deleteUserByMongoId(_id) {
    return await User.deleteOne({ _id }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene todos los usuarios.
   * @returns {Promise<User[]>} Una lista de todos los usuarios.
   * @throws {Error} Si ocurre un error al obtener los usuarios.
   */
  async getAllUsers() {
    return await User.find().catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Compara la contraseña del usuario con una contraseña de entrada.
   * @param {User} user - El usuario.
   * @param {string} inputPassword - La contraseña de entrada.
   * @returns {Promise<boolean>} El resultado de la comparación.
   */
  async comparePassword(user, inputPassword) {
    try {
      return await user.comparePassword(inputPassword);
    } catch (err) {
      console.error("Error in comparePassword:", err);
      throw err;
    }
  }

  /**
   * Actualiza la contraseña de un usuario.
   * @param {string} name - El nombre del usuario.
   * @param {string} newPassword - La nueva contraseña.
   * @returns {Promise<User>} El usuario actualizado.
   * @throws {Error} Si ocurre un error al actualizar la contraseña.
   */
  async updateUserPassword(name, newPassword) {
    const user = await this.getUserByName(name);
    user.password = newPassword;
    return await user.save().catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Inicia sesión de un usuario con el nombre y contraseña proporcionados.
   *
   * @async
   * @param {string} name - El nombre del usuario.
   * @param {string} password - La contraseña del usuario.
   * @returns {Promise<Object>} Un objeto que contiene el token de autenticación y el ID del usuario.
   * @throws {Error} Si la contraseña es incorrecta o ocurre algún otro error durante el proceso de inicio de sesión.
   */
  async login(username, password, newAvatar) {
    try {
      const user = await this.getUserByName(username);
      if (user.avatarSrc !== newAvatar) {
        user.avatarSrc = newAvatar;
        await user.save();
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error("Contraseña incorrecta");
      const token = jwt.sign(
        { userID: user.id, name: user.name },
        process.env.SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );
      return {
        token: token,
        id: user.id,
        name: user.name,
        avatar: user.avatarSrc,
      };
    } catch (err) {
      throw err;
    }
  }

  async sumStats(addGamesWon, addGamesPlayed, addWordsGuessed, id) {
    try {
      const user = await this.getUserById(id);
      user.gamesWon += addGamesWon;
      user.gamesPlayed += addGamesPlayed;
      user.wordsGuessed += addWordsGuessed;
      await user.save();
    } catch (err) {
      throw err;
    }
  }

  async updateAvatar(name, avatarSrc) {
    try {
      const user = await this.getUserByName(name);
      user.avatarSrc = avatarSrc;
      await user.save();
    } catch (err) {
      throw err;
    }
  }
}
