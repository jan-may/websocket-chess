import { configureStore } from '@reduxjs/toolkit';
import websocketSlice from '../features/websocketSlice';
import lobbySlice from '../features/lobbySlice';
import serverSlice from '../features/serverSlice';
import connectionSlice from '../features/connectionSlice';

export const store = configureStore({
  reducer: {
    websocket: websocketSlice,
    lobby: lobbySlice,
    server: serverSlice,
    connection: connectionSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
