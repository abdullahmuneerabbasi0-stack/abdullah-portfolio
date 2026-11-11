import "server-only";
import postgres from "postgres";

/**
 * Server-only Postgres connection. DATABASE_URL never reaches the browser:
 * it has no NEXT_PUBLIC_ prefix and this module is marked server-only.
 *
 * On Supabase, paste the pooler connection string. Supabase's transaction
 * pooler (port 6543) can leave queries hanging when this client runs several
 * queries at once over one connection, so a pooler URL on port 6543 is
 * switched to the same host's session pooler (port 5432), which speaks plain
 * Postgres. Prepared statements stay off so either pooler works.
 */
type Sql = ReturnType<typeof postgres>;
const g = globalThis as unknown as { __portfolioSql?: Sql };

export const isDbConfigured = () => !!process.env.DATABASE_URL;

/**
 * Percent-encodes the password in a connection string, so a password pasted
 * as-is still works when it contains characters such as @ # / ? or :.
 * Already-encoded passwords are left unchanged.
 */
export function normalizeDatabaseUrl(raw: string): string {
  const url = raw.trim();
  const m = url.match(/^(postgres(?:ql)?:\/\/)([^:@/]+):([\s\S]*)@([^@]+)$/);
  if (!m) return url;
  const [, scheme, user, pass, rest] = m;
  let plain = pass;
  try {
    plain = decodeURIComponent(pass);
  } catch {
    // A lone "%" that isn't an escape: treat the password as plain text.
  }
  return `${scheme}${user}:${encodeURIComponent(plain)}@${rest}`;
}

/** Supabase pooler on port 6543 (transaction mode) → port 5432 (session mode). */
export function preferSessionPooler(url: string): string {
  return url.replace(/(@[^@/]+\.pooler\.supabase\.com):6543(?=\/|$|\?)/, "$1:5432");
}

export function db(): Sql {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is not set");
  if (!g.__portfolioSql) {
    const url = preferSessionPooler(normalizeDatabaseUrl(raw));
    if (!/^postgres(ql)?:\/\//.test(url)) {
      // Without this, a bare password here is read as a hostname and fails with ENOTFOUND.
      throw new Error("DATABASE_URL must be the full postgresql:// connection string, not just the password.");
    }
    const local = /@(localhost|127\.0\.0\.1)(:|\/)/.test(url) || process.env.DATABASE_SSL === "disable";
    g.__portfolioSql = postgres(url, {
      prepare: false,
      // Kept small: every serverless instance holds its own connections, and the
      // session pooler on Supabase's free plan allows only a few in total.
      max: Number(process.env.DATABASE_POOL_MAX ?? 3),
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: local ? false : "require",
      onnotice: () => {},
    });
  }
  return g.__portfolioSql;
}
