const { Dock, Depot } = require("../models");

async function list(req, res, next) {
  try {
    const docks = await Dock.findAll({ include: [Depot], order: [["id", "ASC"]] });
    res.json(docks);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const dock = await Dock.create(req.body);
    res.status(201).json(dock);
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const dock = await Dock.findByPk(req.params.id);
    if (!dock) return res.status(404).json({ error: "Dock not found" });
    await dock.update({ status: req.body.status });
    res.json(dock);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, updateStatus };
