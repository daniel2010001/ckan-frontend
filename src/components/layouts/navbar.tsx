import {
  NavigationMenu,
  // NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const components: { title: string; to: string }[] = [
  { title: "DATOS", to: "/dataset" },
  { title: "ORGANIZACIONES", to: "/organizations" },
  { title: "GRUPOS", to: "/groups" },
  { title: "NOSOTROS", to: "/about" },
];

export function Navbar() {
  return (
    <NavigationMenu className="flex h-16 w-full">
      <NavigationMenuList className="flex flex-1 items-center justify-between">
        {components.map((option) => (
          <NavigationMenuItem key={option.title} className="font-semibold">
            <Link to={option.to}>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                {option.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
