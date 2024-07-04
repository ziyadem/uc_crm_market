import React from 'react'
import ReactDOM from 'react-dom/client'

// route
import { BrowserRouter as Router } from 'react-router-dom'

// redux
import { Provider } from "react-redux"
import store from "./store/index"


// axios
import axios from "axios";
let token = localStorage.getItem("token")
axios.defaults.baseURL = "http://localhost:7777"
axios.defaults.headers.common["Content-Type"] = "application/json"
if (token) axios.defaults.headers.common["authorization"] = `Bearer ${token}`


// stayle
import './style/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/js/bootstrap.bundle.min"
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'


ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer />
  </Router>
);
