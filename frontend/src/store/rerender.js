import { createSlice } from "@reduxjs/toolkit"

export const rerenderSlice = createSlice({
  name: "reload",
  initialState: { data: true },
  reducers: {
    rerender: (state, action) => {
      state.data = !state.data
    },
  },
});

export const { rerender } = rerenderSlice.actions
export default rerenderSlice.reducer
