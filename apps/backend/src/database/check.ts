import ENV from "../config/env";
import pool from "./db";

const checkDbConn = async () => {
  try {
    await pool.query(`SELECT 1`);

    console.log(`PostgreSQL database connected on ${ENV.DB_ENV}`);
  } catch (error) {
    console.error("Database connection failed", error);
    throw error;
  }
};

export default checkDbConn;
