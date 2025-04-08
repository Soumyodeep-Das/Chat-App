import { createSlice } from '@reduxjs/toolkit'

const storedUser = JSON.parse(localStorage.getItem("user")) || {};
const storedToken = localStorage.getItem("token") || "";

const initialState = {
    _id: storedUser._id || "",
    name: storedUser.name || "",
    email: storedUser.email || "",
    profile_pic: storedUser.profile_pic || "",
    token: storedToken,
    onlineUser: [],
    socketConnection: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;

      localStorage.setItem("user", JSON.stringify(action.payload)); // Save user info
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload); // Save token
    },
    logout: (state) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.profile_pic = "";
      state.token = "";
      // state.onlineUser = [];
      state.socketConnection = null; // Clear socket connection on logout
      // Clear local storage on logout


      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload; // user logout then socket connection will be null
    },
  },
})

export const { setUser, setToken, logout , setOnlineUser, setSocketConnection} = userSlice.actions;
export default userSlice.reducer;
