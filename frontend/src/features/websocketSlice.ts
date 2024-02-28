import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ConnectionStatus = 'connected' | 'disconnected' | 'error';

export interface WebsocketState {
  status: ConnectionStatus;
  messages: string[];
}

const initialState: WebsocketState = {
  status: 'disconnected',
  messages: []
};

export const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.status = action.payload;
    },
    addMessage: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    }
  }
});

export const { setConnectionStatus, addMessage } = websocketSlice.actions;
export default websocketSlice.reducer;
