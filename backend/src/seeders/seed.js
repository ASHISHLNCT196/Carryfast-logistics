require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, User, Depot, Dock, Vehicle } = require("../models");

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    // Admin user
    const existingAdmin = await User.findOne({ where: { email: "admin@carryfast.com" } });
    if (!existingAdmin) {
      const password_hash = await bcrypt.hash("Admin@123", 10);
      await User.create({
        name: "Ashish Kumar Jain",
        email: "admin@carryfast.com",
        password_hash,
        role: "admin",
      });
      console.log("Created admin user: admin@carryfast.com / Admin@123");
    }

    // Operator user
    const existingOperator = await User.findOne({ where: { email: "operator@carryfast.com" } });
    if (!existingOperator) {
      const password_hash = await bcrypt.hash("Operator@123", 10);
      await User.create({
        name: "Gate Operator",
        email: "operator@carryfast.com",
        password_hash,
        role: "user",
      });
      console.log("Created operator user: operator@carryfast.com / Operator@123");
    }

    // Depots + docks
    const depotNames = ["North Depot", "South Depot", "East Depot"];
    for (const name of depotNames) {
      let depot = await Depot.findOne({ where: { name } });
      if (!depot) {
        depot = await Depot.create({ name, location: "Carryfast Campus", capacity: 50 });
        console.log(`Created depot: ${name}`);
      }
      const dockCount = await Dock.count({ where: { depot_id: depot.id } });
      if (dockCount === 0) {
        for (let i = 1; i <= 4; i++) {
          await Dock.create({ depot_id: depot.id, dock_number: `${name.split(" ")[0][0]}-${i}` });
        }
        console.log(`Created 4 docks for ${name}`);
      }
    }

    // Sample vehicles
    const sampleVehicles = [
      { plate_number: "MH12AB1234", vehicle_type: "Truck", transporter: "Speedway Transporters", owner_name: "Speedway Ltd." },
      { plate_number: "MH14CD5678", vehicle_type: "Trailer", transporter: "Carryfast Fleet", owner_name: "Carryfast Logistics" },
      { plate_number: "DL01EF9012", vehicle_type: "Truck", transporter: "National Carriers", owner_name: "National Carriers Pvt Ltd" },
    ];
    for (const v of sampleVehicles) {
      const exists = await Vehicle.findOne({ where: { plate_number: v.plate_number } });
      if (!exists) await Vehicle.create(v);
    }
    console.log("Seeded sample vehicles.");

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
