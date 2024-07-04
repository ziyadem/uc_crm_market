import React, { useState } from "react";
import useDelete from "../../../hooks/useDelete";
import usePost from "../../../hooks/usePost";
import usePatch from "../../../hooks/usePatch";
import useGet from "../../../hooks/useGet";
import { toast } from "react-toastify";

const Admins = () => {
  let [reload, setReload] = useState(true);
  let [data, loading] = useGet("/company-user", reload);
  let [user, setUser] = useState({ id: "", password: "" });
  let [values, setValues] = useState({
    id: "",
    username: "",
    password: "",
    telegramId: "",
    confirmPassword: "",
  });

  console.log(data, "datttt");

  // input change
  function handleInputChange(e) {
    setValues((ov) => ({ ...ov, [e.target.name]: e.target.value }));
  }

  // submit
  async function handleSubmit(e) {
    e.preventDefault();
    if (values.confirmPassword !== values.password) {
      return toast(" password and confirmpassword are not equal ", {
        type: "error",
      });
    }
    if (!Number(values.telegramId)) {
      return toast("telegram id valid", { type: "error" });
    }
    await usePost(`/user`, {
      username: values.username,
      password: values.password,
      telegramId: values.telegramId,
    });
    setValues({
      username: "",
      password: "",
      confirmPassword: "",
      telegramId: "",
    });
    setReload(!reload);
  }

  // deleted
  async function deleted() {
    await useDelete(`/user/${user.id}`);
    setReload(!reload);
  }

  // updated
  async function updated() {
    let data = {};
    if (values.username) {
      data.username = values.username;
    }
    if (values.password) {
      data.password = values.password;
    }
    if (values.telegramId) {
      data.telegramId = values.telegramId;
    }
    await usePatch(`/user/${values.id}`, data, "updated");
    setValues({ id: "", telegramId: "", username: "", password: "" });
    setReload(!reload);
  }
  console.log(values);

  return (
    <section className="p-3">
      <h5 className="my-4">Create Admin:</h5>

      {/* form */}
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="d-flex gap-4 mb-4">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="username"
            className="form-control border border-secondary border-opacity-50"
            required
            minLength={3}
            value={values.username}
            onChange={(e) => handleInputChange(e)}
          />
          <input
            id="password"
            type="password"
            name="password"
            placeholder="password"
            className="form-control border border-secondary border-opacity-50"
            required
            minLength={6}
            value={values.password}
            onChange={(e) => handleInputChange(e)}
          />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="form-control border border-secondary border-opacity-50"
            required
            minLength={6}
            value={values.confirmPassword}
            onChange={(e) => handleInputChange(e)}
          />
          <input
            type="text"
            id="telegramId"
            name="telegramId"
            placeholder="Telegram Id"
            className="form-control border border-secondary border-opacity-50"
            required
            minLength={10}
            value={values.telegramId}
            onChange={(e) => handleInputChange(e)}
          />
          <button className="btn btn-success w-100" type="submit">
            create
          </button>
        </div>
        <div className="d-flex gap-4 my-3"></div>
      </form>

      {/* table */}
      <div>
        <table className="table my-3 table-striped table-hover table-secondary ">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">name</th>
              <th scope="col">password</th>
              <th scope="col">telegram id</th>
              <th scope="col">Update</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.users?.map((u, idx) => {
              return (
                <tr key={u.id}>
                  <th scope="row">{idx + 1}</th>
                  <td>{u.username}</td>
                  <td>**********</td>
                  <td>{u.telegramId}</td>
                  <td>
                    <i
                      value={u.id}
                      data-bs-toggle="modal"
                      data-bs-target="#userUpdate"
                      className="fa fa-edit text-success fs-4"
                      onClick={() =>
                        setValues({
                          id: u.id,
                          username: u.username,
                          password: "**********",
                          telegramId: u.telegramId,
                        })
                      }
                    ></i>
                  </td>
                  <td>
                    <i
                      value={u.id}
                      data-bs-toggle="modal"
                      data-bs-target="#userDelete"
                      className="fa fa-trash-o text-danger fs-4 pointer"
                      onClick={() => setUser({ id: u.id })}
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* modal user delete */}
      <div
        className="modal fade"
        id="userDelete"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabelUser"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabelUser">
                warning!!!
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Delete the user???</div>
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

      {/* modal user update  */}
      <div
        className="modal fade"
        id="userUpdate"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabelPatch"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabelPatch">
                User Updated
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form>
                <input
                  name="username"
                  type="text"
                  placeholder="username"
                  className="form-control"
                  value={values.username}
                  onChange={(e) => handleInputChange(e)}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  required
                  className="form-control mt-3"
                  value={values.password}
                  onChange={(e) => handleInputChange(e)}
                />
                <input
                  type="text"
                  name="telegramId"
                  placeholder="telegramId"
                  required
                  className="form-control mt-3"
                  value={values.telegramId}
                  onChange={(e) => handleInputChange(e)}
                />
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-secondary"
                required
                data-bs-dismiss="modal"
                onClick={() => updated()}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admins;
