import useGet from "../../../hooks/useGet";
import * as XLSX from "xlsx/xlsx.mjs";
import { saveAs } from "file-saver";

const StatistikaList = () => {
  let [statistika, loading] = useGet(`statistiks`);

  console.log(statistika, "statistika");

  const printToExcel = () => {
    if (statistika?.product?.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(statistika?.product);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const fileName = "data.xlsx";

      saveAs(new Blob([wbout]), fileName);
    }
  };

  return (
    <>
      {loading ? (
        // loader
        <div className="d-flex align-items-center justify-content-center h-100">
          <img src="/loading.gif" alt="loading" className="w-25" />
        </div>
      ) : (
        // statistika list
        <div>
          <div className="px-4 pt-3">
            <div className="border border-secondary border-opacity-50 bg-white rounded p-3 row row-cols-4">
              <div>
                <h6 className="text-center m-0 fw-bold">Cash</h6>
                <p className="text-center ">{statistika.cash}so'm</p>
              </div>
              <div>
                <h6 className="text-center m-0 fw-bold">Plactik</h6>
                <p className="text-center">{statistika.plastic}so'm</p>
              </div>
              <div>
                <h6 className="text-center m-0 fw-bold">Returns</h6>
                <p className="text-center">{statistika.returns}so'm</p>
              </div>
              <div>
                <h6 className="text-center m-0 fw-bold">price all</h6>
                <p className="text-center">
                  {statistika.cash + statistika.plastic} so'm
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end pe-4 pt-3">
            <i
              className="fa fa fa-download text-success fs-4"
              onClick={printToExcel}
            ></i>
          </div>
          <div className="p-3 scrol_card2">
            <div className="table-responsive-xl ">
              <table className="table table-striped table-hover text-center">
                <thead>
                  <tr>
                    <th>
                      <h6 className="m-0 fw-bold">Product Title</h6>
                    </th>
                    <th>
                      <h6 className="m-0 fw-bold">Product Price</h6>
                    </th>
                    <th>
                      <h6 className="m-0 fw-bold">Sold Count</h6>
                    </th>
                    <th>
                      <h6 className="m-0 fw-bold">Return Count</h6>
                    </th>
                    <th>
                      <h6 className="m-0 fw-bold">Return Count</h6>
                    </th>
                    <th>
                      <h6 className="m-0 fw-bold">Return Price</h6>
                    </th>
                    <th>
                      <h6 className="m-0 fw-bold">Total Price</h6>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {statistika?.product?.map((p, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <h6 className="m-0 fw-semibold">
                            {p["Product Title"]}
                          </h6>
                        </td>
                        <td>
                          <h6 className="m-0 fw-semibold">
                            {p["Product Price"]}
                          </h6>
                        </td>
                        <td>
                          <h6 className="m-0 fw-semibold">{p["Sold Count"]}</h6>
                        </td>
                        <td>
                          <h6 className="m-0 fw-semibold">
                            {p["Return Count"]}
                          </h6>
                        </td>
                        <td>
                          <h6 className="m-0 fw-semibold">{p["Sold Price"]}</h6>
                        </td>
                        <td>
                          <h6 className="m-0 fw-semibold">
                            {p["Return Price"]}
                          </h6>
                        </td>
                        <td>
                          <h6 className="m-0 fw-semibold text-center">
                            {p["Total Price"]}
                          </h6>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatistikaList;
