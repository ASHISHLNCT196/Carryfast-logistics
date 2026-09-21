const sequelize = require("../config/db");
const User = require("./User");
const Vehicle = require("./Vehicle");
const Depot = require("./Depot");
const Dock = require("./Dock");
const Entry = require("./Entry");
const DockAssignment = require("./DockAssignment");
const LoadingRecord = require("./LoadingRecord");
const Exit = require("./Exit");
const Alert = require("./Alert");
const AuditLog = require("./AuditLog");

// Associations
Vehicle.hasMany(Entry, { foreignKey: "vehicle_id" });
Entry.belongsTo(Vehicle, { foreignKey: "vehicle_id" });

Depot.hasMany(Dock, { foreignKey: "depot_id" });
Dock.belongsTo(Depot, { foreignKey: "depot_id" });

Entry.hasOne(DockAssignment, { foreignKey: "entry_id" });
DockAssignment.belongsTo(Entry, { foreignKey: "entry_id" });
DockAssignment.belongsTo(Depot, { foreignKey: "depot_id" });
DockAssignment.belongsTo(Dock, { foreignKey: "dock_id" });

Entry.hasOne(LoadingRecord, { foreignKey: "entry_id" });
LoadingRecord.belongsTo(Entry, { foreignKey: "entry_id" });
LoadingRecord.belongsTo(Dock, { foreignKey: "dock_id" });

Entry.hasOne(Exit, { foreignKey: "entry_id" });
Exit.belongsTo(Entry, { foreignKey: "entry_id" });
Exit.belongsTo(Vehicle, { foreignKey: "vehicle_id" });

Entry.hasMany(Alert, { foreignKey: "entry_id" });
Alert.belongsTo(Entry, { foreignKey: "entry_id" });

module.exports = {
  sequelize,
  User,
  Vehicle,
  Depot,
  Dock,
  Entry,
  DockAssignment,
  LoadingRecord,
  Exit,
  Alert,
  AuditLog,
};
