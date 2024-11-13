import { Navigate, Route, Routes } from "react-router-dom";

import { NotFound } from "@/pages/not-found";
import { PublicRoutes } from "@/models";

interface NotFoundRouteProps {
  children: React.ReactNode;
}

export function NotFoundRoute({ children }: NotFoundRouteProps) {
  return (
    <Routes>
      {children}
      <Route path="*" element={<Navigate to={PublicRoutes.NOT_FOUND} replace />} />
      <Route path={PublicRoutes.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}
