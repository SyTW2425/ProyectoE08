import { Game } from "../models/game.js";

/**
 * Servicio de juegos para manejar operaciones relacionadas con juegos.
 */
export class GameServices {
  static instance;

  constructor() {}

  /**
   * Obtiene la instancia única de GameServices.
   * @returns {GameServices} La instancia de GameServices.
   */
  static getInstance() {
    if (!GameServices.instance) {
      GameServices.instance = new GameServices();
    }
    return GameServices.instance;
  }

  /**
   * Crea un nuevo juego.
   * @param {string} lobbyID - El ID del lobby.
   * @param {Array} players - Los jugadores del juego.
   * @returns {Promise<Game>} El juego creado.
   * @throws {Error} Si ocurre un error al guardar el juego.
   */
  async createGame(lobbyID, players) {
    const game = new Game({ lobbyID, players });
    return await game.save().catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene un juego por su ID.
   * @param {string} id - El ID del juego.
   * @returns {Promise<Game>} El juego encontrado.
   * @throws {Error} Si ocurre un error al buscar el juego.
   */
  async getGameById(id) {
    return await Game.findOne({ id }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene un juego por su ID de MongoDB.
   * @param {string} _id - El ID de MongoDB del juego.
   * @returns {Promise<Game>} El juego encontrado.
   * @throws {Error} Si ocurre un error al buscar el juego.
   */
  async getGameByMongoId(_id) {
    return await Game.findById(_id).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Actualiza el ganador de un juego.
   * @param {string} id - El ID del juego.
   * @param {string} winnerID - El ID del ganador.
   * @returns {Promise<UpdateResult>} El resultado de la actualización.
   * @throws {Error} Si ocurre un error al actualizar el juego.
   */
  async updateGameWinner(id, winnerID) {
    return await Game.updateOne({ id }, { winnerID }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Elimina un juego por su ID.
   * @param {string} id - El ID del juego.
   * @returns {Promise<DeleteResult>} El resultado de la eliminación.
   * @throws {Error} Si ocurre un error al eliminar el juego.
   */
  async deleteGame(id) {
    return await Game.deleteOne({ id }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Elimina un juego por su ID de MongoDB.
   * @param {string} _id - El ID de MongoDB del juego.
   * @returns {Promise<DeleteResult>} El resultado de la eliminación.
   * @throws {Error} Si ocurre un error al eliminar el juego.
   */
  async deleteGameByMongoId(_id) {
    return await Game.deleteOne({ _id }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene todos los juegos.
   * @returns {Promise<Game[]>} Una lista de todos los juegos.
   * @throws {Error} Si ocurre un error al obtener los juegos.
   */
  async getAllGames() {
    return await Game.find().catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene todos los juegos de un usuario.
   */
  async getAllUsersGames(userID) {
    return await Game.find({ players: { $in: [userID] } }).catch((err) => {
      throw new Error(err.message);
    });
  }
}
