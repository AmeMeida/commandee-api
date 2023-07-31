import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as schema from "./schema";
import { DATABASE_URL } from "../enviroment";

const connection = connect({ url: DATABASE_URL });

export default drizzle(connection, {
  schema,
  logger: true
});
