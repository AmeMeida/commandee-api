import { eq } from "drizzle-orm";
import { FastifyInstance } from "..";
import db from "../database/db";
import { commanda, order } from "../database/schema";

export default async function (fastify: FastifyInstance) {
  fastify.get("/hello", async (_request, reply) => {
    const orders = await db
      .select({
        quantity: order.quantity,
        commanda: commanda
      })
      .from(order)
      .innerJoin(commanda, eq(order.commanda, commanda.id))
      .where(eq(order.status, "done"));
    return reply.send(orders);
  });
}
