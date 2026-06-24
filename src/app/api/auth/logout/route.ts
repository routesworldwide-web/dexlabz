import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/session-token";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(getRedirectUrl(request), 303);

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...sessionCookieOptions,
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}

function getRedirectUrl(request: Request): URL {
  const forwardedHost = getFirstHeaderValue(
    request.headers.get("x-forwarded-host"),
  );
  const host = forwardedHost ?? request.headers.get("host");

  if (host) {
    const forwardedProto = getFirstHeaderValue(
      request.headers.get("x-forwarded-proto"),
    );
    const protocol =
      forwardedProto ?? (host.startsWith("localhost") ? "http" : "https");

    return new URL("/", `${protocol}://${host}`);
  }

  return new URL("/", request.url);
}

function getFirstHeaderValue(value: string | null): string | null {
  return value?.split(",")[0]?.trim() || null;
}
