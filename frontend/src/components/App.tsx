import { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { constants } from '../utils/constants';

export const App = () => {
  const { sendJsonMessage, readyState } = useWebSocket(constants.WS_URL, {
    onOpen: () => {},
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => false
  });

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({ type: 'playersInLobby', data: '' });
      sendJsonMessage({ type: 'ConnectionCount', data: '' });
    }
  }, [sendJsonMessage, readyState]);
  return <></>;
};
