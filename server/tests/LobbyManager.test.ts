import { describe, it, expect, beforeAll, jest, beforeEach, afterAll } from '@jest/globals';
import { LobbyManager } from '../src/Lobby/LobbyManager';
import { WebSocket, Server } from 'ws';
import { ConnectionManager } from '../src/Connection/ConnectionManager';

let mockServer: Server;
let connectionManager: ConnectionManager;

beforeAll((done) => {
  mockServer = new Server({ port: 12346 });
  connectionManager = new ConnectionManager(mockServer);
  mockServer.on('listening', done);
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  mockServer.close();
});

beforeEach(() => {
  connectionManager = new ConnectionManager(mockServer);
});

describe('LobbyManager', () => {
  it('should create a default lobby', () => {
    const lobbyManager = new LobbyManager(mockServer);
    const lobby = lobbyManager.createLobby();
    expect(lobby).toBeDefined();
    expect(lobby.id).toEqual('lobby_1');
    expect(lobby.maxPlayers).toEqual(2);
    expect(lobby.gameType).toEqual('default');
    expect(lobbyManager.getLobbyCount()).toEqual(1);
  });

  it('should create a custom lobby', () => {
    const lobbyManager = new LobbyManager(mockServer);
    const lobby = lobbyManager.createCustomLobby(4, 'custom');
    expect(lobby).toBeDefined();
    expect(lobby.id).toEqual('lobby_1_custom');
    expect(lobby.maxPlayers).toEqual(4);
    expect(lobby.gameType).toEqual('custom');
    expect(lobbyManager.getLobbyCount()).toEqual(1);
  });

  it('should get a lobby', () => {
    const lobbyManager = new LobbyManager(mockServer);
    const lobby = lobbyManager.createLobby();
    expect(lobbyManager.getLobby(lobby.id)).toBe(lobby);
  });

  it('should join a lobby', (done) => {
    const lobbyManager = new LobbyManager(mockServer);
    const lobby = lobbyManager.createLobby();
    const ws1 = new WebSocket('ws://localhost:12346');
    const ws2 = new WebSocket('ws://localhost:12346');
    const ws3 = new WebSocket('ws://localhost:12346');
    Promise.all([
      new Promise<void>((resolve) => ws1.on('open', resolve)),
      new Promise<void>((resolve) => ws2.on('open', resolve)),
      new Promise<void>((resolve) => ws3.on('open', resolve))
    ]).then(() => {
      connectionManager.addConnection(ws1);
      connectionManager.addConnection(ws2);
      connectionManager.addConnection(ws2);
      lobbyManager.joinLobby('test_uid1');
      lobbyManager.joinLobby('test_uid2');
      expect(lobby.players).toContain('test_uid1');
      expect(lobby.players).toContain('test_uid2');
      expect(lobby.isfull()).toBeTruthy();

      // Should automatically Create a new lobby and join it
      lobbyManager.joinLobby('test_uid3');
      const all = lobbyManager.getAllLobbies();
      expect(all.at(-1)!.players).toContain('test_uid3');
      expect(all.at(-1)!.id).toEqual('lobby_2');
      expect(all).toContain(lobby);
      expect(all.length).toEqual(2);
      ws1.close();
      ws2.close();
      ws3.close();
      done();
    });
  });

  it('should join a lobby by id', (done) => {
    const lobbyManager = new LobbyManager(mockServer);
    const lobby1 = lobbyManager.createLobby();
    const lobby2 = lobbyManager.createLobby();
    const lobby3 = lobbyManager.createLobby();
    const ws1 = new WebSocket('ws://localhost:12346');
    const ws2 = new WebSocket('ws://localhost:12346');
    const ws3 = new WebSocket('ws://localhost:12346');
    Promise.all([
      new Promise<void>((resolve) => ws1.on('open', resolve)),
      new Promise<void>((resolve) => ws2.on('open', resolve)),
      new Promise<void>((resolve) => ws3.on('open', resolve))
    ]).then(() => {
      connectionManager.addConnection(ws1);
      connectionManager.addConnection(ws2);
      connectionManager.addConnection(ws2);
      lobbyManager.joinLobbyById('test_uid1', lobby1.id);
      lobbyManager.joinLobbyById('test_uid2', lobby2.id);
      lobbyManager.joinLobbyById('test_uid3', lobby3.id);
      expect(lobby1.players).toContain('test_uid1');
      expect(lobby2.players).toContain('test_uid2');
      expect(lobby3.players).toContain('test_uid3');
      expect(lobby1.isfull()).toBeFalsy();
      ws1.close();
      ws2.close();
      ws3.close();
      done();
    });
  });

  it('should leave a lobby', (done) => {
    const lobbyManager = new LobbyManager(mockServer);
    const lobby = lobbyManager.createLobby();
    const ws1 = new WebSocket('ws://localhost:12346');
    const ws2 = new WebSocket('ws://localhost:12346');
    const ws3 = new WebSocket('ws://localhost:12346');
    Promise.all([
      new Promise<void>((resolve) => ws1.on('open', resolve)),
      new Promise<void>((resolve) => ws2.on('open', resolve)),
      new Promise<void>((resolve) => ws3.on('open', resolve))
    ]).then(() => {
      connectionManager.addConnection(ws1);
      connectionManager.addConnection(ws2);
      lobbyManager.joinLobby('test_uid1');
      lobbyManager.joinLobby('test_uid2');
      lobbyManager.leaveLobby('test_uid2');
      expect(lobby.players).toContain('test_uid1');
      expect(lobby.players).not.toContain('test_uid2');
      ws1.close();
      ws2.close();
      ws3.close();
      done();
    });
  });

  it('should leave correct lobby when multiple lobbies are online', (done) => {
    const lobbyManager = new LobbyManager(mockServer);
    const lobby1 = lobbyManager.createLobby();
    const lobby2 = lobbyManager.createLobby();
    const ws1 = new WebSocket('ws://localhost:12346');
    const ws2 = new WebSocket('ws://localhost:12346');
    const ws3 = new WebSocket('ws://localhost:12346');
    const ws4 = new WebSocket('ws://localhost:12346');
    Promise.all([
      new Promise<void>((resolve) => ws1.on('open', resolve)),
      new Promise<void>((resolve) => ws2.on('open', resolve)),
      new Promise<void>((resolve) => ws3.on('open', resolve)),
      new Promise<void>((resolve) => ws4.on('open', resolve))
    ]).then(() => {
      connectionManager.addConnection(ws1);
      connectionManager.addConnection(ws2);
      lobbyManager.joinLobby('test_uid1');
      lobbyManager.joinLobby('test_uid2');
      lobbyManager.joinLobby('test_uid3');
      lobbyManager.joinLobby('test_uid4');
      lobbyManager.leaveLobby('test_uid2');
      lobbyManager.leaveLobby('test_uid3');

      expect(lobby1.players).toContain('test_uid1');
      expect(lobby1.players).not.toContain('test_uid2');
      expect(lobby2.players).toContain('test_uid4');
      expect(lobby1.players).not.toContain('test_uid3');
      expect(lobby1.players).toHaveLength(1);
      expect(lobby2.players).toHaveLength(1);
      lobbyManager.leaveLobby('test_uid1');
      lobbyManager.leaveLobby('test_uid4');
      expect(lobby1.players).toHaveLength(0);
      expect(lobby2.players).toHaveLength(0);
      ws1.close();
      ws2.close();
      ws3.close();
      ws4.close();
      done();
    });
  });

  it('should get all lobbies', () => {
    const lobbyManager = new LobbyManager(mockServer);
    const lobby1 = lobbyManager.createLobby();
    const lobby2 = lobbyManager.createLobby();
    const lobby3 = lobbyManager.createLobby();
    const all = lobbyManager.getAllLobbies();
    expect(all).toContain(lobby1);
    expect(all).toContain(lobby2);
    expect(all).toContain(lobby3);
    expect(all.length).toEqual(3);
  });

  it('should get lobby by player', () => {
    const lobbyManager = new LobbyManager(mockServer);
    const lobby1 = lobbyManager.createLobby();
    const lobby2 = lobbyManager.createLobby();
    lobbyManager.joinLobby('test_uid1');
    lobbyManager.joinLobby('test_uid2');
    lobbyManager.joinLobby('test_uid3');
    expect(lobbyManager.getLobbyByPlayer('test_uid1')).toBe(lobby1);
    expect(lobbyManager.getLobbyByPlayer('test_uid2')).toBe(lobby1);
    expect(lobbyManager.getLobbyByPlayer('test_uid3')).toBe(lobby2);
  });

  it('should get total players in lobbies', () => {
    const lobbyManager = new LobbyManager(mockServer);
    lobbyManager.joinLobby('test_uid1');
    lobbyManager.joinLobby('test_uid2');
    lobbyManager.joinLobby('test_uid3');
    lobbyManager.joinLobby('test_uid4');
    expect(lobbyManager.getTotalPlayersInLobbies()).toEqual(4);
  });

  it('should get players in lobby', () => {
    const lobbyManager = new LobbyManager(mockServer);
    const lobby = lobbyManager.createLobby();
    lobbyManager.joinLobby('test_uid1');
    lobbyManager.joinLobby('test_uid2');
    expect(lobbyManager.getPlayersInLobby(lobby.id)).toEqual(['test_uid1', 'test_uid2']);
  });
});
