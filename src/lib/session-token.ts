import { SignJWT, jwtVerify } from "jose";

import { getSessionSecret } from "@/lib/env";

export const SESSION_COOKIE_NAME = "dexlabz_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

const issuer = "dexlabz-access";
const audience = "dexlabz-member";

function getSigningKey(): Uint8Array {
  return new TextEncoder().encode(getSessionSecret());
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSigningKey());
}

export async function verifySessionToken(
  token: string,
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSigningKey(), {
      algorithms: ["HS256"],
      issuer,
      audience,
    });

    if (!payload.sub) {
      return null;
    }

    return { userId: payload.sub };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
