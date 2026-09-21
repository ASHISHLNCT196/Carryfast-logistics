const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AuditLog = sequelize.define("AuditLog", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  action: { type: DataTypes.STRING, allowNull: false },
  entity: { type: DataTypes.STRING },
  entity_id: { type: DataTypes.INTEGER },
  old_value: { type: DataTypes.TEXT },
  new_value: { type: DataTypes.TEXT },
  reason: { type: DataTypes.STRING },
}, { tableName: "audit_log" });

module.exports = AuditLog;
