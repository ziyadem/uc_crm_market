import { orders } from "../../../store/order"
import { useParams } from "react-router-dom"
import useGet from "../../../hooks/useGet"
import { useDispatch } from "react-redux"

const ProductListEmployee = () => {
  let dispatch=useDispatch()
  let { category_id } = useParams()
  let [products, loading] = useGet(`product/all/${category_id}`)

  return (
    <>
      {loading ? (
        // loader
        <div className="d-flex align-items-center justify-content-center h-100">
          <img src="/loading.gif" alt="loading" className="w-25" />
        </div>
      ) : products.length !== 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 p-3 scrol_card">
          {products?.map((p) => {
            return (
              <div
                className="p-1"
                key={p.id}
                onClick={() =>
                  dispatch(orders({ id: p.id, title: p.title, price: p.price }))
                }
              >
                <div className="border border-secondary border-opacity-50 rounded bg-white p-2">
                  <h4 className="mb-5">{p.title}</h4>
                  <h5 className="text-success">
                    {p.price} <span className="text-secondary">so'm</span>
                  </h5>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-center fs-1 text-secondary h-75">
          <p>product not fount</p>
        </div>
      )}
    </>
  );
};

export default ProductListEmployee;
