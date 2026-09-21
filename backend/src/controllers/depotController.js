const { Depot, Dock } = require("../models");

async function list(req, res, next) {
  try {
    const depots = await Depot.findAll({ include: [Dock], order: [["id", "ASC"]] });
    res.json(depots);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const depot = await Depot.create(req.body);
    res.status(201).json(depot);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create };
