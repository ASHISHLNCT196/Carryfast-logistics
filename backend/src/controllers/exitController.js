const { Entry, Exit, Vehicle, Dock, DockAssignment, Alert } = require("../models");
const { recognizePlate } = require("../services/anprService");

// FR-12/FR-13: hard rule — no exit without a matching active entry (R05 in the risk register)
async function createExit(req, res, next) {
  try {
    const { plate_number } = req.body;
    const anpr = await recognizePlate({ plate_number });

    const vehicle = await Vehicle.findOne({ where: { plate_number: anpr.plate_number } });
    if (!vehicle) {
      return res.status(422).json({ error: "Plate not recognised against the vehicle registry", anpr });
    }

    const entry = await Entry.findOne({ where: { vehicle_id: vehicle.id, status: "active" } });
    if (!entry) {
      await Alert.create({
        alert_type: "EXIT_WITHOUT_ENTRY",
        message: `Vehicle ${vehicle.plate_number} attempted exit with no active entry on record.`,
        severity: "high",
      });
      return res.status(409).json({ error: "No active entry found for this vehicle. Exit rejected — barrier stays closed." });
    }

    const exitTime = new Date();
    const campusMinutes = Math.round((exitTime - new Date(entry.entry_time)) / 60000);

    const exitRecord = await Exit.create({
      entry_id: entry.id,
      vehicle_id: vehicle.id,
      plate_number: vehicle.plate_number,
      exit_time: exitTime,
      anpr_image_url: anpr.image_url,
      campus_duration_min: campusMinutes,
    });

    await entry.update({ status: "closed" });

    // Free up the dock if one was assigned
    const assignment = await DockAssignment.findOne({ where: { entry_id: entry.id } });
    if (assignment && assignment.dock_id) {
      await Dock.update({ status: "available" }, { where: { id: assignment.dock_id } });
    }

    res.status(201).json({ exit: exitRecord, campus_duration_min: campusMinutes });
  } catch (err) {
    next(err);
  }
}

module.exports = { createExit };
