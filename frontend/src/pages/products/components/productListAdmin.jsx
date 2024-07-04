import { useDispatch, useSelector } from "react-redux"
import { rerender } from "../../../store/rerender"
import useDelete from "../../../hooks/useDelete"
import usePatch from "../../../hooks/usePatch"
import { useParams } from "react-router-dom"
import useGet from "../../../hooks/useGet"
import { useState } from "react"

const ProductListAdmin = () => {
  let { category_id } = useParams();
  let dispatch=useDispatch()
  let { status, reload } = useSelector((s) => s);
  let [product, setProduct] = useState({ id: "", updatetitle: "" });
  let [products, loading] = useGet(`product/all/${category_id}`, reload);

  // input change
  function handleInputChange(e) {
    setProduct((ov) => ({ ...ov, [e.target.name]: e.target.value }));
  }
  // product IsAvailable sort
  if (status.status === "active") {
    products = products.filter((p) => p.IsAvailable === true);
  }
  if (status.status === "inactive") {
    products = products.filter((p) => p.IsAvailable === false);
  }

  // deleted
  async function deleted() {
    await useDelete(`/product/${product.id}`)
    dispatch(rerender())
  }

  // block
  async function block(data) {
    let message = data.IsAvailable ? "bloked" : "unbloked"
    await usePatch(
      `/product/${data.id}`,
      { IsAvailable: !data.IsAvailable },
      message
    );
    dispatch(rerender())
  }

  // update
  async function update(e) {
    e.preventDefault();
    await usePatch(
      `/product/${product.id}`,
      { title: product.updatetitle },
      "updated"
    )
    setProduct({id:'', updatetitle:''})
    dispatch(rerender())
  }

  return (
    <>
      {loading ? (
        // loader
        <div className="d-flex align-items-center justify-content-center h-100">
          <img src="/loading.gif" alt="loading" className="w-25" />
        </div>
      ) : products.length !== 0 ? (
        // products list
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 p-3 scrol_card">
          {products?.map((p) => {
            return (
              <div className="p-1" key={p.id}>
                <div className="border border-secondary border-opacity-50 rounded bg-white  p-3">
                  <div className="mb-5 d-flex align-items-center justify-content-between">
                    <h4>{p.title}</h4>
                    <div className="dropdown">
                      <i
                        className=" fa fa-solid fa-ellipsis-v fs-5 category-edit-icon"
                        data-bs-toggle="dropdown"
                      ></i>
                      <ul className="dropdown-menu p-1">
                        <li
                          className="dropdown-item d-flex align-items-center justify-content-between"
                          data-bs-toggle="modal"
                          data-bs-target="#updateProduct"
                          onClick={() =>
                            setProduct({ id: p.id, updatetitle: p.title })
                          }
                        >
                          <p>update</p>
                          <i className="fa fa-edit text-primary"></i>
                        </li>
                        <li
                          className="dropdown-item d-flex align-items-center justify-content-between"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteProduct"
                          onClick={() => setProduct({ id: p.id })}
                        >
                          <p>delete</p>
                          <i className="fa fa-trash text-danger"></i>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="text-success">
                      {p.price} <span className="text-secondary">so'm</span>
                    </h5>

                    <label className="switch">
                      <input type="checkbox" />
                      <span
                        className={
                          status.status == "active"
                            ? "trueslider"
                            : "falseslider"
                        }
                        onClick={() =>
                          block({ id: p.id, IsAvailable: p.IsAvailable })
                        }
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}

          {/* modal product delete */}
          <div
            className="modal fade"
            id="deleteProduct"
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
                <div className="modal-body">Delete the product???</div>
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

          {/* modal product update  */}
          <div
            className="modal fade"
            id="updateProduct"
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
                      placeholder="title"
                      value={product.updatetitle}
                      className="form-control mb-3"
                      onChange={handleInputChange}
                      minLength={3}
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
        <div className="d-flex align-items-center justify-content-center fs-1 text-secondary h-50">
          <p>product not fount</p>
        </div>
      )}
    </>
  );
};

export default ProductListAdmin
