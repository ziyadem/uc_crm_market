import { rerender } from "../../../store/rerender"
import Status from "../../../components/status"
import usePost from "../../../hooks/usePost"
import { useDispatch } from "react-redux"
import { useState } from "react"

const HeroCard = () => {
  let [IsAvailable, setAvailable]= useState(true)
  let dispatch=useDispatch()

  // submit
  async function createCategory(e){
    await 
    e.preventDefault()
    await usePost(`/category`, { title: e.target.title.value, IsAvailable })
    e.target.title.value=''
    IsAvailable = true
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
              Add Category
            </button>
          </div>
        </div>
      </div>

    {/* create category modall   */}
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
                Add <span>Category</span>
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e)=>createCategory(e)}>
                <input
                  id="title"
                  type="text"
                  placeholder="title"
                  className="form-control mb-4"
                  minLength={3}
                  required
                />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5>Status</h5>
                  <label className="switch">
                    <input type="checkbox" id="status" />
                    <span className="trueslider" onClick={()=> setAvailable(!IsAvailable)}></span>
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
  );
};
export default HeroCard
