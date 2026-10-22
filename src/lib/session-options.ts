import type { SessionOptions } from "iron-session";
import type { Env } from "./env";

export type SessionData = { userId?: string };

const THIRTY_DAYS = 60 * 60 * 24 * 30;

// S4: cookie criptografado e assinado, contendo só o userId
export function buildSessionOptions(e: Pick<Env, "SESSION_SECRET" | "NODE_ENV">): SessionOptions {
  return {
    cookieName: "vida_session",
    password: e.SESSION_SECRET,
    ttl: THIRTY_DAYS,
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: e.NODE_ENV === "production",
      path: "/",
    },
  };
}
