import { rerender } from "../../../store/rerender"
import Status from "../../../components/status"
import { useParams } from "react-router-dom"
import usePost from "../../../hooks/usePost"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { useState } from "react"

const HeroCard = () => {
  let [IsAvailable, setAvailable]=useState(true)
  let { category_id } = useParams()
  let dispatch=useDispatch()

  // create product
  async function createProduct(e) {
    e.preventDefault()
    let price = Number(e.target.price.value)
    if (!price) {
      return toast("price is not a string", { type: "error" });
    }
    let data = {
      title: e.target.title.value,
      price,
      category_id,
      isAvailable: IsAvailable,
    }
    await usePost(`/product`, data)
    e.target.title.value = ""
    e.target.price.value = ""
    dispatch(rerender())  
  }

  return (
    <>
      <div className="border border-secondary border-opacity-50 bg-white rounded mb-3">
        <div className="row pe-2 justify-content-between align-items-center">
          <div className="col-12 col-sm-5">
            <Status />
          </div>
          <div className="col-12 col-sm-3">
            <button
              className="btn btn-success py-3 fw-bold  w-100"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalCreateCategory"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/*modal product create */}
      <div
        className="modal fade"
        id="exampleModalCreateCategory"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add <span>Product</span>
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => createProduct(e)}>
                <input
                  id="title"
                  type="text"
                  placeholder="title"
                  className="form-control mb-4"
                  required
                  minLength={3}
                />
                <input
                  id="price"
                  type="text"
                  placeholder="price"
                  className="form-control mb-4"
                  required
                />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5>Status</h5>
                  <label className="switch">
                    <input type="checkbox" />
                    <span
                      className="trueslider"
                      onClick={() => setAvailable(! IsAvailable)}
                    ></span>
                  </label>
                </div>
                <button type="submit" className="btn btn-success w-100 p-2">
                  Save changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default HeroCard
