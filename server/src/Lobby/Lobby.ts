import { WebSocket } from 'ws';

export class Lobby {
  id: string;
  players: WebSocket[] = [];
  maxPlayers: number;
  gameType: string;

  constructor(
    id: string,
    maxPlayers: number = 2,
    gameType: string = 'default'
  ) {
    this.id = id;
    this.maxPlayers = maxPlayers;
    this.gameType = gameType;
  }

  getLobbyState() {
    return {
      id: this.id,
      players: this.players,
      maxPlayers: this.maxPlayers,
      gameType: this.gameType
    };
  }

  addPlayer(player: WebSocket) {
    if (this.players.length < this.maxPlayers) {
      this.players.push(player);
      console.log(`Player added to lobby ${this.id}.`);
    } else {
      console.log('Lobby is full.');
    }
  }

  removePlayer(player: WebSocket) {
    this.players = this.players.filter((p) => p !== player);
    console.log(`Player removed from lobby ${this.id}.`);
  }

  isfull() {
    return this.players.length === this.maxPlayers;
  }

  joinGame(ws: WebSocket) {
    if (this.isfull()) {
      console.log('Lobby is full');
    } else {
      this.addPlayer(ws);
    }
  }
  // Additional methods related to lobby management can be added here
}
