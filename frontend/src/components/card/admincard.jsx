import { useLocation, useNavigate } from 'react-router-dom'
import logOut from '../../functions/log-out'
import React from 'react'

const CardHeader = () => {
  let navigate=useNavigate()
  let { pathname }=useLocation()
  return (
    <div className="p-3 d-flex justify-content-between align-items-center border border-secondary border-opacity-50 rounded-4 bg-secondary bg-opacity-25">
      <div className="d-flex gap-2">
        <button
          type="button"
          className={
            pathname === "/company"
              ? "btn btn-success px-5"
              : "btn btn-outline-success px-5"
          }
          onClick={() => navigate("/company")}
        >
          Company
        </button>
        <button
          type="button"
          className={
            pathname === "/employee"
              ? "btn btn-success px-5"
              : "btn btn-outline-success px-5"
          }
          onClick={() => navigate("/employee")}
        >
          Employee
        </button>
      </div>
      <div>
        <div
          className="border border-secondary border-opacity-50 p-1 px-2 rounded text-white bg-danger d-flex align-items-center justify-content-center"
          onClick={() => logOut()}
        >
          <i className="fa fa-sign-out fs-3"></i>
        </div>
      </div>
    </div>
  );
}

export default CardHeader
