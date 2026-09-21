require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");
    await sequelize.sync(); // dev convenience; use migrations in production
    app.listen(PORT, () => console.log(`Carryfast backend listening on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
