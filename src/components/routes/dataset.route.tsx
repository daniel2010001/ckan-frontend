import { Route } from "react-router-dom";

import { NotFoundRoute } from "@/components/routes";
import { DatasetRoutes } from "@/models";
import { Datasets } from "@/pages/dataset";
import { Category } from "@/pages/dataset/pages/category";
import { Detail } from "@/pages/dataset/pages/detail";
import { Register } from "@/pages/dataset/pages/register";
import { Tag } from "@/pages/dataset/pages/tag";
import { ResourcePage } from "@/pages/dataset/pages/resource";
import Dictionary from "@/pages/dataset/pages/resource/dictionary/page";
import NewChart from "@/pages/dataset/pages/resource/new-chart/page";
import NewView from "@/pages/dataset/pages/resource/new-view/page";

export function DatasetRoute() {
  return (
    <NotFoundRoute>
      <Route index element={<Datasets />} />
      <Route path={DatasetRoutes.REGISTER} element={<Register />} />
      <Route path={DatasetRoutes.CATEGORY} element={<Category />} />
      <Route path={DatasetRoutes.TAG} element={<Tag />} />
      <Route path={DatasetRoutes.MY_DATASETS} element={<div>My Datasets</div>} />

      <Route path={DatasetRoutes.DETAIL}>
        <Route index element={<Detail />} />
        <Route path={DatasetRoutes.EDIT} element={<div>Edit</div>} />
        <Route path={DatasetRoutes.MANAGE} element={<div>Manage</div>} />
        <Route path={DatasetRoutes.RESOURCE}>
          <Route index element={<ResourcePage />} />
          <Route path={DatasetRoutes.DICTIONARY} element={<Dictionary />} />
          <Route path={DatasetRoutes.NEW_VIEW} element={<NewView />} />
          <Route path={DatasetRoutes.NEW_CHART} element={<NewChart />} />
        </Route>
      </Route>
    </NotFoundRoute>
  );
}
