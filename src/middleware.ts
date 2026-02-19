import { jwtDecode } from "jwt-decode";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { DeputyBureau, EmployeeJwtPayload, JwtPayload } from "./types/api/auth";
import { routePermissions } from "./utils/routePermissions";

const intlMiddleWare = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const locale = req.nextUrl.locale || routing.defaultLocale;

  const segments = pathname.split("/");
  const firstSegment = segments[1] as (typeof routing.locales)[number];
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
    const decodedToken = jwtDecode<JwtPayload>(token as string);

    // EXPIRATION CHECK
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      const loginUrl = new URL(`/${locale}/login`, req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("wcasf_auth_token");
      return response;
    }

    const matchedRoute = Object.keys(routePermissions).find(
      (route) =>
        normalizedPath === route || normalizedPath.startsWith(route + "/"),
    );

    console.log("PATH:", normalizedPath, "MATCHED:", matchedRoute);

    if (!matchedRoute) {
      // DENY BY DEFAULT for non-public routes
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }

    const guard = routePermissions[matchedRoute];

    // ACCOUNT TYPE CHECK
    if (!guard.allowedAccountTypes.includes(decodedToken.user.accountType)) {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }

    // ROLE CHECK FOR EMPLOYEE ONLY
    if (decodedToken.user.accountType == "EMPLOYEE") {
      const employeeToken = decodedToken as EmployeeJwtPayload;
      const department = employeeToken.department;

      // Use department directly for matching in routePermissions
      const effectiveRole = department;

      if (
        guard.allowedRoles &&
        !guard.allowedRoles.includes(effectiveRole as any)
      ) {
        return NextResponse.redirect(
          new URL(`/${locale}/unauthorized`, req.url),
        );
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
