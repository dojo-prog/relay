import ENV from "../config/env";
import pool from "./db";

const checkDbConn = async () => {
  try {
    await pool.query(`SELECT 1`);

    console.log("PostgreSQL database connected:", ENV.DATABASE_NAME);
  } catch (error) {
    console.error("Database connection failed", error);
    throw error;
  }
};

export default checkDbConn;
