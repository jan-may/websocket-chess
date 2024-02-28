// import { useEffect, useState } from 'react';
// import useWebSocket, { ReadyState } from 'react-use-websocket';
// import { constants } from '../utils/constants';
// import { JsonMessage } from '../types/types';
// import { Link } from 'react-router-dom';

// export const Root = () => {
//   function isConnectionEvent(message: any) {
//     const parsedMessage = JSON.parse(message.data);
//     return parsedMessage.type === 'ConnectionCount';
//   }

//   function isPlayersInLobbyEvent(message: any) {
//     const parsedMessage = JSON.parse(message.data);
//     return parsedMessage.type === 'playersInLobby';
//   }

//   function isLeaveGameEvent(message: any) {
//     const parsedMessage = JSON.parse(message.data);
//     return parsedMessage.type === 'leaveGame';
//   }

//   function isDefinedEvent(message: any) {
//     return (
//       isConnectionEvent(message) ||
//       isPlayersInLobbyEvent(message) ||
//       isLeaveGameEvent(message)
//     );
//   }

//   const [connectionCount, setConnectionCount] = useState('');
//   const [playersInLobbyCount, setPlayersInLobbyCount] = useState(0);

//   const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(
//     constants.WS_URL,
//     {
//       share: true,
//       filter: isDefinedEvent
//     }
//   );

//   useEffect(() => {
//     const msg = lastJsonMessage as JsonMessage;
//     if (msg) {
//       if (msg.type === 'ConnectionCount') setConnectionCount(msg.data);
//       else if (msg.type === 'playersInLobby') setPlayersInLobbyCount(+msg.data);
//     }
//   }, [lastJsonMessage]);

//   useEffect(() => {
//     // handling history back button and refresh
//     if (readyState === ReadyState.OPEN) {
//       sendJsonMessage({ type: 'ConnectionCount', data: '' });
//       sendJsonMessage({ type: 'playersInLobby', data: '' });
//       sendJsonMessage({ type: 'leaveGame', data: '' });
//     }
//   }, [readyState, sendJsonMessage]);

//   return (
//     <div>
//       <h1>Welcome to socket Chess</h1>
//       <p>Players connected: {connectionCount}</p>
//       <p>Players in Lobby: {playersInLobbyCount} </p>
//       <p>Want to play?</p>
//       <Link to="/lobby">
//         <button>Join Game</button>
//       </Link>
//     </div>
//   );
// };

import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { constants } from '../utils/constants';
import { JsonMessage } from '../types/types';
import { Link } from 'react-router-dom';

export const Root = () => {
  const [connectionCount, setConnectionCount] = useState<number | null>(null);
  const [playersInLobbyCount, setPlayersInLobbyCount] = useState<number>(0);

  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(constants.WS_URL, {
    share: true,
    filter: (message: MessageEvent) => {
      const msg = JSON.parse(message.data) as JsonMessage;
      return ['ConnectionCount', 'playersInLobby', 'leaveGame'].includes(msg.type);
    }
  });

  useEffect(() => {
    // Type assertion here
    const msg = lastJsonMessage as JsonMessage | null;

    if (!msg) return;

    switch (msg.type) {
      case 'ConnectionCount':
        setConnectionCount(Number(msg.data));
        break;
      case 'playersInLobby':
        setPlayersInLobbyCount(Number(msg.data));
        break;
      // Handle other message types as needed
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    // Handling history back button and refresh
    if (readyState === ReadyState.OPEN) {
      ['ConnectionCount', 'playersInLobby', 'leaveGame'].forEach((type) => sendJsonMessage({ type, data: '' }));
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
