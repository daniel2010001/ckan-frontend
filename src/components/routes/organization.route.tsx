import { Route } from "react-router-dom";

import { NotFoundRoute } from "@/components/routes";
import { OrganizationRoutes } from "@/models";
import { OrganizationDetailPage } from "@/pages/organization/pages/detail/page";
import { Organizations } from "@/pages/organization/page";

export function OrganizationRoute() {
  return (
    <NotFoundRoute>
      <Route index element={<Organizations />} />
      <Route path={OrganizationRoutes.DETAIL} element={<OrganizationDetailPage />} />
    </NotFoundRoute>
  );
}
