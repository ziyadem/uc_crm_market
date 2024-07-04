import { toast } from "react-toastify"
import izzo from "../../axios";

const Login = () => {
  async function handleSubmit(e) {
    e.preventDefault()
    let obj = {
      username: e.target.username.value,
      password: e.target.password.value,
    }
    try {
      let { data } = await izzo.post("/auth/login", obj);
      localStorage.setItem("ac", data.accessToken);
      localStorage.setItem("re", data.refreshToken);
      localStorage.setItem("status_name", data.role);
      toast("logged", {
        type: "success",
      })
      if(data.role==='super admin'){
        window.location.replace("/company");
      }else{
        window.location.replace("/categories");
      }
    } catch (error) {
      if(error.response.status==400){
           toast("error", {
             type: "error",
           })
      }
      toast(error.response.data.message, {
        type: "error",
      });
    }
  }
  return (
    <>
      <section className="d-flex w-100  justify-content-center align-items-center login row">
        <div className="col-10 col-sm-8 col-lg-6 border rounded-5 bg-secondary p-4 bg-opacity-25 ">
          <h1 className="text-center fs-1 fw-bold text-success">LogIn</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              id="username"
              type="text"
              className="form-control mt-4"
              placeholder="username"
              required
              minLength={3}
            />
            <input
              id="password"
              type="password"
              className="form-control mt-4"
              placeholder="Password"
              required
              minLength={6}
            />
            <button
              className="btn btn-success w-100text-light w-100 mt-4"
              type="submit"
            >
              submit
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
