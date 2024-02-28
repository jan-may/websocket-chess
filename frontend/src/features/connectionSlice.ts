import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConnectionSlice {
  totalConnections: number;
}

const initialState: ConnectionSlice = {
  totalConnections: 0
};

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnectionCount: (state, action: PayloadAction<number>) => {
      state.totalConnections = action.payload;
    }
  }
});

export const { setConnectionCount } = connectionSlice.actions;
export default connectionSlice.reducer;
