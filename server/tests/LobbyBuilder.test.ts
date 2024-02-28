import { LobbyBuilder } from '../src/Lobby/LobbyBuilder'; // Adjust the import path as necessary
import { describe, expect, it, beforeAll, jest } from '@jest/globals';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('LobbyBuilder', () => {
  it('creates a Lobby with default settings', () => {
    const defaultLobby = new LobbyBuilder('defaultLobbyId').build();
    expect(defaultLobby.id).toBe('defaultLobbyId');
    expect(defaultLobby.maxPlayers).toBe(2);
    expect(defaultLobby.gameType).toBe('default');
    expect(defaultLobby.players).toHaveLength(0);
  });

  it('creates a Lobby with custom settings', () => {
    const customLobby = new LobbyBuilder('customLobbyId').setMaxPlayers(4).setGameType('customGame').build();
    expect(customLobby.id).toBe('customLobbyId');
    expect(customLobby.maxPlayers).toBe(4);
    expect(customLobby.gameType).toBe('customGame');
    expect(customLobby.players).toHaveLength(0);
  });

  // Add more tests as needed for other behaviors and methods
});
