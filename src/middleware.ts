import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "./types/api/auth";
import { routePermissions } from "./utils/routePermissions";
 
const intlMiddleWare =  createMiddleware(routing);

export function middleware (req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const locale = req.nextUrl.locale || routing.defaultLocale;

 const publicRoutes = ['/', '/login', '/unauthorized'];
    // const isPublicRoute = publicRoutes.includes(pathname) || publicRoutes.some(route => pathname === `/${locale}${route === '/' ? '': route}`);
 
 const isPublicRoute =
    publicRoutes.includes(pathname) ||
    publicRoutes.some(
      (route) =>
        pathname ===
        `/${locale}${route === '/' ? '' : route}`
    );

  if (isPublicRoute) {
    return intlMiddleWare(req);
  }

  const token = req.cookies.get("wcasf_auth_token")?.value;

  if (!token) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decodedToken = jwtDecode<JwtPayload>(token as string);
  
   const matchedRoute = Object.keys(routePermissions).find((route) =>
      pathname.startsWith(`/${locale}${route}`)
    );

    if (!matchedRoute) return intlMiddleWare(req);

 const guard = routePermissions[matchedRoute.replace(`/${locale}`, '')]; // Normalize key without locale
  

    if (!guard.allowedAccountTypes.includes(decodedToken.user.accountType )) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (
      decodedToken.user.accountType === "EMPLOYEE" &&
      guard.allowedRoles &&
      !guard.allowedRoles.includes(decodedToken.entity.type)
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return intlMiddleWare(req);
  } catch (error) {
    console.error('Middleware error:', error); // Log for debugging in dev/prod
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
