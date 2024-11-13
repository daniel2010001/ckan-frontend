import { Link } from "react-router-dom";

import { PublicRoutes } from "@/models";
import { DropdownMenuDemo, Navbar } from ".";

import logo from "@/assets/logo.png";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-col flex-1 h-full">
          <div className="flex h-16 w-full justify-between items-center px-8 bg-custom-primary-1">
            <Link to={PublicRoutes.HOME}>
              <img src={logo} alt="logo" className="h-16 w-auto" />
            </Link>
            <Navbar />
            <DropdownMenuDemo />
          </div>
          <main className="flex flex-col items-center h-full w-full bg-custom-primary-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
