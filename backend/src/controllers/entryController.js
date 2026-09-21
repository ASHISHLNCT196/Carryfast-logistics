const { Entry, Vehicle, DockAssignment, Dock, Alert } = require("../models");
const { recognizePlate } = require("../services/anprService");

// FR-03/04/05: capture plate -> match vehicle -> create entry (or flag for manual override)
async function createEntry(req, res, next) {
  try {
    const { plate_number, manual_override, gate_id } = req.body;

    const anpr = await recognizePlate({ plate_number });

    let vehicle = await Vehicle.findOne({ where: { plate_number: anpr.plate_number } });
    if (!vehicle && !manual_override) {
      return res.status(422).json({
        error: "Unregistered vehicle. Resubmit with manual_override=true to allow gate operator override.",
        anpr,
      });
    }
    if (!vehicle && manual_override) {
      vehicle = await Vehicle.create({ plate_number: anpr.plate_number, vehicle_type: "unregistered" });
    }

    // R04: block duplicate active entry for the same vehicle
    const existingActive = await Entry.findOne({ where: { vehicle_id: vehicle.id, status: "active" } });
    if (existingActive) {
      await Alert.create({
        alert_type: "DUPLICATE_ENTRY",
        entry_id: existingActive.id,
        message: `Vehicle ${vehicle.plate_number} already has an active entry (#${existingActive.id}). Possible missed exit.`,
        severity: "high",
      });
      return res.status(409).json({ error: "This vehicle already has an active entry on campus", existingEntryId: existingActive.id });
    }

    const entry = await Entry.create({
      vehicle_id: vehicle.id,
      plate_number: vehicle.plate_number,
      anpr_image_url: anpr.image_url,
      confidence_score: anpr.confidence,
      gate_id: gate_id || "ENTRY_GATE_1",
      manual_override: !!manual_override || anpr.requires_manual_review,
    });

    if (anpr.requires_manual_review) {
      await Alert.create({
        alert_type: "LOW_CONFIDENCE_READ",
        entry_id: entry.id,
        message: `ANPR confidence ${anpr.confidence} below threshold — flagged for manual verification.`,
        severity: "medium",
      });
    }

    res.status(201).json({ entry, vehicle, anpr });
  } catch (err) {
    next(err);
  }
}

async function assignDepot(req, res, next) {
  try {
    const { depot_id, order_id, dock_id } = req.body;
    const entry = await Entry.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    if (entry.status !== "active") return res.status(400).json({ error: "Entry is not active" });

    const assignment = await DockAssignment.create({
      entry_id: entry.id,
      depot_id,
      order_id,
      dock_id: dock_id || null,
      assigned_by: req.user.id,
    });

    if (dock_id) {
      await Dock.update({ status: "occupied" }, { where: { id: dock_id } });
    }

    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
}

async function assignDock(req, res, next) {
  try {
    const { dock_id } = req.body;
    const dock = await Dock.findByPk(dock_id);
    if (!dock) return res.status(404).json({ error: "Dock not found" });
    if (dock.status !== "available") return res.status(409).json({ error: "Dock is not available" });

    const assignment = await DockAssignment.findOne({ where: { entry_id: req.params.id } });
    if (!assignment) return res.status(404).json({ error: "No depot assignment found for this entry — assign a depot first" });

    await assignment.update({ dock_id });
    await dock.update({ status: "occupied" });

    res.json(assignment);
  } catch (err) {
    next(err);
  }
}

async function listActive(req, res, next) {
  try {
    const entries = await Entry.findAll({
      where: { status: "active" },
      include: [Vehicle],
      order: [["entry_time", "DESC"]],
    });
    res.json(entries);
  } catch (err) {
    next(err);
  }
}

module.exports = { createEntry, assignDepot, assignDock, listActive };
