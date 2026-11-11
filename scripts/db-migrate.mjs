// Applies db/schema.sql to the database in DATABASE_URL. Safe to run repeatedly.
// Usage: DATABASE_URL=... npm run db:migrate
import { readFile } from "node:fs/promises";
import postgres from "postgres";

const raw = process.env.DATABASE_URL;
if (!raw) {
  console.error("Set DATABASE_URL first.");
  process.exit(1);
}
// Same password encoding as src/lib/server/db.ts, so special characters work.
function normalizeDatabaseUrl(value) {
  const trimmed = value.trim();
  const m = trimmed.match(/^(postgres(?:ql)?:\/\/)([^:@/]+):([\s\S]*)@([^@]+)$/);
  if (!m) return trimmed;
  const [, scheme, user, pass, rest] = m;
  let plain = pass;
  try {
    plain = decodeURIComponent(pass);
  } catch {
    // Not an escape sequence: use the password as typed.
  }
  return `${scheme}${user}:${encodeURIComponent(plain)}@${rest}`;
}
const url = normalizeDatabaseUrl(raw);
const local = /@(localhost|127\.0\.0\.1)(:|\/)/.test(url);
const sql = postgres(url, { ssl: local ? false : "require", prepare: false, onnotice: () => {} });
const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
await sql.unsafe(schema);
console.log("Database schema is up to date.");
await sql.end();
