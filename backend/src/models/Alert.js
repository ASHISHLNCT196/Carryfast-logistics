const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Alert = sequelize.define("Alert", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  alert_type: { type: DataTypes.STRING, allowNull: false },
  entry_id: { type: DataTypes.INTEGER },
  message: { type: DataTypes.STRING },
  severity: { type: DataTypes.ENUM("low", "medium", "high"), defaultValue: "medium" },
  acknowledged: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: "alerts" });

module.exports = Alert;
