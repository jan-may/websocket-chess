import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  userID: string; // uid from server
}

const initialState: UserState = {
  userID: 'none'
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserID: (state, action: PayloadAction<string>) => {
      state.userID = action.payload;
    }
  }
});

export const { setUserID } = userSlice.actions;
export default userSlice.reducer;
