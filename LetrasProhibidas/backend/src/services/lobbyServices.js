import { Lobby } from "../models/lobby.js";

/**
 * Servicio de lobbies para manejar operaciones relacionadas con lobbies.
 */
export class LobbyServices {
  static instance;

  constructor() {}

  /**
   * Obtiene la instancia única de LobbyServices.
   * @returns {LobbyServices} La instancia de LobbyServices.
   */
  static getInstance() {
    if (!LobbyServices.instance) {
      LobbyServices.instance = new LobbyServices();
    }
    return LobbyServices.instance;
  }

  /**
   * Crea un nuevo lobby.
   * @param {string} hostID - El ID del anfitrión.
   * @param {Array} players - Los jugadores del lobby.
   * @param {number} maxPlayers - El número máximo de jugadores.
   * @returns {Promise<Lobby>} El lobby creado.
   * @throws {Error} Si ocurre un error al guardar el lobby.
   */
  async createLobby(hostID, players, maxPlayers) {
    const lobby = new Lobby({ hostID, players, maxPlayers });
    return await lobby.save().catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene un lobby por su ID.
   * @param {string} id - El ID del lobby.
   * @returns {Promise<Lobby>} El lobby encontrado.
   * @throws {Error} Si ocurre un error al buscar el lobby.
   */
  async getLobbyById(id) {
    return await Lobby.findOne({ id }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene un lobby por su ID de MongoDB.
   * @param {string} _id - El ID de MongoDB del lobby.
   * @returns {Promise<Lobby>} El lobby encontrado.
   * @throws {Error} Si ocurre un error al buscar el lobby.
   */
  async getLobbyByMongoId(_id) {
    return await Lobby.findById(_id).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Actualiza los jugadores de un lobby.
   * @param {string} id - El ID del lobby.
   * @param {Array} players - Los jugadores actualizados del lobby.
   * @returns {Promise<UpdateResult>} El resultado de la actualización.
   * @throws {Error} Si ocurre un error al actualizar el lobby.
   */
  async updateLobbyPlayers(id, players) {
    return await Lobby.updateOne({ id }, { players }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Elimina un lobby por su ID.
   * @param {string} id - El ID del lobby.
   * @returns {Promise<DeleteResult>} El resultado de la eliminación.
   * @throws {Error} Si ocurre un error al eliminar el lobby.
   */
  async deleteLobby(id) {
    return await Lobby.deleteOne({ id }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Elimina un lobby por su ID de MongoDB.
   * @param {string} _id - El ID de MongoDB del lobby.
   * @returns {Promise<DeleteResult>} El resultado de la eliminación.
   * @throws {Error} Si ocurre un error al eliminar el lobby.
   */
  async deleteLobbyByMongoId(_id) {
    return await Lobby.deleteOne({ _id }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene todos los lobbies.
   * @returns {Promise<Lobby[]>} Una lista de todos los lobbies.
   * @throws {Error} Si ocurre un error al obtener los lobbies.
   */
  async getAllLobbies() {
    return await Lobby.find().catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene todos los lobbies de un usuario.
   * @param {string} userID - El ID del usuario.
   * @returns {Promise<Lobby[]>} Una lista de todos los lobbies del usuario.
   * @throws {Error} Si ocurre un error al obtener los lobbies.
   */
  async getAllUserLobbies(userID) {
    return await Lobby.find({ players: { $in: [userID] } }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Añade un jugador a un lobby.
   * @param {string} id - El ID del lobby.
   * @param {string} playerID - El ID del jugador.
   * @returns {Promise<UpdateResult>} El resultado de la actualización.
   * @throws {Error} Si el lobby está lleno.
   */
  async addPlayerToLobby(id, playerID) {
    const lobby = await this.getLobbyById(id);
    if (lobby.players.length >= lobby.maxPlayers) {
      this.setLobbyStatus(id, false)
      throw new Error("Lobby is full");
    }
    lobby.players.push(playerID);
    return await this.updateLobbyPlayers(id, lobby.players);
  }

  /**
   * Elimina un jugador de un lobby.
   * @param {string} id - El ID del lobby.
   * @param {string} playerID - El ID del jugador.
   * @returns {Promise<UpdateResult>} El resultado de la actualización.
   * @throws {Error} Si el jugador no está en el lobby.
   */
  async removePlayerFromLobby(id, playerID) {
    const lobby = await this.getLobbyById(id);
    const index = lobby.players.indexOf(playerID);
    if (index === -1) {
      throw new Error("Player not found in lobby");
    }
    lobby.players.splice(index, 1);
    return await this.updateLobbyPlayers(id, lobby.players);
  }

  /**
   * Obtiene un lobby por el ID de su anfitrión.
   * @param {string} hostID - El ID del anfitrión.
   * @returns {Promise<Lobby>} El lobby encontrado.
   * @throws {Error} Si ocurre un error al buscar el lobby.
   * @throws {Error} Si no se encuentra el lobby.
   */
  async getLobbyByHostID(hostID) {
    return await Lobby.findOne({ hostID }).catch((err) => {
      throw new Error(err.message);
    });
  }

  async getLobbyStatus(id) {
    try {
      return { joinable } = await this.getLobbyById(id);
    } catch (err) {
      throw(err)
    }
  }

  async setLobbyStatus(id, status) {
    try {
      const lobby = await this.getLobbyById(id);
      lobby.joinable = status;
      await lobby.save()
    } catch(err) {
      throw(err)
    }
  }
}
