// @see: https://www.simplethread.com/isolated-integration-testing-with-remix-vitest-and-prisma/
// @see: https://www.techonthenet.com/postgresql/truncate.php
import { db } from "~/utils/db.server";

export async function truncateDb() {
  const tableNames = await db.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`;

  const relations = await db.$queryRaw<
    Array<{ relname: string }>
  >`SELECT c.relname FROM pg_class AS c JOIN pg_namespace AS n ON c.relnamespace = n.oid WHERE c.relkind='S' AND n.nspname='public';`;

  for (const { tablename } of tableNames) {
    if (tablename !== "_prisma_migrations") {
      try {
        await db.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
        );
        // console.log(`Truncated table ${tablename}`);
      } catch (error) {
        console.error(error);
      }
    }
  }

  for (const { relname } of relations) {
    try {
      await db.$executeRawUnsafe(
        `ALTER SEQUENCE "public"."${relname}" RESTART WITH 1;`
      );
    } catch (error) {
      console.error(error);
    }
  }

  console.log('Reset database');
}
