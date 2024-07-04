import { useLocation, useNavigate } from "react-router-dom";
import logOut from "../../functions/log-out";
import Back from "../back";
import React from "react";

const Header = () => {
  let { pathname } = useLocation();
  let navigate = useNavigate();

  return (
    <header className="row row-cols-1 row-cols-sm-2">
      <Back />
      {pathname !== "/users" ? (
        <div className="p-2 ">
          <div className="bg-white rounded d-flex justify-content-center">
            <div className="bg-white w-100 border border-secondary border-opacity-50 rounded row align-items-center justify-content-between">
              <div className="col-12 col-sm-8 d-flex p-2 justify-content-between align-items-center">
                <h5 className="m-0 ps-3">Admin</h5>
                <div
                  className="border border-secondary border-opacity-50 rounded bg-secondary bg-opacity-25 d-flex align-items-center gap-3 py-2 px-3 "
                  onClick={() => navigate("/history")}
                >
                  <i className="fa fa-calendar-o fs-1"></i>
                  <h5 className="m-0">History</h5>
                </div>
              </div>
              <div className="col-12 col-sm-4 row row-cols-3 m-0 p-0">
                <div className="p-1">
                  <div
                    onClick={() => navigate("/employee")}
                    className="border border-secondary border-opacity-50 rounded bg-secondary bg-opacity-25 py-2 px-2 d-flex align-items-center justify-content-center"
                  >
                    <i className="fa fa-user-circle-o fs-1"></i>
                  </div>
                </div>
                <div className="p-1">
                  <div
                    onClick={() => navigate("/statistika")}
                    className="border border-secondary border-opacity-50 rounded bg-secondary bg-opacity-25 py-2 px-2 d-flex align-items-center justify-content-center"
                  >
                    <i className="fa fa-bar-chart fs-1"></i>
                  </div>
                </div>
                <div className="p-1">
                  <div
                    className="border border-secondary border-opacity-50 py-2 px-2 rounded text-white bg-danger d-flex align-items-center justify-content-center"
                    onClick={() => logOut()}
                  >
                    <i className="fa fa-sign-out fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
