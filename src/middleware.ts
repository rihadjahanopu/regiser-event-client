import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getSessionCookie(request: NextRequest) {
  // better-auth uses __Secure- prefix on HTTPS (production)
  // and no prefix on HTTP (development)
  return (
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session_token")
  );
}

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPage = pathname.startsWith("/admin/login");
  const isRegisterPage = pathname.startsWith("/admin/register");

  // Protect /admin routes (except /admin/login and /admin/register)
  if (isAdminPath && !isLoginPage && !isRegisterPage) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Redirect /admin/login to /admin if already logged in
  if (isLoginPage && sessionCookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
