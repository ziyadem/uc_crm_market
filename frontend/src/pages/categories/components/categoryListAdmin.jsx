import { useDispatch, useSelector } from "react-redux"
import { rerender } from "../../../store/rerender"
import useDelete from "../../../hooks/useDelete"
import { useNavigate } from "react-router-dom"
import usePatch from "../../../hooks/usePatch"
import useGet from "../../../hooks/useGet"
import color from "../../../static"
import { useState } from "react"

const CategoryListAdmin = () => {
  let { status, reload } = useSelector((s) => s);
  let [categorys, loading] = useGet(`category`, reload);
  let [category, setCategory] = useState({ id: "", updatetitle: "" })
  let dispatch = useDispatch()
  let navigate = useNavigate()

  // input change
  function handleInputChange(e) {
    setCategory((ov) => ({ ...ov, [e.target.name]: e.target.value }));
  }

  // category IsAvailable sort
  if (status.status === "active") {
    categorys = categorys.filter((c) => c.IsAvailable === true)
  }
  if (status.status === "inactive") {
    categorys = categorys.filter((c) => c.IsAvailable === false)
  }

  // deleted
  async function deleted() {
    await useDelete(`/category/${category.id}`);
    dispatch(rerender())
  }

  // block
  async function block(data) {
    let message = data.IsAvailable ? "bloked" : "unbloked";
    await usePatch(
      `/category/${data.id}`,
      { IsAvailable: !data.IsAvailable },
      message
    )
    dispatch(rerender())
  }

  // update
  async function update(e) {
    e.preventDefault()
    await usePatch(
      `/category/${category.id}`,
      { title: category.updatetitle },
      "updated"
    )
   dispatch(rerender())
  }
  
  return (
    <>
      {loading ? (
        // loader
        <div className="d-flex align-items-center justify-content-center h-100">
          <img src="/loading.gif" alt="loading" className="w-25" />
        </div>
      ) : // categgory list
      categorys.length !== 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 list p-3 scrol_card" >
          {categorys?.map((c, idx) => {
            return (
              <div className="p-1" key={c.id}>
                <div
                  className={`${
                    color[idx % 6]
                  } border border-secondary border-opacity-50 rounded p-3 text-white`}
                >
                  <div className="mb-5 d-flex align-items-center justify-content-between">
                    <h3 onClick={() => navigate(`/products/${c.id}`)}>
                      {c.title}
                    </h3>
                    <div className="dropdown">
                      <i
                        className=" fa fa-solid fa-ellipsis-v fs-5 category-edit-icon"
                        data-bs-toggle="dropdown"
                      ></i>
                      <ul className="dropdown-menu p-1">
                        <li
                          className="dropdown-item d-flex align-items-center justify-content-between"
                          data-bs-toggle="modal"
                          data-bs-target="#updateCategory"
                          onClick={() =>
                            setCategory({ id: c.id, title: c.title, updatetitle:c.title })
                          }
                        >
                          <p>update</p>
                          <i className="fa fa-edit text-primary"></i>
                        </li>
                        <li
                          className="dropdown-item d-flex align-items-center justify-content-between"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteCategory"
                          onClick={() => setCategory({ id: c.id })}
                        >
                          <p>delete</p>
                          <i className="fa fa-trash text-danger"></i>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <h5>{c.product_count}</h5>
                    <label className="switch">
                      <input type="checkbox" />
                      <span
                        className={
                          status.status == "active"
                            ? "trueslider"
                            : "falseslider"
                        }
                        onClick={() =>
                          block({ id: c.id, IsAvailable: c.IsAvailable })
                        }
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}

          {/* modal category delete */}
          <div
            className="modal fade"
            id="deleteCategory"
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
                <div className="modal-body">Delete the category???</div>
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

          {/* modal category update  */}
          <div
            className="modal fade"
            id="updateCategory"
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
                    <input
                      type="text"
                      name="updatetitle"
                      value={category.updatetitle}
                      className="form-control mb-3"
                      placeholder="title"
                      onChange={handleInputChange}
                    />
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
      ) : (
        // not found
        <div className="d-flex align-items-center justify-content-center fs-1 text-secondary w-100 h-50">
          <p>category not fount</p>
        </div>
      )}
    </>
  );
};

export default CategoryListAdmin;
