import mockUsers from "./data";
import pool from "../../src/database/db";
import buildInserQueries from "../../src/utils/query-builder/buildInsertQueries";
import bcrypt from "bcryptjs";

const seedUsers = async () => {
  console.log("\nSeeding users...");

  console.log("Truncating users table...");
  await pool.query(`TRUNCATE TABLE users CASCADE`);

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash("testPass", salt);

  for (const u of mockUsers) {
    const payload = {
      ...u,
      password_hash,
    };

    const { columnsStr, placeholdersStr, values } = buildInserQueries(payload);

    await pool.query(
      `
        INSERT INTO users (${columnsStr})
        VALUES (${placeholdersStr})
        `,
      values,
    );

    console.log("Inserted user:", u.username);
  }

  console.log(`Seeded ${mockUsers.length} users successfully.`);
};

export default seedUsers;
