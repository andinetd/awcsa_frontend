import { jwtDecode } from "jwt-decode";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { DeputyBureau, EmployeeJwtPayload, JwtPayload } from "./types/api/auth";
import { routePermissions } from "./utils/routePermissions";
import { verifyJwtSignature } from "./lib/jwt-verify";

const intlMiddleWare = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split("/");
  const firstSegment = segments[1] as (typeof routing.locales)[number];
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value as
    | (typeof routing.locales)[number]
    | undefined;

  const locale = routing.locales.includes(firstSegment)
    ? firstSegment
    : cookieLocale && routing.locales.includes(cookieLocale)
      ? cookieLocale
      : routing.defaultLocale;

  const pathNameWithoutLocale = routing.locales.includes(firstSegment)
    ? "/" + segments.slice(2).join("/")
    : pathname;

  // ✅ remove trailing slash unless root
  const normalizedPath =
    pathNameWithoutLocale !== "/" && pathNameWithoutLocale.endsWith("/")
      ? pathNameWithoutLocale.slice(0, -1)
      : pathNameWithoutLocale;

  const publicRoutes = [
    "/",
    "/login",
    "/unauthorized",
    "/register",
    "/reset-password",
    "",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathNameWithoutLocale === route ||
      pathname === `/${locale}${route === "/" ? "" : route}`,
  );

  if (isPublicRoute) {
    return intlMiddleWare(req);
  }

  // AUTH CHECK
  const token = req.cookies.get("wcasf_auth_token")?.value;

  if (!token) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // SIGNATURE & INTEGRITY CHECK
    const isValidSignature = await verifyJwtSignature(token as string);
    if (!isValidSignature) {
      console.warn("Middleware rejected JWT signature on path:", req.nextUrl.pathname);
      const loginUrl = new URL(`/${locale}/login`, req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("wcasf_auth_token");
      return response;
    }

    const decodedToken = jwtDecode<JwtPayload>(token as string);

    // EXPIRATION CHECK
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      const loginUrl = new URL(`/${locale}/login`, req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("wcasf_auth_token");
      return response;
    }

    const matchedRoute = Object.keys(routePermissions)
      .sort((a, b) => b.length - a.length)
      .find(
        (route) =>
          normalizedPath === route || normalizedPath.startsWith(route + "/"),
      );

    if (!matchedRoute) {
      // DENY BY DEFAULT for non-public routes
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }

    const guard = routePermissions[matchedRoute];

    // ACCOUNT TYPE CHECK
    if (!guard.allowedAccountTypes.includes(decodedToken.user.accountType)) {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }

    // Super Admin bypass: Super Admin has every permission and full access by default
    const isSuperAdmin =
      (decodedToken as EmployeeJwtPayload).entity?.role === "Super_Admin" ||
      (decodedToken as any).roles?.includes("Super_Admin") ||
      (decodedToken as any).role === "Super_Admin";

    if (!isSuperAdmin) {
      // ROLE CHECK FOR EMPLOYEE ONLY
      if (decodedToken.user.accountType === "EMPLOYEE") {
        const employeeToken = decodedToken as EmployeeJwtPayload;
        const employeeRole = employeeToken.entity?.role;
        const isBureauManager =
          employeeRole === "Bureau_Manager" ||
          employeeToken.department === "SYSTEM";

        // Bureau Manager / SYSTEM department has full bureau-wide access
        if (!isBureauManager && guard.allowedRoles && guard.allowedRoles.length > 0) {
          const userModules: string[] = [
            ...((employeeToken as any).assignedModules || []),
            employeeToken.department,
          ].filter(Boolean);

          const isFacilityAdmin =
            employeeRole === "Facility_Admin" ||
            (employeeToken as any).roles?.includes("Facility_Admin");

          const hasAccess =
            (isFacilityAdmin &&
              guard.allowedRoles.includes("CARE_CENTERS_PORTAL")) ||
            guard.allowedRoles.some(
              (allowed) => Boolean(allowed && userModules.includes(allowed)),
            );

          if (!hasAccess) {
            return NextResponse.redirect(
              new URL(`/${locale}/unauthorized`, req.url),
            );
          }
        }
      }

      // PERMISSION CHECK
      if (guard.requiredPermissions && guard.requiredPermissions.length > 0) {
        const userPermissions = decodedToken.auth?.permissions || [];
        const hasAllRequiredPermissions = guard.requiredPermissions.every(
          (permission) => userPermissions.includes(permission),
        );

        if (!hasAllRequiredPermissions) {
          return NextResponse.redirect(
            new URL(`/${locale}/unauthorized`, req.url),
          );
        }
      }
    }

    return intlMiddleWare(req);
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
