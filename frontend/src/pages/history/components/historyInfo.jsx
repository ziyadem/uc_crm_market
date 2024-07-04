import { useDispatch, useSelector } from "react-redux";
import { deleteData } from "../../../store/data";
import useGet from "../../../hooks/useGet";
import React from "react";

const HistoryInfo = () => {
  let dispatch = useDispatch();
  const { data } = useSelector((s) => s);
  let [sale, loading] = useGet(`/sale/one/${data.id}`, data);

  return (
    <div className="p-1">
      <div className="h-100 border border-secondary border-opacity-50 rounded-5 bg-secondary p-3 bg-opacity-25">
        {data?.id ? (
          <div>
            <div className="d-flex align-items-center justify-content-between bg-white p-3 border border-secondary border-opacity-50 rounded-2">
              <h4>{sale?.userName}</h4>
              <div
                className="border border-secondary border-opacity-50 rounded bg-secondary p-2 bg-opacity-25 d-flex align-items-center"
                onClick={() => dispatch(deleteData())}
              >
                <div>
                  <button
                    type="button"
                    className="btn-close text-center m-0"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            </div>
            {loading ? (
              // loader
              <div className="d-flex align-items-center justify-content-center h-100">
                <img src="/loading.gif" alt="loading" className="w-25" />
              </div>
            ) : (
              <div className="p-2 mt-3">
                <div className="d-flex justify-content-between align-items-center ">
                  <h6 className="m-0">Check id:</h6>
                  <p>{sale.id}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="m-0">Kompanya:</h6>
                  <p>{sale.company}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="m-0">Sotuvchi:</h6>
                  <p>{sale.kassir}</p>
                </div>
                <div className="borderY py-3">
                  {sale?.sale?.map((s) => {
                    return (
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="m-0">
                          {s.product.title} -x{s.count}
                        </h6>
                        <p>{s.product.price * s.count} uzs</p>
                      </div>
                    );
                  })}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="m-0">Naqd pul:</h6>
                  <p>{sale.priceCash} uzs</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="m-0">Plastik:</h6>
                  <p>{sale.pricePlastic} uzs</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="m-0">Jami:</h6>
                  <p>{sale.priceAll} uzs</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="m-0">Vaqti:</h6>
                  <p>{sale.createdAt}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-secondary">
            {" "}
            <h5>no sale available</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryInfo;


