import express from 'express';
import { Server as WebSocketServer } from 'ws';
import http from 'http';
import { LobbyManager } from './Lobby/LobbyManager';

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const lobbyManager = new LobbyManager();

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString('utf8'));
      switch (parsedMessage.type) {
        case 'ServerStats': {
          const { totalPlayers, activeLobbies } =
            lobbyManager.getLobbiesState();
          ws.send(
            JSON.stringify({
              type: 'ServerStats',
              data: {
                playerCount: totalPlayers,
                lobbyCount: activeLobbies
              }
            })
          );
          break;
        }

        case 'joinLobby':
          lobbyManager.joinOrCreateLobby(ws);
          // Send the player their current lobby state
          ws.send(
            JSON.stringify({
              type: 'lobbyState',
              data: lobbyManager.getLobbyStateForPlayer(ws)
            })
          );
          break;
        case 'leaveLobby':
          lobbyManager.removePlayerFromLobby(ws);
          break;
        // Add more cases as needed for other types of messages/actions
        default:
          console.log('Unknown message type:', parsedMessage.type);
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Remove player from their lobby on disconnect
    lobbyManager.removePlayerFromLobby(ws);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
