import { useDispatch, useSelector } from "react-redux"
import { active, inactive } from "../../store/status"

const Status = () => {
  let {status}=useSelector((s)=> s.status)
  let dispatch=useDispatch()
  return (
    <div className="d-flex p-2 bg-white rounded">
      <button
        className={
          status == "active"
            ? "border border-secondary border-opacity-50 rounded py-3 fw-bold text-success w-50"
            : "border-0 py-3 fw-bold text-secondary bg-white w-50"
        }
        onClick={() => dispatch(active())}
      >
        Active
      </button>
      <button
        className={
          status == "inactive"
            ? "border border-secondary border-opacity-50 rounded py-3 fw-bold text-success w-50"
            : "border-0 py-3 fw-bold text-secondary bg-white w-50"
        }
        onClick={() => dispatch(inactive())}
      >
        InActive
      </button>
    </div>
  );
};

export default Status;
