import type { SessionOptions } from "iron-session";
import type { Env } from "./env";

export type SessionData = { userId?: string };

const THIRTY_DAYS = 60 * 60 * 24 * 30;

// S4: cookie criptografado e assinado, contendo só o userId
export function buildSessionOptions(
  e: Pick<Env, "SESSION_SECRET" | "NODE_ENV"> & Partial<Pick<Env, "SESSION_COOKIE_SECURE">>,
): SessionOptions {
  const secure = e.SESSION_COOKIE_SECURE ? e.SESSION_COOKIE_SECURE === "true" : e.NODE_ENV === "production";
  return {
    cookieName: "vida_session",
    password: e.SESSION_SECRET,
    ttl: THIRTY_DAYS,
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
    },
  };
}
