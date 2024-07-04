import { useLocation, useNavigate, useParams } from "react-router-dom";
import { rerender } from "../../store/rerender";
import usePost from "../../hooks/usePost";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import izzo from "../../axios";


const Back = () => {
  let status_name = localStorage.getItem("status_name");
  let [toggle, setToggle] = useState(true);
  let [name, setName] = useState("");
  let { category_id } = useParams();
  let { pathname } = useLocation();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let back = pathname.split("/");

  function handleBack(a) {
    navigate(`/${a}`);
  }

  if (category_id) {
    izzo
      .get(`/category/${category_id}`)
      .then((res) => setName(res.data.title))
      .catch((error) => {
        console.log(error);
      });
  }

  // submit
  async function createEmployee(e) {
    e.preventDefault()
    if (e.target.password.value !== e.target.confirmPassword.value) {
      return toast("password and confirmPassword are not the same", {
        type: "error",
      });
    }
    let data = {
      fname: e.target.fname.value,
      lname: e.target.lname.value,
      username: e.target.username.value,
      password: e.target.password.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      IsAvailable: toggle,
    }
    await usePost(`/employee`, data);
    e.target.username.value = "";
    e.target.fname.value = "";
    e.target.lname.value = "";
    e.target.password.value = "";
    e.target.confirmPassword.value = "";
    e.target.phone.value = "";
    e.target.email.value = "";
    toggle = true;
    dispatch(rerender());
  }
  
  return (
    <div className="p-2">
      {back[1] == "categories" ? (
        <div
          className={
            status_name === "kassir"
              ? "bg-white border border-secondary border-opacity-50 rounded p-3 d-flex justify-content-between align-items-center"
              : "bg-white border border-secondary border-opacity-50 rounded p-4 d-flex justify-content-between align-items-center"
          }
        >
          <h5 className="m-0 fs-5 fw-bold ">
            All <span>Categories</span>
          </h5>
          {status_name == "kassir" ? (
            <div className="d-flex gap-2">
              <div
                className="border border-secondary border-opacity-50 rounded bg-secondary bg-opacity-25 d-flex align-items-center gap-3 py-2 px-3 "
                onClick={() => handleBack("history")}
              >
                <i className="fa fa-calendar-o fs-1"></i>
                <h5 className="m-0">History</h5>
              </div>
              <div
                className="border border-secondary border-opacity-50 rounded bg-secondary bg-opacity-25 py-2 px-2 d-flex align-items-center justify-content-center"
                onClick={() => handleBack("statistika")}
              >
                <i className="fa fa-bar-chart fs-1"></i>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="bg-white border border-secondary border-opacity-50 rounded p-2 d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2 justify-content-between">
            <button
              className="border border-secondary border-opacity-50 rounded bg-secondary bg-opacity-25 p-3"
              onClick={() => handleBack("categories")}
            >
              <i className="fa fa-arrow-left me-2"></i>
              <span className="fw-semibold">Back</span>
            </button>
            <h5 className="m-0 fw-bold">
              {back[1] == "products" ? name : back[1]}
            </h5>
          </div>
          {pathname == "/employee" ? (
            <div className="w-25">
              <button
                className="btn btn-success w-100 py-3"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalAddEmployee"
              >
                Add Employee
              </button>
            </div>
          ) : null}
        </div>
      )}
      {/* employe create modal */}
      <div
        className="modal fade"
        id="exampleModalAddEmployee"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add <span>Employee</span>
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => createEmployee(e)}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="username"
                  className="form-control mb-2"
                  required
                  min={3}
                />
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  placeholder="First Name"
                  className="form-control mb-2"
                  required
                  min={3}
                />
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  placeholder="Last Name"
                  className="form-control mb-2"
                  required
                  min={3}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="form-control mb-2"
                  required
                  min={3}
                />
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="998998887766"
                  className="form-control mb-2"
                  required
                  min={3}
                />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-control mb-2"
                  required
                  min={6}
                />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Conform Password"
                  className="form-control mb-2"
                  required
                />
                <div className="d-flex justify-content-between align-items-center my-2">
                  <h5>Status</h5>
                  <div
                    className={toggle ? "active-toggle" : "inactive-toggle"}
                    onClick={() => setToggle(!toggle)}
                  >
                    <div className="toggle-round"></div>
                  </div>
                </div>
                <button type="submit" className="btn btn-success w-100">
                  Save changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Back;
