import { decrement, deleteAllOrder, deleteOrder, increment } from "../../store/order"
import { useDispatch, useSelector } from "react-redux"
import logOut from "../../functions/log-out"
import { useEffect, useState } from "react"
import usePost from "../../hooks/usePost"
import useGet from "../../hooks/useGet"
import { toast } from "react-toastify"


const formatNum = (num) => {
  return new Intl.NumberFormat("jA-JP").format(+num);
};

const Desktop = () => {
  let [values, setValues] = useState({ karta: "", cash: "" });
  let [payment, setPayment] = useState("");
  let [dis, setDisablet] = useState(true);
  let { order } = useSelector((s) => s);
  let [user] = useGet("employee");
  let dispatch = useDispatch();

  // all price
  let summ = 0;
  let sales = [];
  order?.forEach((o) => {
    sales.push({ count: o.count, product_id: o.id });
    summ += o.price * o.count;
  })

  // disablet button
  useEffect(()=>{
    if (summ !== 0) {
      if(summ === Number(values.cash)+ Number(values.karta)){
        setDisablet(false)
      }
      if(summ < Number(values.cash)+ Number(values.karta)){
        setDisablet(true)
        toast("tolov summasi oshib ketdi")
      }
      if(summ > Number(values.cash)+ Number(values.karta)){
        setDisablet(true)
      }
    }
  },[values])

  // handle click
  function handleClik(a) {
     if (sales.length < 1) {
       setValues({ karta: "", cash: "" });
       return toast("orders not found", { type: "error" });
     }
    if (payment === "Plastic") {
      console.log(123);
      setValues({ ...values, karta: values.karta + a });
    }
    if (payment === "Cash") {
      setValues({ ...values, cash: values.cash + a });
    }
  }

  // handle remove
  function handleRemove() {
    if (payment === "Plastic") {
      setValues({
        ...values,
        karta: values.karta.slice(0, values.karta.length - 1),
      });
    }
    if (payment === "Cash") {
      setValues({
        ...values,
        cash: values.cash.slice(0, values.cash.length - 1),
      });
    }
  }

  // create sale
  async function handleSubmit() {
    if (sales.length < 1) {
      setValues({ karta: "", cash: "" });
      return toast("orders not found", { type: "error" });
    }
    let paymentName = "";
    if (values.karta && values.cash) {
      paymentName = "Plastic/Cash";
    } else if (values.karta && !values.cash) {
      paymentName = "Plastic";
    } else {
      paymentName = "Cash";
    }
    let data = {
      priceAll: summ,
      priceCash: +values.cash,
      pricePlastic: +values.karta,
      payment: paymentName,
      sales,
    };
    console.log(data);
    await usePost(`sale`, data);
    dispatch(deleteAllOrder());
    setValues({ karta: "", cash: "" });
  }

  return (
    <div className=" h-100 p-3 border border-secondary border-opacity-50  rounded-5 bg-secondary bg-opacity-25 d-flex flex-column justify-content-between">
      {/* orders */}
      <div>
        <div className="border border-secondary border-opacity-50 rounded bg-white w-100 p-3 mb-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold m-0">{user.username}</h5>
          <div
            className="p-2 border rounded bg-danger border-opacity-25 text-white"
            onClick={() => logOut()}
          >
            <i className="fa fa-sign-out fs-1  "></i>
          </div>
        </div>
        {order?.map((o) => {
          return (
            <div className="border border-secondary border-opacity-50 rounded bg-white w-100 p-3 mb-3 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold m-0">{o.title}</h5>
                <p>
                  {o.count} ta{" "}
                  <span className="text-secondary">
                    {o.price * o.count} so'm
                  </span>
                </p>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <button
                  className="btn btn-secondary"
                  disabled={o.count < 2}
                  onClick={() => dispatch(decrement({ id: o.id }))}
                >
                  -
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => dispatch(increment({ id: o.id }))}
                >
                  +
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => dispatch(deleteOrder({ id: o.id }))}
                >
                  <i className="fa fa-trash "></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* summ btn */}
      <button
        className="btn btn-success p-3 d-flex justify-content-between "
        data-bs-toggle="modal"
        data-bs-target="#exampleModalPayment"
      >
        <h5 className="fw-bold m-0">To'lov</h5>
        <h5 className="m-0">{summ} so'm</h5>
      </button>

      {/* (sale create modal) kalkulator */}
      <div
        className="modal fade"
        id="exampleModalPayment"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Karzinka <span className="text-success">{summ} so'm</span>
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div
                  className="d-flex gap-2 align-items-center"
                  onClick={() => setPayment("Plastic")}
                >
                  <i className="fa fa-credit-card"></i>
                  <p className="text-secondary">KARTA</p>
                </div>
                <input
                  type="text"
                  placeholder="0"
                  value={formatNum(values.karta)}
                  className="form-control w-75 p-3"
                  required
                  onClick={() => setPayment("Plastic")}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div
                  className="d-flex gap-2 align-items-center"
                  onClick={() => setPayment("Cash")}
                >
                  <i className="fa fa-credit-card"></i>
                  <p className="text-secondary">Cash</p>
                </div>
                <input
                  type="text"
                  placeholder="0"
                  value={formatNum(values.cash)}
                  className="form-control w-75 p-3"
                  required
                  onClick={() => setPayment("Cash")}
                />
              </div>
              <form className="px-3">
                <div className="row row-cols-3">
                  <button
                    className="btn border pt-4 "
                    type="button"
                    onClick={() => handleClik("1")}
                  >
                    <h6>1</h6>
                  </button>
                  <button
                    className="btn border py-4"
                    type="button"
                    onClick={() => handleClik("2")}
                  >
                    <h6>2</h6>
                  </button>
                  <button
                    className="btn border py-4"
                    type="button"
                    onClick={() => handleClik("3")}
                  >
                    <h6>3</h6>
                  </button>
                </div>
                <div className="row row-cols-3">
                  <button
                    className="btn border py-4 "
                    type="button"
                    onClick={() => handleClik("4")}
                  >
                    <h6>4</h6>
                  </button>
                  <button
                    className="btn border py-4"
                    type="button"
                    onClick={() => handleClik("5")}
                  >
                    <h6>5</h6>
                  </button>
                  <button
                    className="btn border py-4"
                    type="button"
                    onClick={() => handleClik("6")}
                  >
                    <h6>6</h6>
                  </button>
                </div>
                <div className="row row-cols-3">
                  <button
                    className="btn border py-4"
                    type="button"
                    onClick={() => handleClik("7")}
                  >
                    <h6>7</h6>
                  </button>
                  <button
                    className="btn border py-4"
                    type="button"
                    onClick={() => handleClik("8")}
                  >
                    <h6>8</h6>
                  </button>
                  <button
                    className="btn border py-4"
                    type="button"
                    onClick={() => handleClik("9")}
                  >
                    <h6>9</h6>
                  </button>
                </div>
                <div className="row row-cols-3">
                  <button
                    className="btn border py-4"
                    type="button"
                    onClick={() => handleClik("00")}
                  >
                    <h6>00</h6>
                  </button>
                  <button
                    className="btn border py-4"
                    type="button"
                    onClick={() => handleClik("0")}
                  >
                    <h6>0</h6>
                  </button>
                  <button
                    className="btn border py-4"
                    type="button"
                    onClick={() => handleRemove()}
                  >
                    <i className="fa fa-times text-danger"></i>
                  </button>
                  <button
                    type="button"
                    disabled={dis}
                    onClick={() => handleSubmit()}
                    className="btn btn-success w-100 mt-3 p-3"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Desktop
