import { FastifyInstance } from "..";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (_request, reply) => {
    return reply.send("Hello World!");
  });
}
