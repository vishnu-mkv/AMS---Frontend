// a atom to store auth state - unauthenticated, authenticated, loading
// token, user data

import { User } from "@/interfaces/user";
import { atom } from "jotai";

type authStatus = "unauthenticated" | "authenticated" | "loading";

interface AuthAtomState {
  token: string | null;
  user: User | null;
}

const intialAuthState: AuthAtomState = {
  token: null,
  user: null,
};

export const authAtom = atom(intialAuthState, (_, set, update) => {
  localStorage.setItem("user", JSON.stringify(update));
  set(authAtom, update);
});

export const intializeAtom = atom(false);

// readonly atom to store auth state - unauthenticated, authenticated, loading
export const authStatusAtom = atom<authStatus>((get) => {
  const { token, user } = get(authAtom);
  const intialized = get(intializeAtom);

  if (!intialized) {
    return "loading";
  }

  if (!token) {
    return "unauthenticated";
  }
  if (!user) {
    return "loading";
  }

  return "authenticated";
});

export const userPermissionsAtom = atom<string[]>((get) => {
  const { user } = get(authAtom);
  if (!user) {
    return [];
  }

  const permissions: string[] = [];

  user.roles.forEach((role) => {
    role.permissions.forEach((permission) => {
      permissions.push(permission.id);
    });
  });

  return permissions;
});
