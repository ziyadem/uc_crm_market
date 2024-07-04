import { createSlice } from "@reduxjs/toolkit"

export const orderSlice = createSlice({
  name: "order",
  initialState: [],
  reducers: {
    orders: (state, { payload }) => {
      let a = state.find((a) => a.id == payload.id);
      if (!a) {
        state.push({ ...payload, count: 1 });
      }
    },
    increment: (state, { payload }) => {
      state.map((obj) => {
        if (obj.id === payload.id) {
          obj.count++;
        }
      });
    },
    decrement: (state, { payload }) => {
      state.map((obj) => {
        if (obj.id === payload.id && obj.count > 1) {
          obj.count--
        }
      });
    },
    deleteOrder: (state, { payload }) => {
      let arr=state.filter((o) => o.id !==payload.id)
      return state=arr
    },
    deleteAllOrder: (state, { payload }) => {
      return state=[]
    },
  },
});

export const { increment, decrement, orders, deleteOrder, deleteAllOrder } =
  orderSlice.actions;
export default orderSlice.reducer;