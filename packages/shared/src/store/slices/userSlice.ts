import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  profile: Record<string, any> | null;
  isLoggedIn: boolean;
  loginCount: number;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoggedIn: false,
  loginCount: 0,
  accessToken: null,
  refreshToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        profile: Record<string, any>;
        accessToken: string;
        refreshToken?: string | null;
      }>,
    ) => {
      state.profile = action.payload.profile;
      state.isLoggedIn = true;
      state.loginCount += 1;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? null;
    },
    logout: state => {
      state.profile = null;
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
    // 增加计数器的例子，展示持久化效果
    incrementCount: state => {
      state.loginCount += 1;
    },
  },
});

export const {login, logout, incrementCount} = userSlice.actions;
export default userSlice.reducer;
