import { Pool } from "pg";
import ENV from "../config/env";

const pool = new Pool({
  // host: ENV.DATABASE_HOST,
  // port: ENV.DATABASE_PORT,
  // database: ENV.DATABASE_NAME,
  // user: ENV.DATABASE_USER,
  // password: ENV.DATABASE_PASSWORD,

  connectionString:
    ENV.APP_ENV === "render"
      ? ENV.INTERNAL_DATABASE_URL
      : ENV.EXTERNAL_DATABASE_URL,

  ssl: {
    rejectUnauthorized: ENV.NODE_ENV === "production" ? true : false,
  },
});

export default pool;
