import ProductList from "./components/productListAdmin";
import Desktop from "../../components/desctop";
import Header from "../../components/header";
import HeroCard from "./components/heroCard";
import Back from "../../components/back";
import ProductListEmployee from "./components/productListEmployee";

const Products = () => {
  let status_name = localStorage.getItem("status_name");

  return (
    <>
      {status_name === "admin" ? (
        <section className="p-3 page">
          <div className="border border-secondary border-opacity-50  rounded-5 bg-secondary bg-opacity-25 p-3 h-100">
            <Header />
            <HeroCard />
            <ProductList />
          </div>
        </section>
      ) : status_name === "kassir" ? (
        <section className="p-4 page row ">
          <div className="col-8 border border-secondary border-opacity-50  rounded-5 bg-secondary bg-opacity-25 p-2 h-100">
            <Back />
            <ProductListEmployee />
          </div>
          <div className="col-4">
            <Desktop />
          </div>
        </section>
      ) : (
        <h1>Adashding</h1>
      )}
    </>
  );
};

export default Products;
