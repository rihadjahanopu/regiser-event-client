import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getSessionCookie(request: NextRequest) {
  // better-auth uses __Secure- prefix on HTTPS, plain name on HTTP
  return (
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value ||
    null
  );
}

export async function middleware(request: NextRequest) {
  const sessionToken = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login" || pathname === "/login";
  const isRegisterPage = pathname === "/admin/register" || pathname === "/register";
  const isDashboardPath = pathname.startsWith("/dashboard");

  // Public auth paths — allow through so client component can handle role-based redirect
  if (isLoginPage || isRegisterPage) {
    return NextResponse.next();
  }

  // Protected admin paths — require session token
  if (isAdminPath || isDashboardPath) {
    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Session token exists — let the request through.
    // The actual admin role verification happens on the backend API calls.
    // This avoids the server-to-server fetch that was causing the logout loop.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
