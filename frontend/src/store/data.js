import { createSlice } from "@reduxjs/toolkit"

export const dataSlice = createSlice({
  name: "data",
  initialState: {},
  reducers: {
    getData: (state, { payload }) => {
     return state = payload
    },
    deleteData: (state, { payload }) => {
     return state = {}
    },
  },
})

export const { getData, deleteData } = dataSlice.actions;
export default dataSlice.reducer;
