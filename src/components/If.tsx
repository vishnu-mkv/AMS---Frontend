import { authStatusAtom } from "@/atoms/UserAtom";
import { PermissionEnum } from "@/interfaces/permission";
import { checkIfUserHasPermission } from "@/lib/utils";
import { useAtom } from "jotai";
import { ReactNode } from "react";

interface childrenProps {
  children: ReactNode;
}

interface UserStateProps extends childrenProps {
  loggedIn: boolean;
  permissions?: PermissionEnum[];
  mode?: "all" | "any";
}

export function RenderIfUser({
  loggedIn,
  permissions,
  children,
  mode = "all",
}: UserStateProps) {
  const [authStatus] = useAtom(authStatusAtom);

  if (authStatus === "loading") return null;

  if (loggedIn && authStatus === "unauthenticated") return null;

  if (!loggedIn && authStatus === "authenticated") return null;

  if (loggedIn && permissions && !checkIfUserHasPermission(permissions, mode)) {
    return null;
  }

  return <>{children}</>;
}

export function IfAuthenticated({ children }: childrenProps) {
  return <RenderIfUser loggedIn={true}>{children}</RenderIfUser>;
}

export function IfNotAuthenticated({ children }: childrenProps) {
  return <RenderIfUser loggedIn={false}>{children}</RenderIfUser>;
}
