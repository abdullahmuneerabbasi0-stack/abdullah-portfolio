import "server-only";
import postgres from "postgres";

/**
 * Server-only Postgres connection. DATABASE_URL never reaches the browser:
 * it has no NEXT_PUBLIC_ prefix and this module is marked server-only.
 *
 * On Supabase use the "Transaction pooler" connection string (port 6543);
 * prepared statements are turned off so it works with the pooler.
 */
type Sql = ReturnType<typeof postgres>;
const g = globalThis as unknown as { __portfolioSql?: Sql };

export const isDbConfigured = () => !!process.env.DATABASE_URL;

export function db(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  if (!g.__portfolioSql) {
    const local = /@(localhost|127\.0\.0\.1)(:|\/)/.test(url) || process.env.DATABASE_SSL === "disable";
    g.__portfolioSql = postgres(url, {
      prepare: false,
      max: Number(process.env.DATABASE_POOL_MAX ?? 5),
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: local ? false : "require",
      onnotice: () => {},
    });
  }
  return g.__portfolioSql;
}
