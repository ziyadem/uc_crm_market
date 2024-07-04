import CardHeader from "../../components/card/admincard"
import EmployeeList from "./components/employeeList"
import EmployeeInfo from "./components/employeeInfo"
import Admins from "./components/admins"


const Employee = () => {
  let status_name=localStorage.getItem("status_name")
  return (
    <>
      {status_name === "super admin" ? (
        <section className="p-3 page ">
            <CardHeader />
            <Admins/>
        </section>
      ) : (
        <section className="px-3 page">
          <div className="row row-cols-2 h-100 p-3">
            <EmployeeList />
            <EmployeeInfo />
          </div>
        </section>
      )}
    </>
  );
};

export default Employee
