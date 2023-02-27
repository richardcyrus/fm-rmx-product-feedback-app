// @see: https://www.simplethread.com/isolated-integration-testing-with-remix-vitest-and-prisma/
// @see: https://www.techonthenet.com/postgresql/truncate.php
import { db } from "~/utils/db.server";

export async function truncateDb() {
  const tableNames = await db.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`;

  for (const { tablename } of tableNames) {
    if (tablename !== "_prisma_migrations") {
      try {
        await db.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }
}
