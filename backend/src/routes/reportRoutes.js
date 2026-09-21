const router = require("express").Router();
const { daily } = require("../controllers/reportController");
const { authenticate, requireRole } = require("../middleware/auth");

router.get("/daily", authenticate, requireRole("admin"), daily);

module.exports = router;
