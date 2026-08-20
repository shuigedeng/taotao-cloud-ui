import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface GlobalState {
  isLoading: boolean;
}

const initialState: GlobalState = {
  isLoading: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {setLoading} = globalSlice.actions;
export default globalSlice.reducer;
