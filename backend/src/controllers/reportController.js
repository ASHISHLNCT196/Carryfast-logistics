const { Op } = require("sequelize");
const { Entry, Exit, Vehicle } = require("../models");

async function daily(req, res, next) {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const entries = await Entry.findAll({
      where: { entry_time: { [Op.gte]: date, [Op.lt]: nextDay } },
      include: [Vehicle],
      order: [["entry_time", "ASC"]],
    });

    const exits = await Exit.findAll({
      where: { exit_time: { [Op.gte]: date, [Op.lt]: nextDay } },
      order: [["exit_time", "ASC"]],
    });

    res.json({
      date: date.toISOString().split("T")[0],
      totalEntries: entries.length,
      totalExits: exits.length,
      averageCampusMinutes: exits.length
        ? Math.round(exits.reduce((s, e) => s + (e.campus_duration_min || 0), 0) / exits.length)
        : 0,
      entries,
      exits,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { daily };
