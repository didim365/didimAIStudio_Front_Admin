"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { tokenStorage } from "@/shared/utils/tokenStorage";
import MENU from "@/shared/constants/menu";
import useGetMyInfo from "../hooks/useGetMyInfo";
import { cn } from "@/shared/lib/utils";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/ui/sidebar";

type MenuChildItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuChildItem[];
};

type MenuItemProps = {
  item: MenuChildItem;
  pathname: string;
  expandedMenus: string[];
  onToggleMenu: (menuKey: string) => void;
  menuKey: string;
};

function checkIfActive(
  menuItem: MenuChildItem,
  currentPathname: string,
  currentMenuKey: string,
  currentExpandedMenus: string[]
): boolean {
  if (menuItem.children && menuItem.children.length > 0) {
    return menuItem.children.some((child) => {
      const childKey = `${currentMenuKey}|${child.name}`;
      return checkIfActive(
        child,
        currentPathname,
        childKey,
        currentExpandedMenus
      );
    });
  }
  return (
    currentPathname === menuItem.href ||
    currentPathname.startsWith(menuItem.href + "/")
  );
}

function MenuSubItemComponent({
  item,
  pathname,
  expandedMenus,
  onToggleMenu,
  menuKey,
}: MenuItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedMenus.includes(menuKey);

  const isChildActive = hasChildren
    ? item.children?.some((child) => {
        const childMenuKey = `${menuKey}|${child.name}`;
        return checkIfActive(child, pathname, childMenuKey, expandedMenus);
      })
    : false;

  const isActive =
    !hasChildren &&
    (pathname === item.href || pathname.startsWith(item.href + "/"));

  if (hasChildren) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuButton
          onClick={() => onToggleMenu(menuKey)}
          isActive={isActive || isChildActive}
          size="sm"
        >
          <item.icon />
          <span>{item.name}</span>
          <ChevronRight
            className={cn(
              "ml-auto h-4 w-4 transition-transform duration-300",
              isExpanded && "rotate-90"
            )}
          />
        </SidebarMenuButton>
        {isExpanded && (
          <SidebarMenuSub>
            {item.children?.map((child) => {
              const childMenuKey = `${menuKey}|${child.name}`;
              return (
                <MenuSubItemComponent
                  key={child.name}
                  item={child}
                  pathname={pathname}
                  expandedMenus={expandedMenus}
                  onToggleMenu={onToggleMenu}
                  menuKey={childMenuKey}
                />
              );
            })}
          </SidebarMenuSub>
        )}
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <Link href={item.href}>
          <item.icon />
          <span>{item.name}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const { data: myInfo } = useGetMyInfo();

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const handleLogout = async () => {
    await tokenStorage.clearTokens();
    router.push("/");
  };

  const checkIfAnyChildActive = (item: (typeof MENU)[0]): boolean => {
    if (!item.children || item.children.length === 0) {
      return false;
    }
    return item.children.some((child) => {
      const childMenuKey = `${item.name}|${child.name}`;
      return checkIfChildActive(child, pathname, childMenuKey, expandedMenus);
    });
  };

  const checkIfChildActive = (
    menuItem: MenuChildItem,
    currentPathname: string,
    currentMenuKey: string,
    currentExpandedMenus: string[]
  ): boolean => {
    if (menuItem.children && menuItem.children.length > 0) {
      return menuItem.children.some((child) => {
        const childKey = `${currentMenuKey}|${child.name}`;
        return checkIfChildActive(
          child,
          currentPathname,
          childKey,
          currentExpandedMenus
        );
      });
    }
    return (
      currentPathname === menuItem.href ||
      currentPathname.startsWith(menuItem.href + "/")
    );
  };

  return (
    <UISidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            관
          </div>
          <div>
            <p className="text-sm font-semibold">
              {myInfo?.full_name ?? "관리자"}님
            </p>
            <p className="text-xs text-muted-foreground">{myInfo?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {MENU.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const menuKey = item.name;
                const isExpanded = expandedMenus.includes(menuKey);
                const isChildActive = checkIfAnyChildActive(item);
                const isActive =
                  !hasChildren &&
                  item.href !== undefined &&
                  (pathname === item.href ||
                    pathname.startsWith(item.href + "/"));

                return (
                  <SidebarMenuItem key={item.name}>
                    {hasChildren ? (
                      <>
                        <SidebarMenuButton
                          onClick={() => toggleMenu(menuKey)}
                          isActive={isActive || isChildActive}
                          tooltip={item.name}
                        >
                          {"icon" in item && item.icon && <item.icon />}
                          <span>{item.name}</span>
                          <ChevronRight
                            className={cn(
                              "ml-auto h-4 w-4 transition-transform duration-300",
                              isExpanded && "rotate-90"
                            )}
                          />
                        </SidebarMenuButton>
                        {isExpanded && (
                          <SidebarMenuSub>
                            {item.children?.map((child) => {
                              const childMenuKey = `${menuKey}|${child.name}`;
                              return (
                                <MenuSubItemComponent
                                  key={child.name}
                                  item={child}
                                  pathname={pathname}
                                  expandedMenus={expandedMenus}
                                  onToggleMenu={toggleMenu}
                                  menuKey={childMenuKey}
                                />
                              );
                            })}
                          </SidebarMenuSub>
                        )}
                      </>
                    ) : (
                      "icon" in item &&
                      item.icon && (
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.name}
                        >
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      )
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </UISidebar>
  );
}
