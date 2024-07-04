import Statistika from "../pages/statistika"
import Categories from "../pages/categories"
import Employee from "../pages/employee"
import Products from "../pages/products"
import History from "../pages/history"
import Companys from "../pages/company"

export const routes = [
  {
    path: "/company",
    Component: Companys,
    status: ["super admin"],
  },
  {
    path: "/categories",
    Component: Categories,
    status: ["admin", "kassir"],
  },
  {
    path: "/products/:category_id",
    Component: Products,
    status: ["admin", "kassir"],
  },
  {
    path: "/employee",
    Component: Employee,
    status: ["admin", "super admin"],
  },
  {
    path: "/history",
    Component: History,
    status: ["admin", "kassir"],
  },
  {
    path: "/statistika",
    Component: Statistika,
    status: ["admin", "kassir"],
  },
];
