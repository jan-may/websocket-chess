import { WebSocket } from 'ws';
import { Lobby } from './Lobby';
import { LobbyBuilder } from './LobbyBuilder';

export class LobbyManager {
  private lobbies: Lobby[] = [];

  joinOrCreateLobby(player: WebSocket) {
    // Attempt to join an existing lobby
    const availableLobby = this.lobbies.find((lobby) => !lobby.isfull());
    if (availableLobby) {
      availableLobby.joinGame(player);
      console.log(`Player joined existing lobby: ${availableLobby.id}`);
    } else {
      // Create a new lobby
      const newLobbyId = `lobby_${this.lobbies.length + 1}`;
      const newLobby = new LobbyBuilder(newLobbyId).build();
      newLobby.joinGame(player);
      this.lobbies.push(newLobby);
      console.log(`Player created and joined new lobby: ${newLobbyId}`);
    }
  }

  // This method allows for removing a player from any lobby. Useful for player disconnections.
  removePlayerFromLobby(player: WebSocket) {
    this.lobbies.forEach((lobby) => {
      if (lobby.players.includes(player)) {
        lobby.removePlayer(player);
        console.log(`Player removed from lobby: ${lobby.id}`);
      }
    });

    // Optional: Clean up empty lobbies
    // this.cleanupEmptyLobbies();
  }

  // Optional: Remove lobbies that have become empty
  cleanupEmptyLobbies() {
    this.lobbies = this.lobbies.filter((lobby) => lobby.players.length > 0);
  }

  getLobbiesState() {
    return {
      activeLobbies: this.getActiveLobbies(),
      totalPlayers: this.getTotalPlayers()
    };
  }

  private getActiveLobbies() {
    return this.lobbies;
  }

  private getTotalPlayers() {
    return this.lobbies.reduce((acc, lobby) => acc + lobby.players.length, 0);
  }

  getLobbyStateForPlayer(player: WebSocket) {
    const playerLobby = this.lobbies.find((lobby) =>
      lobby.players.includes(player)
    );
    if (playerLobby) {
      return playerLobby.getLobbyState();
    }
    return null;
  }
}
