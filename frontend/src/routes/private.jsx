import { Navigate } from "react-router-dom"

const Private=({children,status})=>{
    const token = localStorage.getItem("ac");
    let statusName = localStorage.getItem("status_name");
    let res=false
    if (token && status?.includes(statusName)) {
      res = true;
    }
    if(!res){
      return <Navigate to="/login" replace />;
    }
    return(
      <>
        {children}
      </>
    )
}

export default Private