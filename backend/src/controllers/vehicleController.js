const { Vehicle, AuditLog } = require("../models");
const { Op } = require("sequelize");

async function list(req, res, next) {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const where = search
      ? { plate_number: { [Op.like]: `%${search}%` } }
      : {};
    const offset = (page - 1) * limit;
    const { rows, count } = await Vehicle.findAndCountAll({ where, limit: +limit, offset, order: [["id", "DESC"]] });
    res.json({ data: rows, total: count, page: +page, limit: +limit });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { plate_number, vehicle_type, transporter, owner_name } = req.body;
    if (!plate_number) return res.status(400).json({ error: "plate_number is required" });

    const vehicle = await Vehicle.create({ plate_number, vehicle_type, transporter, owner_name });
    await AuditLog.create({ user_id: req.user.id, action: "CREATE", entity: "Vehicle", entity_id: vehicle.id, new_value: JSON.stringify(vehicle) });
    res.status(201).json(vehicle);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "A vehicle with this plate number already exists" });
    }
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    const oldValue = JSON.stringify(vehicle);
    await vehicle.update(req.body);
    await AuditLog.create({ user_id: req.user.id, action: "UPDATE", entity: "Vehicle", entity_id: vehicle.id, old_value: oldValue, new_value: JSON.stringify(vehicle) });
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
}

async function deactivate(req, res, next) {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    await vehicle.update({ status: "inactive" });
    await AuditLog.create({ user_id: req.user.id, action: "DEACTIVATE", entity: "Vehicle", entity_id: vehicle.id });
    res.json({ message: "Vehicle deactivated", vehicle });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, deactivate };
