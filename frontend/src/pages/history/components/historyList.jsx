import useDelete from "../../../hooks/useDelete";
import usePatch from "../../../hooks/usePatch";
import { getData } from "../../../store/data";
import Back from "../../../components/back";
import useGet from "../../../hooks/useGet";
import { useDispatch } from "react-redux";
import { useState } from "react";

const HistoryList = () => {
  let dispatch = useDispatch();
  let [reload, setReload] = useState(true);
  let [date, setDate] = useState(new Date().getDate());
  let [sales, loading] = useGet(`/sale`, reload);
  let status_name = localStorage.getItem("status_name");

  console.log(date, "date");

  async function deleteSale(e) {
    let a = await useDelete(`/sale/${e}`);
    setReload(!reload);
  }

  async function returnSale(e) {
    await usePatch(`/sale/${e}`);
    setReload(!reload);
  }

  return (
    <div className="p-1">
      <div className="border border-secondary border-opacity-50 rounded-5 bg-secondary p-2 bg-opacity-25 h-100">
        <Back />
        {loading ? (
          // loader
          <div className="d-flex align-items-center justify-content-center h-100">
            <img src="/loading.gif" alt="loading" className="w-25" />
          </div>
        ) : sales.length !== 0 ? (
          <div>
            <div className="d-flex align-items-center justify-content-end px-3">
              <input
                type="date"
                onChange={(e) => {
                  setDate(+e.target.value.split("-")[2]);
                }}
                className="py-2 px-4 form-control"
                style={{ width: "230px" }}
              />
            </div>
            <div className="scrol_card">
              {sales
                ?.filter((s) => new Date(s?.createdAt).getDate() === date)
                ?.map((s, idx) => {
                  return (
                    <div className=" p-2" key={s.id}>
                      <div className="border border-secondary border-opacity-50 rounded bg-white w-100 p-3 mb-1 d-flex justify-content-between align-items-center">
                        <div
                          onClick={() =>
                            dispatch(
                              getData({
                                id: s.id,
                                nomer: idx + 1,
                                price: s.price,
                                payment: s.payment,
                              })
                            )
                          }
                        >
                          <div className="d-flex gap-1">
                            <h5 className="fw-bold m-0">N:</h5>
                            <h5>{idx + 1}</h5>
                            <p className="text-secondary m-0">
                              {(Number(
                                s.createdAt.split("T")[1].split(":")[0]
                              ) +
                                5) %
                                24 ==
                              0
                                ? "00"
                                : (Number(
                                    s.createdAt.split("T")[1].split(":")[0]
                                  ) +
                                    5) %
                                  24}
                              :{s.createdAt.split(":")[1]}
                            </p>
                          </div>
                          {s.deletedAt ? (
                            <p className="text-danger">returned</p>
                          ) : null}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h5 className="fw-bold m-0">{s.priceAll} so'm</h5>
                            <p className="text-secondary text-end">
                              {s.payment}
                            </p>
                          </div>
                          {status_name == "admin" ? (
                            <button
                              className="btn btn-secondary"
                              onClick={() => deleteSale(s.id)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary"
                              onClick={() => returnSale(s.id)}
                            >
                              <i className="fa fa-refresh"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          // not found
          <div className="d-flex align-items-center justify-content-center fs-1 text-secondary w-100 h-75">
            <p>sales not fount</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryList;
