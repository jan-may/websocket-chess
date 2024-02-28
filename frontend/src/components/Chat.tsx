import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { constants, MESSAGE_TYPES } from '../utils/constants';
import { useAppSelector } from '../hooks/redux';

interface Message {
  message: string;
  username: string;
  timestamp: Date;
}

interface WebSocketMessage {
  type: 'joinGame' | 'leaveGame' | 'CHAT_MESSAGE' | 'IS_TYPING';
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface ChatProps {
  playerCount: number;
}

export const Chat = (props: ChatProps) => {
  const { userID } = useAppSelector((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string>('opponent');

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(constants.WS_URL, {
    share: true,
    shouldReconnect: () => false,
    filter: (message: MessageEvent) => {
      const { type } = JSON.parse(message.data);
      return type === MESSAGE_TYPES.CHAT_MESSAGE || type === MESSAGE_TYPES.TYPING;
    }
  });

  useEffect(() => {
    if (!lastJsonMessage) return;

    const { type, data } = lastJsonMessage as WebSocketMessage;
    if (type === MESSAGE_TYPES.CHAT_MESSAGE) {
      if (!data) return;
      const { message, username, timestamp } = data;
      const newMessage: Message = {
        message,
        username,
        timestamp: new Date(timestamp)
      };
      setMessages((prev) => [...prev, newMessage]);
    } else if (type === MESSAGE_TYPES.TYPING) {
      if (data.typing) {
        setIsTyping(true);
        setTypingUser(data.username);

        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 5000);
        return () => {
          clearTimeout(timeout);
        };
      } else {
        setIsTyping(false);
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({ type: MESSAGE_TYPES.CHAT_MESSAGE, data: '' });
    }
  }, [readyState, sendJsonMessage]);

  function sendMessage() {
    if (currentMessage.trim() !== '') {
      const newMessage: Message = {
        message: currentMessage,
        username: userID,
        timestamp: new Date()
      };
      sendJsonMessage({ type: MESSAGE_TYPES.CHAT_MESSAGE, data: newMessage });
      setCurrentMessage('');
      sendJsonMessage({ type: MESSAGE_TYPES.TYPING, data: { username: userID, typing: false } });
    }
  }

  let lastTypingTime = Date.now();

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const message = event.target.value;
    setCurrentMessage(message);

    const now = Date.now();
    if (now - lastTypingTime > 1000) {
      // Throttle to send notification max every second
      sendJsonMessage({ type: MESSAGE_TYPES.TYPING, data: { username: userID, typing: true } });
      lastTypingTime = now;
    }
  }

  return (
    <div>
      <h3>Lobby Chat</h3>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={msg.username == userID ? 'msg-container' : 'msg-container op'}>
            <p className={msg.username == userID ? 'msg-text' : 'msg-text-op'}>{msg.message}</p>
            <p className="timestamp">
              {msg.timestamp?.toLocaleTimeString('de-DE', { hour: 'numeric', minute: 'numeric' })}
            </p>
          </div>
        ))}
        {isTyping && <p className="typing">{typingUser} is typing...</p>}
      </div>
      <div>
        <textarea value={currentMessage} onChange={handleChange} rows={3} placeholder="Type your message" />
        <button onClick={sendMessage} className="send-button" disabled={props.playerCount < 2}>
          {props.playerCount < 2 ? 'Wait for player' : 'send'}
        </button>
      </div>
    </div>
  );
};
