import { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { constants } from '../utils/constants';
import { useAppDispatch } from '../hooks/redux';
import { setUserID } from '../features/userSlice';

export const App = () => {
  const dispatch = useAppDispatch();
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(constants.WS_URL, {
    onOpen: () => {},
    share: true,
    filter: (message: MessageEvent) => {
      const msg = JSON.parse(message.data);
      return ['ConnectionCount', 'playersInLobby', 'leaveGame', 'connection'].includes(msg.type);
    },
    retryOnError: true,
    shouldReconnect: () => true
  });

  useEffect(() => {
    if (lastJsonMessage) {
      const msg = lastJsonMessage as { type: string; data: string };
      // on connection message, set the user ID in the store
      // this is used to identify the user in the chat
      // also handles reconnecting to the server scenario
      if (msg.type === 'connection') {
        dispatch(setUserID(msg.data));
      }
    }
  }, [lastJsonMessage, dispatch]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({ type: 'playersInLobby', data: '' });
      sendJsonMessage({ type: 'ConnectionCount', data: '' });
    }
  }, [sendJsonMessage, readyState]);

  return <></>;
};
