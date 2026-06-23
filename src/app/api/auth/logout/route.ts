import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/session-token";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url), 303);

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...sessionCookieOptions,
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
