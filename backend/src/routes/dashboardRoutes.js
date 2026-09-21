const router = require("express").Router();
const { kpis } = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");

router.get("/kpis", authenticate, kpis);

module.exports = router;
