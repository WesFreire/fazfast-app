import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const access = request.cookies.get("access")?.value || request.headers.get("Authorization");

  const protectedRoutes = ["/perfilusuario", "/perfilprofissional"];

  if (protectedRoutes.includes(request.nextUrl.pathname) && !access) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/perfilusuario", "/perfilprofissional"],
};
