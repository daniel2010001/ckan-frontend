import { BrowserRouter, Route } from "react-router-dom";

import "./App.css";
import { DefaultLayout } from "./components/layouts/default";
import { NotFoundRoute } from "./components/routes/";
import { PublicRoutes } from "./models";
import { About } from "./pages/about";
import { Dataset } from "./pages/dataset";
import { Groups } from "./pages/groups";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Organizations } from "./pages/organizations";
import { Register } from "./pages/register/";

function App() {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <NotFoundRoute>
          <Route path={PublicRoutes.HOME} element={<Home />} />
          <Route path={PublicRoutes.LOGIN} element={<Login />} />
          <Route path={PublicRoutes.REGISTER} element={<Register />} />
          <Route path={PublicRoutes.DATASET} element={<Dataset />} />
          <Route path={PublicRoutes.GROUPS} element={<Groups />} />
          <Route path={PublicRoutes.ORGANIZATIONS} element={<Organizations />} />
          <Route path={PublicRoutes.ABOUT} element={<About />} />
        </NotFoundRoute>
      </DefaultLayout>
    </BrowserRouter>
  );
}

export default App;
