const router = require("express").Router();
const ctrl = require("../controllers/depotController");
const { authenticate, requireRole } = require("../middleware/auth");

router.use(authenticate);
router.get("/", ctrl.list);
router.post("/", requireRole("admin"), ctrl.create);

module.exports = router;
