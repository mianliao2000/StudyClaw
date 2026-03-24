import path from "node:path";
import { defineConfig } from "prisma/config";

const defaultDbPath = path.join(__dirname, "prisma", "dev.db");
const dbUrl = process.env.DATABASE_URL || `file:${defaultDbPath}`;

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma", "migrations"),
  },
  datasource: {
    url: dbUrl,
  },
});
