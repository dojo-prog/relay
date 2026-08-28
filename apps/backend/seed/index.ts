import pool from "../src/database/db";
import seedUsers from "./users/seed";

const seedDatabase = async () => {
  try {
    console.log("Starting database seed...");

    await pool.query("BEGIN");

    await seedUsers();

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Failed to seed database", error);
  }
};

seedDatabase();
