const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LoadingRecord = sequelize.define("LoadingRecord", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  entry_id: { type: DataTypes.INTEGER, allowNull: false },
  dock_id: { type: DataTypes.INTEGER, allowNull: false },
  loading_start: { type: DataTypes.DATE },
  loading_end: { type: DataTypes.DATE },
  duration_minutes: { type: DataTypes.INTEGER },
  status: { type: DataTypes.ENUM("pending", "in_progress", "completed"), defaultValue: "pending" },
}, { tableName: "loading_records" });

module.exports = LoadingRecord;
