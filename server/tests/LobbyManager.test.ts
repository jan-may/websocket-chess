import { describe, it, expect, beforeAll, jest } from '@jest/globals';
import { LobbyManager } from '../src/Lobby/LobbyManager';
import { WebSocket } from 'ws';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('LobbyManager', () => {
  it('creates a new lobby when no lobbies are available', () => {
    const lobbyManager = new LobbyManager();
    const mockPlayer = {} as WebSocket;

    lobbyManager.joinOrCreateLobby(mockPlayer);

    expect(lobbyManager['lobbies']).toHaveLength(1);
  });

  it('joins an existing lobby when one is available', () => {
    const lobbyManager = new LobbyManager();
    const mockPlayer1 = {} as WebSocket;
    const mockPlayer2 = {} as WebSocket;

    lobbyManager.joinOrCreateLobby(mockPlayer1);
    lobbyManager.joinOrCreateLobby(mockPlayer2);

    expect(lobbyManager['lobbies']).toHaveLength(1);
  });

  it('removes a player from a lobby', () => {
    const lobbyManager = new LobbyManager();
    const mockPlayer = {} as WebSocket;
    lobbyManager.joinOrCreateLobby(mockPlayer);
    lobbyManager.removePlayerFromLobby(mockPlayer);

    expect(lobbyManager['lobbies'][0].players).toHaveLength(0);
  });

  it('removes empty lobbies', () => {
    const lobbyManager = new LobbyManager();
    const mockPlayer = {} as WebSocket;

    lobbyManager.joinOrCreateLobby(mockPlayer);
    lobbyManager.removePlayerFromLobby(mockPlayer);
    lobbyManager.cleanupEmptyLobbies();

    expect(lobbyManager['lobbies']).toHaveLength(0);
  });

  it('returns the state of all lobbies', () => {
    const lobbyManager = new LobbyManager();
    lobbyManager.joinOrCreateLobby({} as WebSocket);
    let state = lobbyManager.getLobbiesState();

    expect(state.activeLobbies).toHaveLength(1);
    expect(state.totalPlayers).toBe(1);

    lobbyManager.joinOrCreateLobby({} as WebSocket);
    state = lobbyManager.getLobbiesState();
    expect(state.totalPlayers).toBe(2);
    expect(state.activeLobbies).toHaveLength(1);

    lobbyManager.joinOrCreateLobby({} as WebSocket);
    state = lobbyManager.getLobbiesState();
    expect(state.totalPlayers).toBe(3);
    expect(state.activeLobbies).toHaveLength(2);
  });

  it("returns the state of a player's lobby", () => {
    const lobbyManager = new LobbyManager();
    const mockPlayer = {} as WebSocket;

    lobbyManager.joinOrCreateLobby(mockPlayer);
    const state = lobbyManager.getLobbyStateForPlayer(mockPlayer);

    expect(state!.id).toBeDefined();
    expect(state!.players).toHaveLength(1);
    expect(state!.maxPlayers).toBe(2);
    expect(state!.gameType).toBe('default');
  });
});
