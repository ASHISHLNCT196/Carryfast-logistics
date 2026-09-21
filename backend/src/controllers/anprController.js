const { recognizePlate } = require("../services/anprService");

// Simulates the camera -> ANPR pipeline described in Part 2.5 of the plan.
// A real deployment points this at the Plate Recognizer API instead.
async function recognize(req, res, next) {
  try {
    const result = await recognizePlate(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { recognize };
