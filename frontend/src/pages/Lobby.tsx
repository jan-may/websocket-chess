import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { constants, MESSAGE_TYPES } from '../utils/constants';
import { Link } from 'react-router-dom';

interface LobbyState {
  id: string;
  players: string[];
  maxPlayers: number;
  gameType: string;
}

interface WebSocketMessage {
  type: 'joinGame' | 'leaveGame';
  data: LobbyState;
}

export const Lobby = () => {
  const [lobbyState, setLobbyState] = useState<LobbyState>({
    id: '',
    players: [],
    maxPlayers: 0,
    gameType: ''
  });

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(constants.WS_URL, {
    share: true,
    shouldReconnect: () => false,
    filter: (message: MessageEvent) => {
      const { type } = JSON.parse(message.data);
      return type === MESSAGE_TYPES.JOIN_GAME || type === MESSAGE_TYPES.LEAVE_GAME;
    }
  });

  useEffect(() => {
    if (!lastJsonMessage) return;

    const { type, data } = lastJsonMessage as WebSocketMessage;
    if (type === MESSAGE_TYPES.JOIN_GAME) {
      setLobbyState(data);
    } else if (type === MESSAGE_TYPES.LEAVE_GAME && data.id === lobbyState.id) {
      setLobbyState(data);
    }
  }, [lastJsonMessage, lobbyState.id]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({ type: MESSAGE_TYPES.JOIN_GAME, data: '' });
    }
  }, [readyState, sendJsonMessage]);

  return (
    <div>
      <h2>Lobby</h2>
      <p>ID: {lobbyState.id}</p>
      <p>Players in Lobby: {lobbyState.players.length}</p>
      <p>Players needed: {lobbyState.maxPlayers}</p>
      <div style={{ display: 'flex' }}>
        <p style={{ marginRight: '12px' }}>Players:</p>
        <div>
          {lobbyState.players.map((player, index) => (
            <p key={index}>{player}</p>
          ))}
        </div>
      </div>
      <p>Game Type: {lobbyState.gameType}</p>
      <Link to="/">
        <button onClick={() => sendJsonMessage({ type: MESSAGE_TYPES.LEAVE_GAME, data: '' })}>Leave Lobby</button>
      </Link>
    </div>
  );
};
