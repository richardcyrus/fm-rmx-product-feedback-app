import { db } from "~/utils/db.server";

export async function truncateDb() {
  const tableNames = await db.$queryRaw<
    Array<{ database_name: string; tablename: string }>
  >`SELECT table_schema AS database_name,
           table_name AS tablename
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE' AND table_schema = database();`;

  for (const { tablename } of tableNames) {
    if (tablename !== "_prisma_migrations") {
      try {
        await db.$executeRawUnsafe(`TRUNCATE TABLE ${tablename};`);
      } catch (error) {
        console.log({ error });
      }
    }
  }
}
