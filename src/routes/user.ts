import { eq, placeholder } from "drizzle-orm";
import { FastifyInstance } from "..";
import { encrypt } from "../crypt";
import db from "../database/db";
import { employeeTable } from "../database/schema";
import { nanoid } from "nanoid/async";

const selectAllQuery = db.select().from(employeeTable).prepare();

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get all users",
        description: "Get all users from the database",
        tags: ["users"],
        response: {
          200: {
            description: "Successful response",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                username: { type: "string" },
                email: { type: "string" },
                password: { type: "string" }
              },
              required: ["id", "username", "email", "password"],
              additionalProperties: false
            }
          }
        }
      } as const
    },
    async (_request, reply) => {
      const users = await selectAllQuery.execute();

      return reply.send(users);
    }
  );

  const userByUsername = db
    .select({
      id: employeeTable.id,
      username: employeeTable.username,
      email: employeeTable.email
    })
    .from(employeeTable)
    .where(eq(employeeTable.username, placeholder("username")))
    .prepare();

  fastify.get(
    "/:username",
    {
      schema: {
        summary: "Get user by username",
        description: "Get user by username from the database",
        tags: ["users"],
        params: {
          type: "object",
          properties: {
            username: { type: "string", minLength: 3, maxLength: 255 }
          },
          required: ["username"],
          additionalProperties: false
        }
      } as const
    },
    async (request, reply) => {
      const username = request.params.username;
      const user = await userByUsername.execute({ username });
      return reply.send(user);
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            username: { type: "string", minLength: 3, maxLength: 255 },
            email: { type: "string", format: "email", maxLength: 255 },
            password: { type: "string", minLength: 8, maxLength: 255 }
          },
          required: ["username", "email", "password"],
          additionalProperties: false
        },
        response: {
          201: {
            description: "User created successfully",
            type: "string",
            const: "User created"
          },
          500: {
            description: "Error creating user",
            type: "string",
            const: "Error creating user"
          }
        }
      } as const
    },
    async (request, reply) => {
      const user = request.body;

      const [publicId, encryptedPassword] = await Promise.all([
        nanoid(),
        encrypt(user.password)
      ]);

      const status = await db.insert(employeeTable).values({
        ...user,
        password: encryptedPassword,
        publicId
      });

      if (status.rowsAffected !== 1) {
        return reply.status(500).send("Error creating user");
      }

      return reply.status(201).send("User created");
    }
  );
}
