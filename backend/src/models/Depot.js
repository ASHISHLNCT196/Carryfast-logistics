const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Depot = sequelize.define("Depot", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  capacity: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
}, { tableName: "depots" });

module.exports = Depot;
