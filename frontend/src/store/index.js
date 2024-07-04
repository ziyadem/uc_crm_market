import { configureStore } from "@reduxjs/toolkit"
import reload from "./rerender"
import order from './order'
import status from "./status"
import data from "./data"

const store = configureStore({
  reducer: {
    status,
    order,
    reload,
    data,
  },
});

export default store

