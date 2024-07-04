import { createSlice } from "@reduxjs/toolkit";

export const statusSlice = createSlice({
  name: "status",
  initialState: {
    status: "active",
    IsAvailable: true,
  },
  reducers: {
    active: (state, action) => {
      {
        state.status = "active", state.IsAvailable = true
      }
    },
    inactive: (state, action) => {
      {
        state.status = "inactive", state.IsAvailable = false
      }
    },
  },
});

export const { active, inactive } = statusSlice.actions
export default statusSlice.reducer
