import { Route } from "react-router-dom";

import { NotFoundRoute } from "@/components/routes";
import { DatasetRoutes } from "@/models";
import { Dataset } from "@/pages/dataset";
import { Category } from "@/pages/dataset/pages/category";
import { Detail } from "@/pages/dataset/pages/detail";
import { Register } from "@/pages/dataset/pages/register";
import { Resource } from "@/pages/dataset/pages/resource";
import { Tag } from "@/pages/dataset/pages/tag";

export function DatasetRoute() {
  return (
    <NotFoundRoute>
      <Route index element={<Dataset />} />
      <Route path={DatasetRoutes.CATEGORY} element={<Category />} />
      <Route path={DatasetRoutes.DETAIL} element={<Detail />} />
      <Route path={DatasetRoutes.TAG} element={<Tag />} />
      <Route path={DatasetRoutes.REGISTER} element={<Register />} />
      <Route path={DatasetRoutes.RESOURCE} element={<Resource />} />
    </NotFoundRoute>
  );
}
