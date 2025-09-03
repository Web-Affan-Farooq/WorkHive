import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as Schema from "./schema";

const db = drizzle(process.env.NEON_POSTGRES_URL!, { schema: Schema });

export default db;
