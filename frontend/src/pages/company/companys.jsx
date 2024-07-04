import useDelete from "../../hooks/useDelete";
import usePatch from "../../hooks/usePatch";
import usePost from "../../hooks/usePost";
import React, { useState } from "react";
import useGet from "../../hooks/useGet";

const Companys = () => {
  let [reload, setReload] = useState(true);
  let [data, loading] = useGet("/company-user", reload);
  let [company, setCom] = useState({ id: "", IsActive: true });
  let [values, setValues] = useState({ name: "", admin_id: "" });

  // input change
  function handleInputChange(e) {
    setValues((ov) => ({ ...ov, [e.target.name]: e.target.value }));
  }

  // submit
  async function handleSubmit(e) {
    e.preventDefault();
    await usePost(`/company`, { ...values, IsActive: true });
    setValues({ name: "", admin_id: "" });
    setReload(!reload);
  }

  // deleted
  async function deleted() {
    await useDelete(`/company/${company.id}`);
    setReload(!reload);
  }

  // blocked
  async function block() {
    let message = company.IsActive ? "blocked" : "unblocked";
    await usePatch(
      `/company/${company.id}`,
      { IsActive: !company.IsActive },
      message
    );
    setReload(!reload);
  }

  // updated
  async function updated() {
    await usePatch(`/company/${company.id}`, { name: values.name }, "updated");
    setValues({ name: "" });
    setReload(!reload);
  }

  // async function fileUp() {
  //   console.log(12222);
  //   let a = await axios.get(`/file/upload`);
  //   console.log(a, "a");

  //   saveAs(new Blob([a]), "data.xlsx");
  // }

  return (
    <>
      {loading ? (
        // loader
        <div className="d-flex align-items-center justify-content-center h-100">
          <img src="/loading.gif" alt="loading" className="w-25" />
        </div>
      ) : (
        <div className=" p-3">
          <h5 className="my-4">Create Company:</h5>

          {/* form */}
          <form
            className="row row-cols-3 mb-4 px-2"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="p-1">
              <input
                id="name"
                type="text"
                placeholder="name"
                name="name"
                value={values.name}
                onChange={handleInputChange}
                className="form-control border border-secondary border-opacity-50"
                required
              />
            </div>
            <div className="p-1">
              <select
                id="admin"
                className="form-select border border-secondary border-opacity-50"
                aria-label="Default select example"
                name="admin_id"
                required
                onChange={handleInputChange}
              >
                <option selected>user name</option>
                {data.users?.map((u) => {
                  return (
                    <option key={u.id} value={u.id}>
                      {u.username}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="p-1">
              <button className="btn btn-success w-100" type="submit">
                create
              </button>
            </div>
          </form>

          {/* table */}
          <table className="table my-3 table-striped table-hover table-secondary">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Company</th>
                <th scope="col">Admin</th>
                <th scope="col">Block</th>
                <th scope="col">Update</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.companys?.map((c, idx) => {
                return (
                  <tr key={c.id}>
                    <th scope="row">{idx + 1}</th>
                    <td>{c.name}</td>
                    <td>{c.user.username}</td>
                    <td>
                      <i
                        className={
                          c.IsActive
                            ? "fa fa-check text-success fs-4"
                            : "fa fa-remove text-danger fs-4"
                        }
                        value={c.id}
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdropBlock"
                        onClick={() =>
                          setCom({ id: c.id, IsActive: c.IsActive })
                        }
                      ></i>
                    </td>
                    <td>
                      <i
                        className="fa fa-edit text-success fs-4"
                        value={c.id}
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdropPatch"
                        onClick={() =>
                          setCom({ id: c.id, IsActive: c.IsActive })
                        }
                      ></i>
                    </td>
                    <td>
                      <i
                        className="fa fa-trash-o text-danger fs-4"
                        value={c.id}
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop"
                        onClick={() =>
                          setCom({ id: c.id, IsActive: c.IsActive })
                        }
                      ></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* modal deleded company */}
          <div
            className="modal fade"
            id="staticBackdrop"
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
                <div className="modal-body">Delete the company???</div>
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

          {/* modal company block  */}
          <div
            className="modal fade"
            id="staticBackdropBlock"
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
                <div class="modal-body">
                  Do you change the status of the company block?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => block()}
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

          {/* modal company update  */}
          <div
            className="modal fade"
            id="staticBackdropPatch"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabelPatch"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-5"
                    id="staticBackdropLabelPatch"
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
                <div class="modal-body">
                  <form>
                    <input
                      type="text"
                      placeholder="company name"
                      className="form-control"
                      name="name"
                      onChange={handleInputChange}
                    />
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => updated()}
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
        </div>
      )}
    </>
  );
};

export default Companys;
