import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Protect /garaje routes
  if (pathname.startsWith("/garaje") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/?login=required", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/garaje/:path*"],
};
