import express from 'express';
import { WebSocket, Server as WebSocketServer } from 'ws';
import http from 'http';
import { ConnectionManager } from './Connection/ConnectionManager';
import { LobbyManager } from './Lobby/LobbyManager';
import { MESSAGE_TYPES } from './utils/constants';

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const connectionManager = new ConnectionManager(wss);
const lobbyManager = new LobbyManager(wss);

wss.on('connection', (ws) => {
  connectionManager.addConnection(ws);
  sendUpdatedConnectionCount();

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString('utf8'));
      switch (parsedMessage.type) {
        case MESSAGE_TYPES.CONNECTION_COUNT:
          ws.send(createWsMessage(MESSAGE_TYPES.CONNECTION_COUNT, connectionManager.getConnectionCount()));
          break;

        case MESSAGE_TYPES.PLAYERS_IN_LOBBY:
          sendUpdatedLobbyCount();
          break;

        case MESSAGE_TYPES.JOIN_GAME:
          handleJoinGame(ws);

          break;
        case MESSAGE_TYPES.LEAVE_GAME:
          handleLeaveGame(ws);
          break;
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  });

  ws.on('close', () => {
    handleLeaveGame(ws);
    connectionManager.removeConnectionByWebSocket(ws);
    sendUpdatedConnectionCount();
  });
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

function sendUpdatedConnectionCount() {
  connectionManager.broadcastMessage(
    createWsMessage(MESSAGE_TYPES.CONNECTION_COUNT, connectionManager.getConnectionCount())
  );
}

function handleLeaveGame(ws: WebSocket) {
  const playerId = connectionManager.getConnectionId(ws);
  if (!playerId) return;

  const lobby = lobbyManager.getLobbyByPlayer(playerId);
  if (!lobby) return;

  lobbyManager.leaveLobby(playerId);

  connectionManager.broadcastMessage(createWsMessage(MESSAGE_TYPES.LEAVE_GAME, lobby));
  connectionManager.broadcastMessage(
    createWsMessage(MESSAGE_TYPES.PLAYERS_IN_LOBBY, lobbyManager.getTotalPlayersInLobbies())
  );
}

function handleJoinGame(ws: WebSocket) {
  const playerId = connectionManager.getConnectionId(ws);
  if (!playerId) return;

  lobbyManager.joinLobby(playerId);
  const lobby = lobbyManager.getLobbyByPlayer(playerId);
  if (!lobby) return;

  const playersInLobbyMessage = createWsMessage(MESSAGE_TYPES.JOIN_GAME, lobby);
  ws.send(playersInLobbyMessage);
  connectionManager.sendMessageToPlayers(lobby.players, playersInLobbyMessage);
  connectionManager.broadcastMessage(
    createWsMessage(MESSAGE_TYPES.PLAYERS_IN_LOBBY, lobbyManager.getTotalPlayersInLobbies())
  );
}

function sendUpdatedLobbyCount() {
  const message = JSON.stringify({
    type: MESSAGE_TYPES.PLAYERS_IN_LOBBY,
    data: lobbyManager.getTotalPlayersInLobbies()
  });
  connectionManager.broadcastMessage(message);
}

function createWsMessage(type: string, data: any) {
  return JSON.stringify({ type, data });
}
