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
   * @param {string} lobbyID - El ID del lobby.
   * @returns {Promise<Lobby>} El lobby encontrado.
   * @throws {Error} Si ocurre un error al buscar el lobby.
   */
  async getLobbyById(lobbyID) {
    return await Lobby.findOne({ lobbyID }).catch((err) => {
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
  async updateLobbyPlayers(lobbyID, players) {
    const lobby = await this.getLobbyById(lobbyID);

    if (!lobby) {
      return null;
    }

    return await Lobby.updateOne({ lobbyID }, { players }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Elimina un lobby por su ID.
   * @param {string} lobbyID - El ID del lobby.
   * @returns {Promise<DeleteResult>} El resultado de la eliminación.
   * @throws {Error} Si ocurre un error al eliminar el lobby.
   */
  async deleteLobby(lobbyID) {
    const lobby = await this.getLobbyById(lobbyID);
    if (!lobby) {
      return { deletedCount: 0 }; // Ajuste para devolver un objeto con deletedCount
    }
    return await Lobby.deleteOne({ lobbyID }).catch((err) => {
      throw new Error(err.message);
    });
  }

  /**
   * Obtiene todos los lobbies.
   * @returns {Promise<Lobby[]>} Una lista de todos los lobbies.
   * @throws {Error} Si ocurre un error al obtener los lobbies.
   */
  async getAllLobbies() {
    return await Lobby.find({ joinable: true }).catch((err) => {
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
   * @param {string} lobbyID - El ID del lobby.
   * @param {string} playerID - El ID del jugador.
   * @returns {Promise<UpdateResult>} El resultado de la actualización.
   * @throws {Error} Si el lobby está lleno.
   */
  async addPlayerToLobby(lobbyID, newPlayer) {
    const lobby = await this.getLobbyById(lobbyID);
    // Comprobar que la lobby no este llena
    if (lobby.players.length >= lobby.maxPlayers) {
      this.setLobbyStatus(lobbyID, false);
      throw new Error("Lobby is full");
    }
    // Comprobar que no meto a un mismo usuario varias veces
    if (lobby.players.some((player) => player.userID === newPlayer.userID)) {
      throw new Error("User is already in lobby")
    } 
    lobby.players.push(newPlayer);
    return await this.updateLobbyPlayers(lobbyID, lobby.players);
  }

  /**
   * Elimina un jugador de un lobby.
   * @param {string} lobbyID - El ID del lobby.
   * @param {string} playerID - El ID del jugador.
   * @returns {Promise<UpdateResult>} El resultado de la actualización.
   * @throws {Error} Si el jugador no está en el lobby.
   */
  async removePlayerFromLobby(lobbyID, playerID) {
    const lobby = await this.getLobbyById(lobbyID);
    const index = lobby.players.findIndex(
      (player) => player.userID === playerID
    );
    if (index === -1) {
      throw new Error("Player not found in lobby");
    }
    lobby.players.splice(index, 1);
    return await this.updateLobbyPlayers(lobbyID, lobby.players);
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

  /**
   * Obtiene el estado de un lobby por su ID.
   *
   * @param {string} lobbyID - El ID del lobby.
   * @returns {Promise<{ joinable: boolean }>} Un objeto que indica si el lobby es unible.
   * @throws {Error} Si ocurre un error al obtener el estado del lobby.
   */
  async setLobbyStatus(lobbyID, status) {
    try {
      const lobby = await this.getLobbyById(lobbyID);
      if (!lobby) {
        throw new Error("Lobby not found");
      }
      lobby.joinable = status;
      await lobby.save();
    } catch (err) {
      throw new Error("Error updating status");
    }
  }

  /**
   * Obtiene el estado de un lobby por su ID.
   *
   * @param {string} lobbyID - El ID del lobby.
   * @returns {Promise<{ joinable: boolean }>} Un objeto que indica si el lobby es unible.
   * @throws {Error} Si ocurre un error al obtener el estado del lobby.
   */
  async getLobbyStatus(lobbyID) {
    try {
      const lobby = await this.getLobbyById(lobbyID);
      if (!lobby) {
        throw new Error("Lobby not found");
      }
      return { joinable: lobby.joinable };
    } catch (err) {
      throw new Error("Error fetching status");
    }
  }

  async setLobbyPrivacy(lobbyID, newPrivate) {
    try {
      const lobby = await this.getLobbyById(lobbyID);
      if (!lobby) {
        throw new Error("Lobby not found");
      }
      lobby.private = newPrivate;
      await lobby.save();
    } catch (err) {
      throw new Error("Error updating privacy");
    }
  }

  async getLobbyPrivacy(lobbyID) {
    try {
      const lobby = await this.getLobbyById(lobbyID);
      if (!lobby) {
        throw new Error("Lobby not found");
      }
      return { private: lobby.private };
    } catch (err) {
      throw new Error("Error fetching privacy");
    }
  }

  async getAllPublicLobby() {
    return await Lobby.find({ joinable: true, private: false }).catch((err) => {
      throw new Error(err.message);
    });
  }
}
