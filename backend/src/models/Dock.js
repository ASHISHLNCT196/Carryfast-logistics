const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Dock = sequelize.define("Dock", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  depot_id: { type: DataTypes.INTEGER, allowNull: false },
  dock_number: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM("available", "occupied", "maintenance"), defaultValue: "available" },
}, { tableName: "docks" });

module.exports = Dock;
