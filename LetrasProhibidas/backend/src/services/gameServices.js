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
   * @param {string} gameID - El ID del lobby.
   * @param {Array} players - Los jugadores del juego.
   * @returns {Promise<Game>} El juego creado.
   * @throws {Error} Si ocurre un error al guardar el juego.
   */
  async createGame(players, lobbyID) {
    const game = new Game({ players, lobbyID });
    return await game.save().catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene un juego por su ID.
   * @param {string} game - El ID del juego.
   * @returns {Promise<Game>} El juego encontrado.
   * @throws {Error} Si ocurre un error al buscar el juego.
   */
  async getGameByGameID(gameID) {
    return await Game.findOne({ gameID }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Actualiza el ganador de un juego.
   * @param {string} gameID - El ID del juego.
   * @param {string} winnerID - El ID del ganador.
   * @returns {Promise<UpdateResult>} El resultado de la actualización.
   * @throws {Error} Si ocurre un error al actualizar el juego.
   */
  async updateGameWinner(gameID, winnerID) {
    try {
      const result = await Game.updateOne({ gameID }, { winnerID });
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Elimina un juego por su ID.
   * @param {string} gameID - El ID del juego.
   * @returns {Promise<DeleteResult>} El resultado de la eliminación.
   * @throws {Error} Si ocurre un error al eliminar el juego.
   */
  async deleteGame(gameID) {
    return await Game.deleteOne({ gameID }).catch((err) => {
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

  async addPlayerToGame(newPlayer, gameID) {
   const game = await this.getGameByGameID(gameID)
   // Comprobar que no meta al mismo usuario varias veces
   if (game.players.some((player) => player.userID === newPlayer.userID)) {
    throw new Error("User is already in game")
    }
    return await Game.updateOne({gameID}, {$push: {players: newPlayer}})    
  }
}
