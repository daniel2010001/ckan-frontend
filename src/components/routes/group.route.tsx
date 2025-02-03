import { Route } from "react-router-dom";

import { NotFoundRoute } from "@/components/routes";
import { GroupRoutes } from "@/models";
import { GroupDetail } from "@/pages/group/pages/detail/page";
import { Groups } from "@/pages/group/page";

export function GroupRoute() {
  return (
    <NotFoundRoute>
      <Route index element={<Groups />} />
      <Route path={GroupRoutes.DETAIL} element={<GroupDetail />} />
    </NotFoundRoute>
  );
}
