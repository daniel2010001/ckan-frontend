import * as React from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  // NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
  // navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const components: { title: string; href: string }[] = [
  { title: "DATOS", href: "/datasets" },
  { title: "ORGANIZACIONES", href: "/organizations" },
  { title: "GRUPOS", href: "/groups" },
  { title: "NOSOTROS", href: "/about" },
];

function Navbar() {
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          {components.map((option) => (
            <NavigationMenuItem key={option.title}>
              <Link to={option.href}>
                <NavigationMenuLink>{option.title}</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default Navbar;
