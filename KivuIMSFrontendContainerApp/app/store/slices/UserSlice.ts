import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  user: object; // TODO: use actual User interface
}

export const initialUserState: UserState = {
  user: {
    name: "Emmanuel"
  }
};

// TODO: this is a sample slice. please update based on your use case
export const userSlice = createSlice({
  name: "jobFilter",
  initialState: initialUserState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
