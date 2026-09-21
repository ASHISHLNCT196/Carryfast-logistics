const { LoadingRecord, DockAssignment } = require("../models");

async function start(req, res, next) {
  try {
    const assignment = await DockAssignment.findOne({ where: { entry_id: req.params.id } });
    if (!assignment || !assignment.dock_id) {
      return res.status(400).json({ error: "No dock assignment found for this entry — assign a dock before starting loading" });
    }

    let record = await LoadingRecord.findOne({ where: { entry_id: req.params.id } });
    if (!record) {
      record = await LoadingRecord.create({ entry_id: req.params.id, dock_id: assignment.dock_id });
    }
    await record.update({ loading_start: new Date(), status: "in_progress" });
    res.json(record);
  } catch (err) {
    next(err);
  }
}

async function complete(req, res, next) {
  try {
    const record = await LoadingRecord.findOne({ where: { entry_id: req.params.id } });
    if (!record || !record.loading_start) {
      return res.status(400).json({ error: "Loading has not been started for this entry" });
    }
    const end = new Date();
    const durationMinutes = Math.round((end - new Date(record.loading_start)) / 60000);
    await record.update({ loading_end: end, duration_minutes: durationMinutes, status: "completed" });
    res.json(record);
  } catch (err) {
    next(err);
  }
}

module.exports = { start, complete };
