"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Link, Outlet } from "react-router-dom";
import clsx from "clsx";
import Logo from "./Logo";
import { IfAuthenticated, IfNotAuthenticated, RenderIfUser } from "./If";
import Profile from "./Profile";
import { useLocation, useSearchParams } from "react-router-dom";
import { buildQuery, cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Icon } from "@iconify/react";
import { PermissionEnum } from "@/interfaces/permission";

export interface NavItem {
  text: string;
  href: string;
  onClick?: () => void;
  activeRegex?: RegExp;
  icon?: string;
  permissions?: PermissionEnum[];
}
const links: NavItem[] = [
  {
    text: "Dashboard",
    href: "/",
    activeRegex: /^\/$/,
    icon: "material-symbols:dashboard",
  },
  {
    text: "Users",
    href: "/users",
    activeRegex: /^\/users/,
    icon: "mdi:users-outline",
    permissions: [
      PermissionEnum.ListUsers,
      PermissionEnum.AddUser,
      PermissionEnum.UpdateUser,
      PermissionEnum.DeleteUser,
    ],
  },
  {
    text: "Groups",
    href: "/groups",
    activeRegex: /^\/groups/,
    icon: "material-symbols:groups-outline",
    permissions: [
      PermissionEnum.ListGroups,
      PermissionEnum.AddGroup,
      PermissionEnum.UpdateGroup,
      PermissionEnum.DeleteGroup,
      PermissionEnum.ReadGroup,
    ],
  },
  {
    text: "Roles",
    href: "/roles",
    activeRegex: /^\/roles/,
    icon: "teenyicons:id-solid",
    permissions: [
      PermissionEnum.ListRoles,
      PermissionEnum.AddRole,
      PermissionEnum.UpdateRole,
      PermissionEnum.DeleteRole,
    ],
  },
  {
    text: "Topics",
    href: "/topics",
    activeRegex: /^\/topics/,
    icon: "icon-park-solid:topic-discussion",
    permissions: [
      PermissionEnum.ListTopics,
      PermissionEnum.AddTopic,
      PermissionEnum.UpdateTopic,
      PermissionEnum.DeleteTopic,
      PermissionEnum.ReadTopic,
    ],
  },
  {
    text: "Schedules",
    href: "/schedules",
    activeRegex: /^\/schedule/,
    icon: "uim:schedule",
    permissions: [
      PermissionEnum.ListSchedules,
      PermissionEnum.AddSchedule,
      PermissionEnum.UpdateSchedule,
      PermissionEnum.DeleteSchedule,
      PermissionEnum.ListSessions, // Add session-related permission
    ],
  },
  {
    text: "Record Attendance",
    href: "/attendance",
    activeRegex: /^\/attendance/,
    icon: "bx:task",
    permissions: [
      PermissionEnum.ListAttendances,
      PermissionEnum.AddAttendance,
      PermissionEnum.UpdateAttendance,
      PermissionEnum.ReadAttendance,
      PermissionEnum.DeleteAttendance,
      PermissionEnum.GetAttendance,
    ],
  },
  {
    text: "Records",
    href: "/records",
    activeRegex: /^\/records/,
    icon: "vaadin:records",
    permissions: [
      PermissionEnum.AddSession, // Add session-related permission
      PermissionEnum.UpdateSession, // Add session-related permission
      PermissionEnum.DeleteSession, // Add session-related permission
      PermissionEnum.ReadSession,
    ],
  },
];

function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();

  function closeNav() {
    setNavOpen(false);
  }

  useEffect(() => {
    // on init read screen size and set navOpen accordingly
    if (window.innerWidth > 1024) {
      setNavOpen(true);
    } else {
      setNavOpen(false);
    }
  }, [pathname]);

  if (pathname === "/auth/login" || pathname === "/auth/register")
    return <Outlet />;

  return (
    <div className="grid grid-cols-5">
      {
        <div
          className={clsx(
            "z-10 h-screen  absolute w-full inset-0 lg:static transition-all duration-500 ease-in-out",
            navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex justify-between items-center py-[29.5px] px-3 border-b border-gray-200 h-nav bg-primary">
            <Link to="/">
              <Logo />
            </Link>
            <XIcon
              className="lg:hidden cursor-pointer text-white"
              onClick={closeNav}
            ></XIcon>
          </div>
          <div className="h-body flex flex-col gap-2 p-2 border-r bg-white lg:border-r-gray-200">
            {links.map((link) => (
              <RenderIfUser
                key={link.href}
                permissions={link.permissions}
                loggedIn
              >
                <Link
                  to={link.href}
                  className={cn(
                    "flex font-barlow  items-center gap-4 p-2 hover:scale-[101%] transition-all text-gray-700 rounded-md hover:text-gray-800",
                    link.activeRegex?.test(pathname)
                      ? " text-primary font-medium"
                      : ""
                  )}
                  onClick={closeNav}
                >
                  {link.icon && (
                    <Icon icon={link.icon} className="w-5 h-5"></Icon>
                  )}
                  <span>{link.text}</span>
                </Link>
              </RenderIfUser>
            ))}
          </div>
        </div>
      }

      <div
        className={clsx(
          "",
          navOpen ? "col-span-5 lg:col-span-4" : "col-span-5 lg:col-span-4"
        )}
      >
        <nav className="bg-primary flex justify-between w-full h-head border-b border-gray-200 px-3">
          <div
            className={clsx(
              `nav-head items-center justify-between flex gap-3 h-auto `,
              navOpen ? "opacity-0" : "opacity-100 lg:opacity-0"
            )}
          >
            <MenuIcon
              onClick={() => setNavOpen(true)}
              className="lg:hidden cursor-pointer text-white"
            ></MenuIcon>
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <div
            className={clsx(`py-6 h-auto ease-in-out flex gap-10 items-center`)}
          >
            <IfNotAuthenticated>
              <div className="px-6 flex gap-4 mt-10 sm:mt-0 sm:px-0">
                <Button href="/auth/login" onClick={closeNav}>
                  Login
                </Button>
              </div>
            </IfNotAuthenticated>
            <IfAuthenticated>
              <Profile></Profile>
            </IfAuthenticated>
          </div>
        </nav>
        <ScrollArea className="max-w-full m-3 h-body">
          <Outlet />
          <div className="h-[50px]"></div>
        </ScrollArea>
      </div>
    </div>
  );
}

function NavItem({ text, href, onClick = () => {}, activeRegex }: NavItem) {
  const { pathname } = useLocation();
  const query = useSearchParams();

  const queryStrObj: any = {};
  query.forEach((val, key) => {
    queryStrObj[key] = val;
  });

  const queryStr = buildQuery(queryStrObj);
  const fullPath = pathname + (queryStr ? `?${queryStr}` : "");

  return (
    <Link
      className={cn("px-6 rounded-lg py-3 sm:py-1 sm:px-4 hover:bg-slate-200", {
        "text-primary font-medium": activeRegex?.test(fullPath),
      })}
      to={href}
      onClick={onClick}
    >
      {text}
    </Link>
  );
}

export default Navbar;
