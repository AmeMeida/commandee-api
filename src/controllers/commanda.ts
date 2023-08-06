import { nanoid } from "nanoid/async";
import db from "../database/db";
import { commandaTable, restaurantTable } from "../database/schema";
import { eq, placeholder } from "drizzle-orm";

export async function create(commanda: {
  costumer: string;
  table?: number;
  restaurant: string;
}) {
  const [publicId, [{ id: restaurantId }]] = await Promise.all([
    nanoid(),
    db
      .select({ id: restaurantTable.id })
      .from(restaurantTable)
      .where(eq(restaurantTable.publicId, commanda.restaurant))
  ]);

  await db.insert(commandaTable).values({
    ...commanda,
    publicId,
    restaurant: restaurantId,
    id: undefined
  });
}

export async function get(id: string) {
  return db
    .select()
    .from(commandaTable)
    .where(eq(commandaTable.publicId, id))
    .execute();
}

const selectAllFromQuery = db
  .select({
    restaurant: {
      id: restaurantTable.publicId,
      name: restaurantTable.name
    },
    costumer: commandaTable.costumer,
    table: commandaTable.table,
    id: commandaTable.publicId
  })
  .from(restaurantTable)
  .innerJoin(commandaTable, eq(restaurantTable.id, commandaTable.restaurant))
  .where(eq(restaurantTable.publicId, placeholder("restaurant")))
  .prepare();

export async function getAllFrom(restaurant: string) {
  const a = await selectAllFromQuery.execute({ restaurant });

  return a;
}
