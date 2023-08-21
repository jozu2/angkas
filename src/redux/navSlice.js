import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  travelTimeInformation: null,
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    //gotoschool datas
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setTravelTimeInformation: (state, action) => {
      state.travelTimeInformation = action.payload;
    },

    //gotohome datas
    setHomeDestination: (state, action) => {
      state.homeDestination = action.payload;
    },

    setGoingHomeTraveltime: (state, action) => {
      state.goingHomeTraveltime = action.payload;
    },
  },
});

export const {
  setOrigin,
  setDestination,
  setTravelTimeInformation,
  setHomeDestination,
  setGoingHomeTraveltime,
} = navSlice.actions;

//Selectors go to school user
export const selectOrigin = (state) => state.nav.origin;
export const selectTravelTimeInformation = (state) =>
  state.nav.travelTimeInformation;

//Selectors go to home user
export const selectHomeDestination = (state) => state.nav.homeDestination;
export const SelectGoingHomeTraveltime = (state) =>
  state.nav.goingHomeTraveltime;

export default navSlice.reducer;
