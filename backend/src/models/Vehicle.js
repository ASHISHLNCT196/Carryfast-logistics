const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Vehicle = sequelize.define("Vehicle", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  plate_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  vehicle_type: { type: DataTypes.STRING },
  transporter: { type: DataTypes.STRING },
  owner_name: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
}, { tableName: "vehicles" });

module.exports = Vehicle;
