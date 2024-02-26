import { LobbyBuilder } from '../src/Lobby/LobbyBuilder'; // Adjust the import path as necessary
import { WebSocket } from 'ws'; // This is to mock WebSocket objects
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
    const customLobby = new LobbyBuilder('customLobbyId')
      .setMaxPlayers(4)
      .setGameType('customGame')
      .build();

    expect(customLobby.id).toBe('customLobbyId');
    expect(customLobby.maxPlayers).toBe(4);
    expect(customLobby.gameType).toBe('customGame');
    expect(customLobby.players).toHaveLength(0);
  });

  it('adds players to the Lobby', () => {
    const lobbyWithPlayers = new LobbyBuilder('lobbyWithPlayersId').build();
    const mockPlayer1 = {} as WebSocket;
    const mockPlayer2 = {} as WebSocket;

    lobbyWithPlayers.addPlayer(mockPlayer1);
    lobbyWithPlayers.addPlayer(mockPlayer2);

    expect(lobbyWithPlayers.players).toHaveLength(2);
    expect(lobbyWithPlayers.players).toContain(mockPlayer1);
    expect(lobbyWithPlayers.players).toContain(mockPlayer2);
  });

  it('removes players from the Lobby', () => {
    const lobbyWithPlayers = new LobbyBuilder('lobbyWithPlayersId').build();
    const mockPlayer1 = {} as WebSocket;
    const mockPlayer2 = {} as WebSocket;

    lobbyWithPlayers.addPlayer(mockPlayer1);
    lobbyWithPlayers.addPlayer(mockPlayer2);
    lobbyWithPlayers.removePlayer(mockPlayer1);

    expect(lobbyWithPlayers.players).toHaveLength(1);
    expect(lobbyWithPlayers.players).not.toContain(mockPlayer1);
    expect(lobbyWithPlayers.players).toContain(mockPlayer2);
  });

  it('checks if the Lobby is full', () => {
    const lobbyWithPlayers = new LobbyBuilder('lobbyWithPlayersId').build();
    const mockPlayer1 = {} as WebSocket;
    const mockPlayer2 = {} as WebSocket;

    lobbyWithPlayers.addPlayer(mockPlayer1);

    expect(lobbyWithPlayers.isfull()).toBe(false);

    lobbyWithPlayers.addPlayer(mockPlayer2);

    expect(lobbyWithPlayers.isfull()).toBe(true);
  });

  it('joins a game', () => {
    const lobbyWithPlayers = new LobbyBuilder('lobbyWithPlayersId').build();
    const mockPlayer1 = {} as WebSocket;

    lobbyWithPlayers.joinGame(mockPlayer1);

    expect(lobbyWithPlayers.players).toHaveLength(1);
    expect(lobbyWithPlayers.players).toContain(mockPlayer1);
  });

  // create new lobby if full
  it('creates a new lobby if full', () => {
    const lobbyWithPlayers = new LobbyBuilder('lobbyWithPlayersId').build();
    const mockPlayer1 = {} as WebSocket;
    const mockPlayer2 = {} as WebSocket;

    lobbyWithPlayers.addPlayer(mockPlayer1);
    lobbyWithPlayers.addPlayer(mockPlayer2);

    expect(lobbyWithPlayers.players).toHaveLength(2);
    expect(lobbyWithPlayers.players).toContain(mockPlayer1);
    expect(lobbyWithPlayers.players).toContain(mockPlayer2);
  });

  // Add more tests as needed for other behaviors and methods
});
