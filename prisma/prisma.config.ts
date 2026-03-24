import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const defaultDbPath = path.join(__dirname, "dev.db");
const dbUrl = process.env.DATABASE_URL || `file:${defaultDbPath}`;

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  migrate: {
    url: dbUrl,
  },
  adapter: () => new PrismaBetterSqlite3({ url: dbUrl }),
});
