const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DockAssignment = sequelize.define("DockAssignment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  entry_id: { type: DataTypes.INTEGER, allowNull: false },
  depot_id: { type: DataTypes.INTEGER, allowNull: false },
  order_id: { type: DataTypes.STRING },
  dock_id: { type: DataTypes.INTEGER, allowNull: false },
  assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  assigned_by: { type: DataTypes.INTEGER },
}, { tableName: "dock_assignments" });

module.exports = DockAssignment;
