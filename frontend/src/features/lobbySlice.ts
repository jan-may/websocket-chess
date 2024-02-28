import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Lobby {
  id: string;
  players: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  maxPlayers: number;
  gameType: string;
}

export interface lobbyState {
  lobbyState: Lobby;
}

const initialState: lobbyState = {
  lobbyState: {
    id: '',
    players: [],
    maxPlayers: 0,
    gameType: 'default'
  }
};

export const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    setLobbyState: (state, action: PayloadAction<Lobby>) => {
      state.lobbyState = action.payload;
    }
  }
});

export const { setLobbyState } = lobbySlice.actions;
export default lobbySlice.reducer;
