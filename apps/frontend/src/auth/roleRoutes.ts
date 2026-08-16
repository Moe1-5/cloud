import type {
  UserRole,
} from "@ddac/shared";

export type RoleHomePage =
  | "admin"
  | "reliefCoordinator"
  | "affectedUser";

export const ROLE_HOME_PAGES: Record<
  UserRole,
  RoleHomePage
> = {
  admin: "admin",

  reliefCoordinator:
    "reliefCoordinator",

  affectedUser:
    "affectedUser",
};

export function getHomePageForRole(
  role: UserRole
): RoleHomePage {
  return ROLE_HOME_PAGES[role];
}