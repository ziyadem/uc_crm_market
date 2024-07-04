import { useDispatch, useSelector } from "react-redux";
import { rerender } from "../../../store/rerender";
import { deleteData, getData } from "../../../store/data";
import useDelete from "../../../hooks/useDelete";
import useGet from "../../../hooks/useGet";
import { useState } from "react";
import usePatch from "../../../hooks/usePatch";

const EmployeeInfo = () => {
  let { data } = useSelector((s) => s);
  let [employee, loading] = useGet(`employee/${data.updId}`, data);
  let dispatch = useDispatch();
  let [emp, setEmp] = useState({ id: "" });

  // input change
  function handleInputChange(e) {
    setEmp((ov) => ({ ...ov, [e.target.name]: e.target.value }));
  }

  // deleted
  async function deleted() {
    await useDelete(`/employee/${emp.id}`);
    dispatch(rerender());
    dispatch(deleteData());
  }

  // update
  async function update(e) {
    e.preventDefault()
    await usePatch(
      `/employee/${emp.id}`,
      emp,
      "updated"
    );
    dispatch(rerender());
    dispatch(getData({updId:emp.id}))
    setEmp({})
  }

  return (
    <div className="p-1">
      <div className="h-100 border rounded-5 bg-secondary p-3 bg-opacity-25">
        {data.updId ? (
          loading ? (
            // loader
            <div className="d-flex align-items-center justify-content-center h-100">
              <img src="/loading.gif" alt="loading" className="w-25" />
            </div>
          ) : (
            // info
            <div>
              {/* hero */}
              <div className="border rounded bg-white w-100 p-3 mb-3 d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold m-0">{employee.username}</h5>
                  <p className="text-secondary">kassir</p>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <div
                    className="p-2 border rounded bg-secondary bg-opacity-25"
                    onClick={() => setEmp(employee)}
                    data-bs-toggle="modal"
                    data-bs-target="#updateEmployee"
                  >
                    <i className="fa fa-edit text-success fs-4"></i>
                  </div>
                  <div
                    className="p-2 border rounded bg-secondary bg-opacity-25"
                    onClick={() => setEmp({ id: employee.id })}
                    data-bs-toggle="modal"
                    data-bs-target="#deleteEmployee"
                  >
                    <i className="fa fa-trash-o text-danger fs-4"></i>
                  </div>
                  <div
                    className="p-2 border rounded bg-secondary bg-opacity-25"
                    onClick={() => dispatch(deleteData())}
                  >
                    <i className="fa fa-remove fs-5"></i>
                  </div>
                </div>
              </div>

              {/* list group */}
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  <h6 className="m-0 fw-bold">First name</h6>
                  <p>{employee.fname}</p>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <h6 className="m-0 fw-bold">Last name</h6>
                  <p>{employee.lname}</p>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <h6 className="m-0 fw-bold">username</h6>
                  <p>{employee.username}</p>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <h6 className="m-0 fw-bold">Password</h6>
                  <p>**********</p>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <h6 className="m-0 fw-bold">Status</h6>
                  <p>{employee.IsAvailable ? "active" : "inactive"}</p>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <h6 className="m-0 fw-bold">created at</h6>
                  <p>{employee?.createdAt?.split("T")[0]}</p>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <h6 className="m-0 fw-bold">Phone</h6>
                  <p>+{employee.phone}</p>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <h6 className="m-0 fw-bold">Email</h6>
                  <p>{employee.email}</p>
                </li>
              </ul>

              {/* modal employee delete */}
              <div
                className="modal fade"
                id="deleteEmployee"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="staticBackdropLabel">
                        warning!!!
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">Delete the employee???</div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => deleted()}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* modal employee update  */}
              <div
                className="modal fade"
                id="updateEmployee"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="staticBackdropLabelBlock"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1
                        className="modal-title fs-5"
                        id="staticBackdropLabelBlock"
                      >
                        warning
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={(e) => update(e)}>
                        <div className="d-flex gap-2 align-items-center justify-content-between">
                          <label htmlForfor="username" class="form-label">
                            Username:
                          </label>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            value={emp.username}
                            placeholder="username"
                            className="form-control mb-2 w-75"
                            onChange={handleInputChange}
                            minLength={3}
                          />
                        </div>
                        <div className="d-flex gap-2 align-items-center justify-content-between">
                          <label htmlForfor="fname" class="form-label">
                            Familya:
                          </label>
                          <input
                            id="fname"
                            type="text"
                            name="fname"
                            value={emp.fname}
                            placeholder="First Name"
                            className="form-control mb-2 w-75"
                            onChange={handleInputChange}
                            minLength={3}
                          />
                        </div>
                        <div className="d-flex gap-2 align-items-center justify-content-between">
                          <label htmlForfor="lname" class="form-label">
                            Ism:
                          </label>
                          <input
                            type="text"
                            name="lname"
                            id="lname"
                            value={emp.lname}
                            placeholder="Last Name"
                            className="form-control mb-2 w-75"
                            onChange={handleInputChange}
                            minLength={3}
                          />
                        </div>
                        <div className="d-flex gap-2 align-items-center justify-content-between">
                          <label htmlForfor="password" class="form-label">
                            Password:
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            value={emp.password}
                            placeholder="Password"
                            className="form-control mb-2 w-75"
                            onChange={handleInputChange}
                            minLength={3}
                          />
                        </div>
                        <div className="d-flex gap-2 align-items-center justify-content-between">
                          <label htmlForfor="email" class="form-label">
                            Email:
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={emp.email}
                            placeholder="Email"
                            className="form-control mb-2 w-75"
                            onChange={handleInputChange}
                            minLength={3}
                          />
                        </div>
                        <div className="d-flex gap-2 align-items-center justify-content-between">
                          <label htmlForfor="phone" class="form-label">
                            Phone:
                          </label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={emp.phone}
                            placeholder="Phone"
                            className="form-control mb-2 w-75"
                            onChange={handleInputChange}
                            minLength={3}
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            type="submit"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            save
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            close
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-secondary">
            <h5>no employee available</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeInfo;
