import { BrowserRouter, Route } from "react-router-dom";

import "./App.css";
import { DefaultLayout } from "./components/layouts/default";
import { DatasetRoute, NotFoundRoute } from "./components/routes/";
import { BaseRoutes } from "./models";
import { About } from "./pages/about";
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
          <Route path={BaseRoutes.HOME} element={<Home />} />
          <Route path={BaseRoutes.LOGIN} element={<Login />} />
          <Route path={BaseRoutes.REGISTER} element={<Register />} />
          <Route path={`${BaseRoutes.DATASET}/*`} element={<DatasetRoute />} />
          <Route path={BaseRoutes.GROUPS} element={<Groups />} />
          <Route path={BaseRoutes.ORGANIZATIONS} element={<Organizations />} />
          <Route path={BaseRoutes.ABOUT} element={<About />} />
        </NotFoundRoute>
      </DefaultLayout>
    </BrowserRouter>
  );
}

export default App;
