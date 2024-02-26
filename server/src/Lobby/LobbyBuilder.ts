import { Lobby } from './Lobby';

export class LobbyBuilder {
  private id: string;
  private maxPlayers: number = 2;
  private gameType: string = 'default';
  constructor(id: string) {
    this.id = id;
  }

  setMaxPlayers(maxPlayers: number): LobbyBuilder {
    this.maxPlayers = maxPlayers;
    return this;
  }

  setGameType(gameType: string): LobbyBuilder {
    this.gameType = gameType;
    return this;
  }

  build(): Lobby {
    return new Lobby(this.id, this.maxPlayers, this.gameType);
  }
}
