export class Lobby {
  id: string;
  players: string[] = []; // Store UIDs instead of WebSockets
  maxPlayers: number;
  gameType: string;

  constructor(id: string, maxPlayers: number = 2, gameType: string = 'default') {
    this.id = id;
    this.maxPlayers = maxPlayers;
    this.gameType = gameType;
  }

  getLobbyState() {
    return {
      id: this.id,
      players: this.players, // UIDs are returned
      maxPlayers: this.maxPlayers,
      gameType: this.gameType
    };
  }

  private addPlayer(uid: string) {
    if (!this.isfull()) {
      this.players.push(uid);
      console.log(`Player UID ${uid} added to lobby ${this.id}.`);
    } else {
      console.log('Lobby is full.');
    }
  }

  removePlayer(uid: string) {
    this.players = this.players.filter((p) => p !== uid);
    console.log(`Player UID ${uid} removed from lobby ${this.id}.`);
  }

  isfull() {
    return this.players.length >= this.maxPlayers;
  }

  joinGame(uid: string) {
    this.addPlayer(uid);
  }
}
