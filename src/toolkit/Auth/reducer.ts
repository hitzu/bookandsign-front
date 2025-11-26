import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "src/interfaces";

interface AuthState {
  userInfo: UserInfo | null;
  error: string | null;
}

const initialState: AuthState = {
  userInfo: null,
  error: null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setUserInfo } = AuthSlice.actions;
export default AuthSlice.reducer;
