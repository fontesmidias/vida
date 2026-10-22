import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { env } from "./env";
import { buildSessionOptions, type SessionData } from "./session-options";

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), buildSessionOptions(env()));
}
