import { useDispatch, useSelector } from "react-redux";
import Status from "../../../components/status";
import useGet from "../../../hooks/useGet";
import usePatch from "../../../hooks/usePatch";
import { rerender } from "../../../store/rerender";
import { getData } from "../../../store/data";
import Back from "../../../components/back";

const EmployeeList = () => {
  const { status, reload } = useSelector((s) => s);
  let [employees, loading] = useGet(`employee`, reload);
  let dispatch = useDispatch();

  // employee IsAvailable sort
  let employee = [];
  if (status.status === "active") {
    employee = employees?.employee?.filter((c) => c.IsAvailable === true);
  }
  if (status.status === "inactive") {
    employee = employees?.employee?.filter((c) => c.IsAvailable === false);
  }

  // block
  async function block(data) {
    let message = data.IsAvailable ? "bloked" : "unbloked";
    await usePatch(
      `/employee/${data.id}`,
      { IsAvailable: !data.IsAvailable },
      message
    );
    dispatch(rerender());
  }

  return (
    <div className="p-1">
      <div className="border rounded-5 bg-secondary p-2 bg-opacity-25 h-100">
        <div>
          <Back />
          <div className=" p-2">
            <Status />
          </div>
        </div>
        {/* admin */}
        <div className=" p-2 ">
          {/* employee */}
          {loading ? (
            // loader
            <div className="d-flex align-items-center justify-content-center h-100">
              <img src="/loading.gif" alt="loading" className="w-25" />
            </div>
          ) : employee?.length !== 0 ? (
            <div>
              <div className="border rounded bg-white w-100 p-3 my-3 ">
                <h5 className="fw-bold m-0">{employees.user?.username}</h5>
                <p className="text-secondary">Admin</p>
              </div>
              <div className="scrol_card1">
                {employee?.map((e) => {
                  return (
                    <div
                      key={e.id}
                      className="border rounded bg-white w-100 p-3 mb-3 d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h5
                          className="fw-bold m-0"
                          onClick={() => dispatch(getData({ updId: e.id }))}
                        >
                          {e.fname} {e.lname}
                        </h5>
                        <p>
                          {e.username} /{" "}
                          <span className="text-secondary">kassir</span>
                        </p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center gap-1">
                        <p className="text-secondary">{status.status}</p>
                        <label className="switch">
                          <input type="checkbox" />
                          <span
                            className={
                              status.status == "active"
                                ? "trueslider"
                                : "falseslider"
                            }
                            onClick={() =>
                              block({ id: e.id, IsAvailable: e.IsAvailable })
                            }
                          ></span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // not found
            <div className="d-flex align-items-center justify-content-center fs-1 text-secondary w-100 h-100">
              <p>employee not fount</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
