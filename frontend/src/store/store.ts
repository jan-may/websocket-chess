import { configureStore } from '@reduxjs/toolkit';
import websocketSlice from '../features/websocketSlice';
import lobbySlice from '../features/lobbySlice';
import serverSlice from '../features/serverSlice';
import connectionSlice from '../features/connectionSlice';
import userSlice from '../features/userSlice';

export const store = configureStore({
  reducer: {
    websocket: websocketSlice,
    lobby: lobbySlice,
    server: serverSlice,
    connection: connectionSlice,
    user: userSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
