import { Navigate, Route, Routes } from "react-router-dom";

import { NotFound } from "@/pages/not-found";
import { BaseRoutes } from "@/models";

interface NotFoundRouteProps {
  children: React.ReactNode;
}

export function NotFoundRoute({ children }: NotFoundRouteProps) {
  return (
    <Routes>
      {children}
      <Route path="*" element={<Navigate to={BaseRoutes.NOT_FOUND} replace />} />
      <Route path={BaseRoutes.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}
