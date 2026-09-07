/**
 * Canonical post-logout destination. Use this constant from every code path
 * that clears the auth session so we don't end up sending the user to the
 * home page (where there's no clear re-entry point) or to a stray URL.
 *
 * The route is locale-prefixed by `next-intl` at render time, so we keep the
 * raw path here and let the navigation helpers handle the prefix.
 */
export const LOGIN_ROUTE = "/login";

/**
 * Public auth-related routes that should never be redirected away from, even
 * if the user is unauthenticated. Anything in this set is treated as the
 * "no auth required" zone by `AuthProvider` and the session monitor.
 */
export const PUBLIC_AUTH_PATHS: ReadonlySet<string> = new Set([
  LOGIN_ROUTE,
  "/register",
  "/reset-password",
]);

/** True when the current path should not be auth-gated. */
export function isPublicAuthPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (pathname === "/") return true;
  return PUBLIC_AUTH_PATHS.has(pathname);
}
