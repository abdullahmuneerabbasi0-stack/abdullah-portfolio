// Applies db/schema.sql to the database in DATABASE_URL. Safe to run repeatedly.
// Usage: DATABASE_URL=... npm run db:migrate
import { readFile } from "node:fs/promises";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL first.");
  process.exit(1);
}
const local = /@(localhost|127\.0\.0\.1)(:|\/)/.test(url);
const sql = postgres(url, { ssl: local ? false : "require", prepare: false, onnotice: () => {} });
const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
await sql.unsafe(schema);
console.log("Database schema is up to date.");
await sql.end();
