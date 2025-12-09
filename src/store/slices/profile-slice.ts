import { createSlice } from '@reduxjs/toolkit'

export const profileSlice = createSlice({
  initialState:  {
    authChecked: false,
    authToken: null,
    username: '',
  },
  name: 'profile',
  reducers: {
    logout: state => {
      state.authToken = null;
      state.username = '';
      state.authChecked = true;
    },
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload
    },
    setState: (state, action) => {
      return { ...state, ...action.payload }
    },
    setUsername: (state, action) => {
      state.username = action.payload
    }
  }
})

export const { logout, setAuthChecked, setAuthToken, setState, setUsername } = profileSlice.actions

export default profileSlice.reducer;
