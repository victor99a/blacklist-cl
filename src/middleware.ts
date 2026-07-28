import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = req.cookies.get("next-auth.session-token")?.value
    ?? req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (pathname.startsWith("/garaje") && !sessionToken) {
    const url = new URL("/", req.url);
    url.searchParams.set("login", "required");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/garaje/:path*"],
};
