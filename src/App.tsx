import { BrowserRouter, Route } from "react-router-dom";

import "./App.css";
import NotFoundRoute from "./components/routes/not-found.route";
import { PublicRoutes } from "./models";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <BrowserRouter>
      <NotFoundRoute>
        <Route path={PublicRoutes.HOME} element={<Home />} />
        <Route path={PublicRoutes.LOGIN} element={<Login />} />
        <Route path={PublicRoutes.REGISTER} element={<Register />} />
      </NotFoundRoute>
    </BrowserRouter>
  );
}

export default App;
