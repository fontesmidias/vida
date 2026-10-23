// S8: senha guardada como hash scrypt (crypto nativo do Node), comparação em tempo constante
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LEN = 32;

export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(plain, salt, KEY_LEN).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(plain: string, stored: string | null | undefined): boolean {
  const [scheme, salt, hash] = stored?.split("$") ?? [];
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  if (expected.length !== KEY_LEN) return false;
  return timingSafeEqual(scryptSync(plain, salt, KEY_LEN), expected);
}
