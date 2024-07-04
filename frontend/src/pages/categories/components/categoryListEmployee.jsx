import { useNavigate } from "react-router-dom"
import useGet from "../../../hooks/useGet"
import color from "../../../static"

const CategoryListEmployee = () => {
  let navigate = useNavigate()
  let [category, loading] = useGet(`category`)

  return (
    <>
      {loading ? (
        // loader
        <div className="d-flex align-items-center justify-content-center h-100">
          <img src="/loading.gif" alt="loading" className="w-25" />
        </div>
      ) : // categgory list
      category.length !== 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 p-3 scrol_card">
          {category?.map((c, idx) => {
            return (
              <div key={c.id} className="p-1">
                <div
                  className={`${
                    color[idx % 6]
                  } border border-secondary border-opacity-50 rounded p-3 text-white pb-5`}
                >
                  <div className="mb-5">
                    <h3 onClick={() => navigate(`/products/${c.id}`)}>
                      {c.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // not found
        <div className="d-flex align-items-center justify-content-center fs-1 text-secondary w-100 h-75">
          <p>category not fount</p>
        </div>
      )}
    </>
  );
};

export default CategoryListEmployee
