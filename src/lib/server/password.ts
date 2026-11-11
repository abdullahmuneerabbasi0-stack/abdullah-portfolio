import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";

const scrypt = (pw: string, salt: Buffer, len: number, opts: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) => scryptCb(pw, salt, len, opts, (err, key) => (err ? reject(err) : resolve(key))));

// scrypt with N=2^15, r=8, p=1: about 32 MB and ~100 ms per hash.
const N = 32768;
const R = 8;
const P = 1;
const KEYLEN = 64;
const MAXMEM = 64 * 1024 * 1024;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password.normalize("NFKC"), salt, KEYLEN, { N, r: R, p: P, maxmem: MAXMEM });
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, n, r, p, saltB64, keyB64] = stored.split("$");
  if (alg !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64");
  const key = await scrypt(password.normalize("NFKC"), Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: MAXMEM,
  });
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/** A precomputed hash used to keep login timing equal when the email is unknown. */
let dummy: Promise<string> | null = null;
export const dummyHash = () => (dummy ??= hashPassword(randomBytes(16).toString("hex")));

export function passwordProblem(pw: string, email?: string): string | null {
  if (pw.length < 12) return "Use at least 12 characters.";
  if (pw.length > 200) return "Use 200 characters or fewer.";
  if (!/[a-z]/i.test(pw) || !/[0-9]/.test(pw)) return "Mix letters and at least one number.";
  if (email && pw.toLowerCase().includes(email.split("@")[0].toLowerCase())) return "Don't include your email name in the password.";
  return null;
}
