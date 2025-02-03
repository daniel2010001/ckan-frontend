import { BrowserRouter, Route } from "react-router-dom";

import "./App.css";
import { DefaultLayout } from "./components/layouts/default";
import { DatasetRoute } from "./components/routes/dataset.route";
import { GroupRoute } from "./components/routes/group.route";
import { NotFoundRoute } from "./components/routes/not-found.route";
import { OrganizationRoute } from "./components/routes/organization.route";
import { BaseRoutes } from "./models";
import { About } from "./pages/about";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register/";

function App() {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <NotFoundRoute>
          <Route path={BaseRoutes.HOME} element={<Home />} />
          <Route path={BaseRoutes.LOGIN} element={<Login />} />
          <Route path={BaseRoutes.REGISTER} element={<Register />} />
          <Route path={BaseRoutes.ABOUT} element={<About />} />
          {/* Módulos */}
          <Route path={`${BaseRoutes.DATASET}/*`} element={<DatasetRoute />} />
          <Route path={`${BaseRoutes.GROUPS}/*`} element={<GroupRoute />} />
          <Route path={`${BaseRoutes.ORGANIZATION}/*`} element={<OrganizationRoute />} />
        </NotFoundRoute>
      </DefaultLayout>
    </BrowserRouter>
  );
}

export default App;
