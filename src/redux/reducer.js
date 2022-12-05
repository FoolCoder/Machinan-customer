import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  Services: [],
  Coustmer: null,
  Bookings:null
};

export const dashReducer = createSlice({
  name: 'dashReducer',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {

    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setCoustmer: (state, action) => {
      state.Coustmer = action.payload;
    },
    setServices: (state, action) => {
      state.Services = action.payload;
    },
    removeUser: (state, action) => {
      state.userInfo = null;
    },
    removeCoustmer: (state, action) => {
      state.Coustmer = null;
    },
    setBookings: (state, action) => {
      state.Bookings = action.payload;
    },
  },
});

export const { setUserInfo, setServices, removeUser, setCoustmer, removeCoustmer, setBookings} =
  dashReducer.actions;

// Other code such as selectors can use the imported `RootState` type

export default dashReducer.reducer;
