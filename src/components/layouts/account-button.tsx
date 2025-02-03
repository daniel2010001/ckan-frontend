import { Building2, Database, LogOut, Users } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore, useUserStore } from "@/hooks";
import { BaseRoutes, DatasetRoutes, GroupRoutes, OrganizationRoutes } from "@/models";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

type AccountLinkItem = {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  href?: string;
};

type AccountDropdownItem = {
  icon: React.ReactNode;
  label: string;
  items: Array<Array<Omit<AccountLinkItem, "icon">>>;
};

const accountItems: Array<Array<AccountLinkItem | AccountDropdownItem>> = [
  [
    { label: "Datos", icon: <Database />, shortcut: "⇧⌘D", href: DatasetRoutes.BASE() },
    {
      label: "Grupos",
      icon: <Users />,
      items: [
        [
          { label: "Grupos", href: GroupRoutes.BASE() },
          { label: "Crear grupo", href: GroupRoutes.CREATE },
        ],
      ],
    },
    {
      label: "Organizaciones",
      icon: <Building2 />,
      items: [
        [
          { label: "Organizaciones", href: OrganizationRoutes.BASE() },
          { label: "Crear organización", href: OrganizationRoutes.CREATE },
        ],
      ],
    },
  ],
  // [
  //   { icon: <User />, label: "Profile", shortcut: "⇧⌘P" },
  //   { icon: <CreditCard />, label: "Billing", shortcut: "⌘B" },
  //   { icon: <Settings />, label: "Settings", shortcut: "⌘S" },
  //   { icon: <Keyboard />, label: "Keyboard shortcuts", shortcut: "⌘K" },
  // ],
  // [
  //   { icon: <Users />, label: "Team" },
  //   {
  //     icon: <UserPlus />,
  //     label: "Invite users",
  //     items: [
  //       [
  //         { icon: <Mail />, label: "Email" },
  //         { icon: <MessageSquare />, label: "Message" },
  //       ],
  //       [{ icon: <PlusCircle />, label: "More..." }],
  //     ],
  //   },
  //   { icon: <Plus />, label: "New Team", shortcut: "⌘+T" },
  // ],
  // [
  //   { icon: <Github />, label: "GitHub" },
  //   { icon: <LifeBuoy />, label: "Support" },
  //   { icon: <Cloud />, label: "API" },
  // ],
];

export function AccountButton() {
  const { logout, reset } = useAuthStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const onLogout = async () =>
    await logout()
      .then((bool) => !bool && reset())
      .finally(() => navigate(BaseRoutes.HOME, { replace: true, relative: "route" }));

  function avatarFallback(str: string): string {
    const palabras = str.split(" ");
    const primeraInicial = palabras[0]?.charAt(0) || "";
    const segundaInicial = palabras[1]?.charAt(0) || "";
    return primeraInicial + segundaInicial;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="flex h-11 w-11 items-center justify-center rounded-full overflow-hidden p-0"
      >
        <Avatar className="bg-custom-primary-4/10">
          {user.imageDisplayUrl && (
            <AvatarImage src={user.imageDisplayUrl} alt={user.displayName} />
          )}
          <AvatarFallback className="select-none">
            {avatarFallback(user.displayName ?? "")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accountItems.map((itemLv1, indexLv1) => (
          <Fragment key={`group-${indexLv1}`}>
            <DropdownMenuGroup>
              {itemLv1.map((itemLv2, indexLv2) =>
                "items" in itemLv2 ? (
                  <DropdownMenuSub key={`dropdown-${indexLv2}`}>
                    <DropdownMenuSubTrigger>
                      {itemLv2.icon}
                      <span>{itemLv2.label}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {itemLv2.items.map((itemLv3, indexLv3) => (
                          <Fragment key={`dropdown-${indexLv2}-group-${indexLv3}`}>
                            {itemLv3.map((itemLv4, indexLv4) => (
                              <DropdownMenuItem key={`dropdown-${indexLv2}-item-${indexLv4}`}>
                                <span>{itemLv4.label}</span>
                              </DropdownMenuItem>
                            ))}
                            {itemLv2.items.length - 1 > indexLv3 && <DropdownMenuSeparator />}
                          </Fragment>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ) : (
                  <DropdownMenuItem key={`item-${indexLv2}`}>
                    {itemLv2.icon}
                    <span>{itemLv2.label}</span>
                    {itemLv2.shortcut && (
                      <DropdownMenuShortcut>{itemLv2.shortcut}</DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </Fragment>
        ))}
        <DropdownMenuItem onClick={onLogout} key="logout">
          <LogOut />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
