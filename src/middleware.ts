import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getSessionCookie(request: NextRequest) {
  return (
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session_token")
  );
}

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login" || pathname === "/login";
  const isRegisterPage = pathname === "/admin/register" || pathname === "/register";
  const isDashboardPath = pathname.startsWith("/dashboard");

  // If trying to access protected paths and no session cookie, redirect to login
  if ((isAdminPath || isDashboardPath) && !isLoginPage && !isRegisterPage) {
    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Fetch session user details if session cookie exists
  let user: any = null;
  if (sessionCookie) {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");
      const res = await fetch(`${apiUrl}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
      if (res.ok) {
        const sessionData = await res.json();
        if (sessionData && sessionData.user) {
          user = sessionData.user;
        }
      }
    } catch (err) {
      console.error("Middleware session fetch error:", err);
    }
  }

  // If accessing login/register page and already logged in, redirect to dashboard
  if ((isLoginPage || isRegisterPage) && user) {
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Admin Route Protection: Only admins can access /admin routes
  if (isAdminPath && !isLoginPage && !isRegisterPage) {
    if (!user || user.role !== "admin") {
      return NextResponse.rewrite(new URL("/unauthorized", request.url));
    }
  }

  // User Dashboard Route Protection
  if (isDashboardPath) {
    // Must be logged in
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    // "Only users can access Add Blog"
    if (pathname.startsWith("/dashboard/add-blog")) {
      if (user.role !== "user") {
        return NextResponse.rewrite(new URL("/unauthorized", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
