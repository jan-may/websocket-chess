import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { constants } from '../utils/constants';
import { JsonMessage } from '../types/types';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { setLobbyState } from '../features/lobbySlice';

export const Root = () => {
  const dispatch = useAppDispatch();
  const [connectionCount, setConnectionCount] = useState<number | null>(null);
  const [playersInLobbyCount, setPlayersInLobbyCount] = useState<number>(0);

  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(constants.WS_URL, {
    share: true,
    shouldReconnect: () => true,
    filter: (message: MessageEvent) => {
      const msg = JSON.parse(message.data) as JsonMessage;
      return ['ConnectionCount', 'playersInLobby', 'leaveGame', 'connection'].includes(msg.type);
    }
  });

  useEffect(() => {
    const msg = lastJsonMessage as JsonMessage | null;
    if (!msg) return;
    switch (msg.type) {
      case 'ConnectionCount':
        setConnectionCount(Number(msg.data));
        break;
      case 'playersInLobby':
        setPlayersInLobbyCount(Number(msg.data));
        dispatch(setLobbyState(msg.data));
        break;
    }
  }, [lastJsonMessage, dispatch]);

  useEffect(() => {
    // Handling history back button and refresh
    if (readyState === ReadyState.OPEN) {
      ['ConnectionCount', 'playersInLobby', 'leaveGame', 'connection'].forEach((type) =>
        sendJsonMessage({ type, data: '' })
      );
    }
  }, [readyState, sendJsonMessage]);

  return (
    <div>
      <h1>Welcome to socket Chess</h1>
      <p>Players connected: {connectionCount ?? 'Loading...'}</p>
      <p>Players in Lobby: {playersInLobbyCount}</p>
      <p>Want to play?</p>
      <Link to="/lobby">
        <button>Join Game</button>
      </Link>
    </div>
  );
};
