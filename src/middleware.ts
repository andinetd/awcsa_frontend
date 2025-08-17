import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { EmployeeJwtPayload, JwtPayload } from "./types/api/auth";
import { routePermissions } from "./utils/routePermissions";

const intlMiddleWare = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const locale = req.nextUrl.locale || routing.defaultLocale;

  const segments = pathname.split("/");
  const firstSegment = segments[1] as (typeof routing.locales)[number];
  const pathNameWithoutLocale =
    routing.locales.includes(firstSegment) &&
    firstSegment !== routing.defaultLocale
      ? "/" + segments.slice(2).join("/")
      : pathname;

  const publicRoutes = ["/", "/login", "/unauthorized", "/register", ""];

  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathNameWithoutLocale === route ||
      pathname === `/${locale}${route === "/" ? "" : route}`
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

    const matchedRoute = Object.keys(routePermissions).find((route) =>
      pathNameWithoutLocale.startsWith(route)
    );
    console.log(`MATCHED ROUTE: ${matchedRoute}`);

    if (!matchedRoute) {
      return intlMiddleWare(req);
    }

    const guard = routePermissions[matchedRoute];

    //ACCOUNT TYPE CHECK
    if (!guard.allowedAccountTypes.includes(decodedToken.user.accountType)) {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }

    //ROLE CHECK FOR EMPLOYEE ONLY
    if (decodedToken.user.accountType == "EMPLOYEE") {
      const employeeToken = decodedToken as EmployeeJwtPayload;

      if (
        guard.allowedRoles &&
        !guard.allowedRoles.includes(employeeToken.entity.role)
      ) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
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
