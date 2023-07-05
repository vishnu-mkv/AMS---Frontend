import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PermissionEnum } from "@/interfaces/permission";
import { authStatusAtom, userPermissionsAtom } from "@/atoms/UserAtom";
import { useAtom } from "jotai";
import Loading from "./Loading";
import UnAuthorized from "./UnAuthorized";

interface RoutePermission {
  path: RegExp;
  permissions: PermissionEnum[];
}

const routePermissions: RoutePermission[] = [];

function RouteProtector({ children }: { children: React.ReactNode }) {
  const history = useNavigate();
  const { pathname } = useLocation();

  const [authStatus] = useAtom(authStatusAtom);
  const [userPermissions] = useAtom(userPermissionsAtom);

  const [protectionStatus, setProtectionStatus] = useState<
    "allowed" | "denied" | "loading"
  >("loading");

  useEffect(() => {
    if (protectionStatus === "denied") {
      setTimeout(() => {
        history("/auth/login?code=loginRequired");
      }, 1000);
    }
  }, [protectionStatus]);

  useEffect(() => {
    if (authStatus === "loading" || protectionStatus !== "loading") {
      return;
    }

    if (pathname === "/auth/login" || pathname === "/auth/register") {
      setProtectionStatus("allowed");
      return;
    }

    if (authStatus === "unauthenticated") {
      setProtectionStatus("denied");
    }

    if (authStatus === "authenticated") {
      const routePermission = routePermissions.find((routePermission) =>
        routePermission.path.test(pathname)
      );

      const hasAccess = hasPermission(
        userPermissions,
        routePermission?.permissions || []
      );

      if (hasAccess) {
        setProtectionStatus("allowed");
      } else {
        setProtectionStatus("denied");
      }
    }
  }, [authStatus, userPermissions, protectionStatus]);

  useEffect(() => {
    if (protectionStatus !== "loading") {
      setProtectionStatus("loading");
    }
  }, [pathname]);

  if (protectionStatus === "loading") {
    return <Loading></Loading>;
  }

  if (protectionStatus === "denied") {
    return <UnAuthorized />;
  }

  return <>{children}</>;
}

function hasPermission(
  userPermissions: string[],
  requiredPermissions: PermissionEnum[]
) {
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
}

export default RouteProtector;
