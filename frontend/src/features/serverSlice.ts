import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ServerState {
  playerCount: number;
  lobbyCount: number;
}

const initialState: ServerState = {
  playerCount: 0,
  lobbyCount: 0
};

export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setServerState: (state, action: PayloadAction<ServerState>) => {
      state.playerCount = action.payload.playerCount;
      state.lobbyCount = action.payload.lobbyCount;
    }
  }
});

export const { setServerState } = serverSlice.actions;
export default serverSlice.reducer;
