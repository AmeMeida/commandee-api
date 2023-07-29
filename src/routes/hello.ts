import { eq } from "drizzle-orm";
import { FastifyInstance } from "..";
import db from "../database/db";
import { order } from "../database/schema";

export default async function(fastify: FastifyInstance) {
  fastify.get("/hello", async (_request, reply) => {
    const orders = await db.select().from(order).where(eq(order.status, "done"));
    return reply.send(orders);
  });
}
