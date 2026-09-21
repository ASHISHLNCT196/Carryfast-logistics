const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Exit = sequelize.define("Exit", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  entry_id: { type: DataTypes.INTEGER, allowNull: false },
  vehicle_id: { type: DataTypes.INTEGER, allowNull: false },
  plate_number: { type: DataTypes.STRING, allowNull: false },
  exit_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  anpr_image_url: { type: DataTypes.STRING },
  campus_duration_min: { type: DataTypes.INTEGER },
}, { tableName: "exits" });

module.exports = Exit;
