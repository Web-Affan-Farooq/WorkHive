import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as Schema from "./schema";

const db = drizzle(process.env.DATABASE_URL_NEON!, { schema: Schema });

export default db;
