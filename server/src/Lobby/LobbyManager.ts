import { Server } from 'ws';
import { Lobby } from './Lobby';
import { LobbyBuilder } from './LobbyBuilder';

export class LobbyManager {
  private lobbies: Map<string, Lobby> = new Map();
  private wss: Server;
  constructor(wss: Server) {
    this.wss = wss;
  }

  createLobby() {
    const id = 'lobby_' + (this.lobbies.size + 1);
    const lobby = new LobbyBuilder(id).build();
    this.lobbies.set(id, lobby);
    return lobby;
  }

  createCustomLobby(maxPlayers: number, gameType: string) {
    const id = 'lobby_' + (this.lobbies.size + 1) + '_custom';
    const lobby = new LobbyBuilder(id).setMaxPlayers(maxPlayers).setGameType(gameType).build();
    this.lobbies.set(id, lobby);
    return lobby;
  }

  getLobbyCount() {
    return this.lobbies.size;
  }

  getLobby(id: string) {
    return this.lobbies.get(id);
  }

  getAllLobbies() {
    return Array.from(this.lobbies.values());
  }

  joinLobby(uid: string) {
    const lobby = Array.from(this.lobbies.values()).find((l) => !l.isfull());
    if (lobby) {
      lobby.joinGame(uid);
    } else {
      this.createLobby().joinGame(uid);
    }
  }

  joinLobbyById(uid: string, id: string) {
    const lobby = this.lobbies.get(id);
    if (lobby) {
      lobby.joinGame(uid);
    }
  }

  leaveLobby(uid: string) {
    const lobby = Array.from(this.lobbies.values()).find((l) => l.players.includes(uid));
    if (lobby) {
      lobby.removePlayer(uid);
    }
  }

  getLobbyByPlayer(uid: string) {
    return Array.from(this.lobbies.values()).find((l) => l.players.includes(uid));
  }

  getTotalPlayersInLobbies() {
    return Array.from(this.lobbies.values()).reduce((acc, l) => acc + l.players.length, 0);
  }

  getPlayersInLobby(lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    return lobby ? lobby.players : [];
  }
}
