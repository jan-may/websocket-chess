import { describe, expect, it, beforeAll, jest } from '@jest/globals';
import { Lobby } from '../src/Lobby/Lobby';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('Lobby', () => {
  it('creates a Lobby with default settings', () => {
    const defaultLobby = new Lobby('defaultLobbyId');
    expect(defaultLobby.id).toBe('defaultLobbyId');
    expect(defaultLobby.maxPlayers).toBe(2);
    expect(defaultLobby.gameType).toBe('default');
    expect(defaultLobby.players).toHaveLength(0);
  });

  it('creates a Lobby with custom settings', () => {
    const customLobby = new Lobby('customLobbyId', 4, 'customGame');

    expect(customLobby.id).toBe('customLobbyId');
    expect(customLobby.maxPlayers).toBe(4);
    expect(customLobby.gameType).toBe('customGame');
    expect(customLobby.players).toHaveLength(0);
  });

  it('adds a player to the lobby', () => {
    const lobby = new Lobby('testLobbyId');
    lobby.joinGame('testUID');
    expect(lobby.players).toContain('testUID');
    expect(lobby.players).toHaveLength(1);
  });

  it('removes a player from the lobby', () => {
    const lobby = new Lobby('testLobbyId');
    lobby.joinGame('testUID');
    lobby.removePlayer('testUID');
    expect(lobby.players).not.toContain('testUID');
    expect(lobby.players).toHaveLength(0);
  });

  it('checks if the lobby is full', () => {
    const lobby = new Lobby('testLobbyId', 2);
    lobby.joinGame('testUID1');
    lobby.joinGame('testUID2');
    expect(lobby.isfull()).toBe(true);
  });
});
