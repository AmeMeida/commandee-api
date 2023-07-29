import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const pool = mysql.createPool(import.meta.env.DATABASE_URL);

export default drizzle(pool, { schema });


