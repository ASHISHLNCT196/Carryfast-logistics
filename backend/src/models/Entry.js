const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Entry = sequelize.define("Entry", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  vehicle_id: { type: DataTypes.INTEGER, allowNull: false },
  plate_number: { type: DataTypes.STRING, allowNull: false },
  entry_time: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  anpr_image_url: { type: DataTypes.STRING },
  confidence_score: { type: DataTypes.FLOAT },
  gate_id: { type: DataTypes.STRING, defaultValue: "ENTRY_GATE_1" },
  status: { type: DataTypes.ENUM("active", "closed"), defaultValue: "active" },
  manual_override: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: "entries" });

module.exports = Entry;
