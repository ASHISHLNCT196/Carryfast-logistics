const { Op, fn, col, literal } = require("sequelize");
const { Entry, Exit, LoadingRecord, DockAssignment, Dock } = require("../models");

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

async function kpis(req, res, next) {
  try {
    const today = startOfToday();

    const vehiclesInside = await Entry.count({ where: { status: "active" } });

    const vehiclesExitedToday = await Exit.count({ where: { exit_time: { [Op.gte]: today } } });

    const closedTripsToday = await Exit.findAll({ where: { exit_time: { [Op.gte]: today } } });
    const avgCampusTime = closedTripsToday.length
      ? Math.round(closedTripsToday.reduce((sum, e) => sum + (e.campus_duration_min || 0), 0) / closedTripsToday.length)
      : 0;

    const completedLoadsToday = await LoadingRecord.findAll({
      where: { status: "completed", loading_end: { [Op.gte]: today } },
    });
    const avgLoadingTime = completedLoadsToday.length
      ? Math.round(completedLoadsToday.reduce((sum, l) => sum + (l.duration_minutes || 0), 0) / completedLoadsToday.length)
      : 0;

    const dockAssignmentsToday = await DockAssignment.findAll({
      where: { assigned_at: { [Op.gte]: today } },
      include: [{ model: require("../models").Entry }],
    });
    const waitTimes = dockAssignmentsToday
      .filter((a) => a.Entry)
      .map((a) => (new Date(a.assigned_at) - new Date(a.Entry.entry_time)) / 60000);
    const avgWaitingTime = waitTimes.length
      ? Math.round(waitTimes.reduce((s, v) => s + v, 0) / waitTimes.length)
      : 0;

    const trucksPerDepotRaw = await DockAssignment.findAll({
      where: { assigned_at: { [Op.gte]: today } },
      attributes: ["depot_id", [fn("COUNT", col("id")), "count"]],
      group: ["depot_id"],
    });
    const trucksPerDepot = trucksPerDepotRaw.map((r) => ({ depot_id: r.depot_id, count: Number(r.get("count")) }));

    const trucksPerHourRaw = await Entry.findAll({
      where: { entry_time: { [Op.gte]: today } },
      attributes: [[fn("HOUR", col("entry_time")), "hour"], [fn("COUNT", col("id")), "count"]],
      group: [literal("HOUR(entry_time)")],
    });
    const trucksPerHour = trucksPerHourRaw.map((r) => ({ hour: Number(r.get("hour")), count: Number(r.get("count")) }));

    const dockCounts = await Dock.findAll({ attributes: ["status", [fn("COUNT", col("id")), "count"]], group: ["status"] });
    const dockStatusSummary = dockCounts.reduce((acc, r) => {
      acc[r.status] = Number(r.get("count"));
      return acc;
    }, { available: 0, occupied: 0, maintenance: 0 });

    res.json({
      vehiclesInside,
      vehiclesExitedToday,
      avgWaitingTime,
      avgLoadingTime,
      avgCampusTime,
      trucksPerDepot,
      trucksPerHour,
      dockStatusSummary,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { kpis };
