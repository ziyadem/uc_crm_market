import { Routes, Route } from "react-router-dom"
import { routes } from "./routes/routes"
import Private from "./routes/private"
import Login from './pages/login'
import Home from "./pages/home"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {routes?.map(({ status, path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <Private status={status}>
                <Component />
              </Private>
            }
          />
        ))}
      </Routes>
    </>
  );
}

export default App
