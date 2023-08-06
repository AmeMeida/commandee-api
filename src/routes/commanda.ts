import { FastifyInstance } from "..";
import * as commandaControl from "../controllers/commanda";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/:id",
    {
      schema: {
        summary: "Get commanda by id",
        description: "Get commanda by id from the database",
        tags: ["commanda"],
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Commanda id",
              minLength: 15,
              maxLength: 15,
              pattern: "^[a-zA-Z0-9]{15}$"
            }
          },
          required: ["id"],
          additionalProperties: false
        }
      } as const
    },
    async (_request, reply) => {
      reply.send("hi");
    }
  );

  fastify.get(
    "/restaurant/:restaurantId",
    {
      schema: {
        summary: "Get all commandas from restaurant",
        description: "Get all commandas from restaurant from the database",
        tags: ["commanda"],
        params: {
          type: "object",
          properties: {
            restaurantId: {
              type: "string",
              description: "Restaurant id",
              minLength: 15,
              maxLength: 15,
              pattern: "^[a-zA-Z0-9]{15}$"
            }
          },
          required: ["restaurantId"],
          additionalProperties: false
        }
      } as const
    },
    async (request, reply) => {
      const commandas = await commandaControl.getAllFrom(
        request.params.restaurantId
      );

      return reply.send(commandas);
    }
  );
}
